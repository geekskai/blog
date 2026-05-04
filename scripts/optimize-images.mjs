#!/usr/bin/env node

/**
 * 图片批量压缩优化脚本
 *
 * 使用 sharp 库对 public/static/images 目录下的所有图片进行压缩优化
 * 支持 PNG、JPG/JPEG、WebP 格式
 *
 * 用法:
 *   node scripts/optimize-images.mjs                  # 直接压缩（覆盖原文件）
 *   node scripts/optimize-images.mjs --dry-run        # 仅预览，不实际压缩
 *   node scripts/optimize-images.mjs --backup         # 压缩前备份原文件
 *   node scripts/optimize-images.mjs --min-size 50    # 仅处理大于 50KB 的文件（默认 10KB）
 *   node scripts/optimize-images.mjs --quality 70     # 设置压缩质量（默认 80）
 *   node scripts/optimize-images.mjs --max-width 1920 # 限制最大宽度（超过则等比缩放）
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== 配置 ==========
const DEFAULT_CONFIG = {
  // 图片目录
  imageDir: path.resolve(__dirname, "../public/static/images"),
  // 备份目录
  backupDir: path.resolve(__dirname, "../public/static/images-backup"),
  // 是否创建备份
  backup: false,
  // 是否仅预览
  dryRun: false,
  // 最小处理文件大小 (KB)
  minSizeKB: 10,
  // 压缩质量 (1-100)
  quality: 80,
  // 最大宽度 (px), 0 表示不限制
  maxWidth: 0,
  // 并发数
  concurrency: 8,
  // 支持的图片格式
  supportedExtensions: new Set([".png", ".jpg", ".jpeg", ".webp"]),
};

// ========== 工具函数 ==========
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatPercent(original, optimized) {
  if (original === 0) return "0%";
  const saved = ((original - optimized) / original) * 100;
  return saved.toFixed(1) + "%";
}

function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULT_CONFIG };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--dry-run":
        config.dryRun = true;
        break;
      case "--backup":
        config.backup = true;
        break;
      case "--min-size":
        config.minSizeKB = parseInt(args[++i], 10);
        break;
      case "--quality":
        config.quality = parseInt(args[++i], 10);
        break;
      case "--max-width":
        config.maxWidth = parseInt(args[++i], 10);
        break;
      case "--concurrency":
        config.concurrency = parseInt(args[++i], 10);
        break;
      case "--help":
        console.log(`
图片批量压缩优化脚本

用法:
  node scripts/optimize-images.mjs [选项]

选项:
  --dry-run          仅预览，不实际压缩
  --backup           压缩前备份原文件到 images-backup 目录
  --min-size <KB>    仅处理大于指定大小的文件（默认: 10 KB）
  --quality <1-100>  压缩质量（默认: 80）
  --max-width <px>   限制最大宽度，超过则等比缩放（默认: 不限制）
  --concurrency <n>  并发处理数（默认: 8）
  --help             显示帮助信息
        `);
        process.exit(0);
    }
  }

  return config;
}

// ========== 核心逻辑 ==========

/**
 * 递归遍历目录，获取所有图片文件路径
 */
async function getAllImageFiles(dir, extensions) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllImageFiles(fullPath, extensions)));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * 压缩单张图片
 */
async function optimizeImage(sharp, filePath, config) {
  const ext = path.extname(filePath).toLowerCase();
  const stat = await fs.stat(filePath);
  const originalSize = stat.size;

  // 跳过太小的文件
  if (originalSize < config.minSizeKB * 1024) {
    return { filePath, originalSize, optimizedSize: originalSize, skipped: true, reason: "太小" };
  }

  try {
    const inputBuffer = await fs.readFile(filePath);
    let pipeline = sharp(inputBuffer);

    // 获取元数据用于判断是否需要缩放
    if (config.maxWidth > 0) {
      const metadata = await pipeline.metadata();
      if (metadata.width && metadata.width > config.maxWidth) {
        pipeline = pipeline.resize(config.maxWidth, null, {
          withoutEnlargement: true,
          fit: "inside",
        });
      }
    }

    // 根据格式应用不同的压缩策略
    let outputBuffer;
    switch (ext) {
      case ".png":
        outputBuffer = await pipeline
          .png({
            quality: config.quality,
            compressionLevel: 9,
            palette: true,
            effort: 10,
          })
          .toBuffer();
        break;

      case ".jpg":
      case ".jpeg":
        outputBuffer = await pipeline
          .jpeg({
            quality: config.quality,
            mozjpeg: true, // 使用 mozjpeg 编码器获得更好的压缩率
          })
          .toBuffer();
        break;

      case ".webp":
        outputBuffer = await pipeline
          .webp({
            quality: config.quality,
            effort: 6,
          })
          .toBuffer();
        break;

      default:
        return { filePath, originalSize, optimizedSize: originalSize, skipped: true, reason: "不支持的格式" };
    }

    const optimizedSize = outputBuffer.length;

    // 如果压缩后反而更大，跳过
    if (optimizedSize >= originalSize) {
      return { filePath, originalSize, optimizedSize: originalSize, skipped: true, reason: "已是最优" };
    }

    // 备份原文件
    if (config.backup && !config.dryRun) {
      const relativePath = path.relative(config.imageDir, filePath);
      const backupPath = path.join(config.backupDir, relativePath);
      await fs.mkdir(path.dirname(backupPath), { recursive: true });
      await fs.copyFile(filePath, backupPath);
    }

    // 写入压缩后的文件
    if (!config.dryRun) {
      await fs.writeFile(filePath, outputBuffer);
    }

    return { filePath, originalSize, optimizedSize, skipped: false };
  } catch (err) {
    return { filePath, originalSize, optimizedSize: originalSize, skipped: true, reason: `错误: ${err.message}` };
  }
}

/**
 * 并发控制器
 */
async function processWithConcurrency(items, concurrency, processor) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await processor(items[currentIndex]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ========== 主程序 ==========
async function main() {
  const config = parseArgs();

  console.log("\n🖼️  图片批量压缩优化工具\n");
  console.log("━".repeat(60));
  console.log(`📂 目标目录: ${config.imageDir}`);
  console.log(`🎨 压缩质量: ${config.quality}`);
  console.log(`📏 最小文件: ${config.minSizeKB} KB`);
  console.log(`📐 最大宽度: ${config.maxWidth > 0 ? config.maxWidth + "px" : "不限制"}`);
  console.log(`🔄 并发数量: ${config.concurrency}`);
  console.log(`💾 备份原图: ${config.backup ? "是" : "否"}`);
  console.log(`🔍 模拟运行: ${config.dryRun ? "是（不会修改文件）" : "否"}`);
  console.log("━".repeat(60));

  // 检查目录是否存在
  try {
    await fs.access(config.imageDir);
  } catch {
    console.error(`\n❌ 目录不存在: ${config.imageDir}`);
    process.exit(1);
  }

  // 动态导入 sharp
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("\n❌ 未安装 sharp 模块，正在安装...\n");
    const { execSync } = await import("node:child_process");
    try {
      execSync("npm install sharp --save-dev", {
        cwd: path.resolve(__dirname, ".."),
        stdio: "inherit",
      });
      sharp = (await import("sharp")).default;
    } catch (installErr) {
      console.error("❌ 安装 sharp 失败:", installErr.message);
      process.exit(1);
    }
  }

  // 扫描所有图片
  console.log("\n🔍 正在扫描图片文件...\n");
  const files = await getAllImageFiles(config.imageDir, config.supportedExtensions);
  console.log(`   找到 ${files.length} 个图片文件\n`);

  if (files.length === 0) {
    console.log("✅ 没有找到需要处理的图片文件");
    return;
  }

  // 开始处理
  console.log("⚡ 开始压缩优化...\n");
  const startTime = Date.now();

  let processedCount = 0;
  const results = await processWithConcurrency(files, config.concurrency, async (file) => {
    const result = await optimizeImage(sharp, file, config);
    processedCount++;

    const relativePath = path.relative(config.imageDir, file);
    const progress = `[${processedCount}/${files.length}]`;

    if (result.skipped) {
      process.stdout.write(`   ${progress} ⏭️  ${relativePath} (${result.reason})\n`);
    } else {
      const saved = formatPercent(result.originalSize, result.optimizedSize);
      const before = formatBytes(result.originalSize);
      const after = formatBytes(result.optimizedSize);
      process.stdout.write(
        `   ${progress} ✅ ${relativePath}: ${before} → ${after} (节省 ${saved})\n`
      );
    }

    return result;
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // ========== 汇总报告 ==========
  const optimized = results.filter((r) => !r.skipped);
  const skipped = results.filter((r) => r.skipped);
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
  const totalSaved = totalOriginal - totalOptimized;

  console.log("\n" + "━".repeat(60));
  console.log("📊 压缩报告");
  console.log("━".repeat(60));
  console.log(`   ⏱️  耗时: ${elapsed}s`);
  console.log(`   📁 总文件数: ${files.length}`);
  console.log(`   ✅ 已压缩: ${optimized.length}`);
  console.log(`   ⏭️  已跳过: ${skipped.length}`);
  console.log(`   📦 压缩前总大小: ${formatBytes(totalOriginal)}`);
  console.log(`   📦 压缩后总大小: ${formatBytes(totalOptimized)}`);
  console.log(`   💾 总节省空间: ${formatBytes(totalSaved)} (${formatPercent(totalOriginal, totalOptimized)})`);

  if (config.dryRun) {
    console.log(`\n   ⚠️  这是模拟运行，未修改任何文件`);
    console.log(`   💡 去掉 --dry-run 参数以实际执行压缩`);
  }

  if (config.backup && !config.dryRun) {
    console.log(`\n   💾 原始文件已备份到: ${config.backupDir}`);
  }

  // 输出 Top 10 节省最多的文件
  const topSaved = optimized
    .map((r) => ({
      ...r,
      saved: r.originalSize - r.optimizedSize,
    }))
    .sort((a, b) => b.saved - a.saved)
    .slice(0, 10);

  if (topSaved.length > 0) {
    console.log("\n" + "━".repeat(60));
    console.log("🏆 节省空间 Top 10");
    console.log("━".repeat(60));
    topSaved.forEach((r, i) => {
      const relativePath = path.relative(config.imageDir, r.filePath);
      console.log(
        `   ${i + 1}. ${relativePath}: ${formatBytes(r.originalSize)} → ${formatBytes(r.optimizedSize)} (节省 ${formatBytes(r.saved)})`
      );
    });
  }

  console.log("\n✨ 完成!\n");
}

main().catch((err) => {
  console.error("❌ 脚本执行失败:", err);
  process.exit(1);
});
