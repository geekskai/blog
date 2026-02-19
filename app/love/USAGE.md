# 💕 使用指南

## 🚀 快速开始

### 1. 访问页面
```
http://localhost:3000/love
或
https://your-domain.com/love
```

### 2. 基本交互

#### 🎆 放烟花
- **自动模式**: 页面会自动定期放烟花
- **手动触发**: 点击"点击放烟花 ✨"按钮
- **超级烟花**: 按钮会一次性发射8枚火箭

#### 🎵 播放音乐
1. 点击右上角的🎵按钮
2. 鼠标悬停可以调节音量
3. 再次点击暂停音乐

#### 💝 解锁彩蛋
- 在页面任意位置点击
- 每点击5次会显示一条特殊消息
- 共有5条隐藏消息等你发现

#### 📖 欣赏语录
- 底部会自动轮播浪漫语录
- 每8秒切换一次
- 圆点指示器显示当前位置

## 🎨 自定义教程

### 修改表白对象的名字

打开 `page.tsx`，找到第283行：

```tsx
<h1
  className="mb-3 text-5xl font-bold tracking-[0.15em] text-white"
  style={{
    textShadow: "0 0 20px #ff69b4, 0 0 40px #ff1493, 0 0 80px #ff69b4",
    animation: "glow-pulse 2s ease-in-out infinite",
  }}
>
  陈成连  {/* 👈 改成你喜欢的人的名字 */}
</h1>
```

### 修改表白内容

在 `page.tsx` 中找到并修改以下部分：

```tsx
{/* 第一段 */}
<div className="mb-6 text-lg leading-[2.2] tracking-[0.08em] text-pink-50/90">
  遇见你，是我这辈子
  <br />
  最美好的事情之一。
  <br />
  你的笑容，是我每天
  <br />
  最期待的风景。
</div>

{/* 第二段 */}
<div className="mb-8 text-lg leading-[2.2] tracking-[0.08em] text-pink-50/90">
  喜欢你说话的样子，
  <br />
  喜欢你认真的眼神，
  <br />
  喜欢每一个
  <span className="font-bold text-pink-400">有你在</span>
  的瞬间。
  <br />
  愿意陪你走过以后的每一天。
</div>
```

### 添加背景音乐

1. 准备音乐文件（MP3格式）
2. 将文件放到 `public/music/` 目录
3. 打开 `components/MusicPlayer.tsx`
4. 找到第66行，添加音乐源：

```tsx
<audio ref={audioRef} loop>
  <source src="/music/your-love-song.mp3" type="audio/mpeg" />
</audio>
```

**推荐歌曲**：
- 周杰伦 - 《告白气球》
- 邓紫棋 - 《喜欢你》
- 田馥甄 - 《小幸运》
- Taylor Swift - "Love Story"
- Ed Sheeran - "Perfect"

### 自定义浪漫语录

打开 `components/LoveQuotes.tsx`，修改第5-14行：

```tsx
const QUOTES = [
  "你的语录1",
  "你的语录2",
  "你的语录3",
  "你的语录4",
  "你的语录5",
  "你的语录6",
  "你的语录7",
  "你的语录8",
]
```

### 自定义隐藏彩蛋消息

打开 `components/SecretMessage.tsx`，修改第13-19行：

```tsx
const SECRET_MESSAGES = [
  "💝 你的第一条消息",
  "🌟 你的第二条消息",
  "🌹 你的第三条消息",
  "✨你的第四条消息",
  "💫 你的第五条消息",
]
```

### 调整烟花效果

#### 增加烟花频率
```tsx
// page.tsx 第156行
if (frameCountRef.current % 40 === 0) // 从80改为40，频率翻倍
```

#### 调整爆炸粒子数量
```tsx
// page.tsx 第81行
const count = 200 + Math.floor(Math.random() * 100) // 从120改为200
```

#### 修改烟花颜色
```tsx
// page.tsx 第20-32行
const COLORS = [
  "#ff69b4",  // 粉红
  "#ff1493",  // 深粉
  "#your-color-1", // 添加你的颜色
  "#your-color-2",
  // ...
]
```

## 🎯 部署指南

### 本地开发
```bash
npm run dev
# 访问 http://localhost:3000/love
```

### 生产部署
```bash
npm run build
npm start
```

### Vercel部署
1. 连接GitHub仓库
2. 自动部署
3. 获取部署URL
4. 分享给TA: `https://your-app.vercel.app/love`

### 自定义域名
1. 购买域名（如：love.your-name.com）
2. 在域名提供商添加DNS记录
3. 在Vercel绑定域名
4. 等待SSL证书生效

## 💡 使用场景示例

### 场景1：表白日
1. 提前部署好页面
2. 选择浪漫的时间（晚上8点）
3. 发送链接给TA
4. 附上一句话："有句话想对你说，点开看看？"

### 场景2：纪念日惊喜
1. 修改内容为纪念日主题
2. 添加专属的照片（待开发）
3. 计算相识天数（待开发）
4. 发送作为纪念日礼物

### 场景3：道歉
1. 修改语录为道歉的话
2. 修改主题色为温暖的橙色系
3. 添加诚意满满的文字
4. 配合实际行动

### 场景4：求婚
1. 修改标题为"嫁给我好吗？"
2. 添加求婚的理由和承诺
3. 准备戒指💍
4. 选择特殊的地点展示页面

## 📱 移动端使用

- ✅ 支持触摸操作
- ✅ 响应式布局
- ✅ 自适应字体大小
- ✅ 性能优化，流畅运行

## 🔧 故障排除

### 问题1：烟花不显示
- 检查Canvas是否被阻止
- 检查浏览器控制台错误
- 尝试刷新页面

### 问题2：音乐无法播放
- 确认音乐文件路径正确
- 检查浏览器自动播放策略
- 需要用户交互后才能播放

### 问题3：页面卡顿
- 减少烟花频率
- 减少背景粒子数量
- 关闭部分特效

### 问题4：移动端显示异常
- 检查viewport设置
- 测试不同设备
- 调整响应式断点

## 🎨 最佳实践

1. **提前测试**: 发送前在多个设备测试
2. **备份版本**: 保存原始代码
3. **定制内容**: 根据TA的喜好修改
4. **选择时机**: 在合适的时间发送
5. **真诚为主**: 技术只是载体，真诚最重要

## 📞 获取帮助

- 查看 [FEATURES.md](./FEATURES.md) 了解完整功能
- 查看 [README.md](./README.md) 了解技术细节
- 遇到问题可以检查浏览器控制台

---

**💖 祝你表白成功！💖**
