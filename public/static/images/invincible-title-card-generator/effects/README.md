# Invincible Title Card Generator - Effects Images

## 📁 效果图片目录

此目录用于存放视觉效果图片，包括血溅、标记、划痕等效果。

## 🎨 需要的效果图片

根据 `constants.ts` 中的配置，需要以下效果图片：

1. **blood-splatter-1.png** - 经典血溅效果
2. **blood-splatter-2.png** - 重型血溅效果
3. **scratch-1.png** - 尖锐划痕
4. **scratch-2.png** - 深度划痕
5. **mark-1.png** - 战斗标记叠加
6. **damage-1.png** - 损伤纹理叠加

## 📐 图片规格建议

- **尺寸**: 1920x1080 (16:9 比例)
- **格式**: PNG（支持透明通道）
- **文件大小**: 建议 < 500KB
- **透明度**: 效果图片应使用透明背景，叠加在标题卡上

## 🎯 使用方式

效果图片会在 Canvas 渲染时使用 `overlay` 混合模式叠加，透明度为 0.8。

## 📝 添加新效果

1. 将效果图片放入此目录
2. 在 `constants.ts` 的 `getEffectPresets()` 和 `effectPresets` 中添加新效果配置
3. 确保图片路径正确：`/static/images/invincible-title-card-generator/effects/[filename].png`

## ⚠️ 注意事项

- 图片文件名必须与 `constants.ts` 中配置的路径一致
- 如果图片不存在，预览和导出时会自动跳过该效果
- 建议使用 PNG 格式以支持透明通道
