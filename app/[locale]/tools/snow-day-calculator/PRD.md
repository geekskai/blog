# Snow Day Calculator - 产品需求文档 (PRD)

## 1. 产品概述

### 1.1 产品背景

"Snow Day Calculator"是一个基于实时天气数据的学校停课预测工具。在北美地区，每年冬季都有大量学生、家长和教师关心学校是否会因恶劣天气而停课。据Google Trends数据显示，该关键词在冬季月份搜索量激增300%以上。

### 1.2 产品目标

- **主要目标**：提供准确、实时的学校停课概率预测
- **次要目标**：成为冬季天气查询的首选工具
- **商业目标**：获得高流量并转化为网站品牌认知

## 2. 市场分析

### 2.1 目标市场

- **主要市场**：美国和加拿大的雪带地区
- **潜在用户**：约5000万学生家庭
- **搜索量**：月均搜索量100万+（冬季峰值）

### 2.2 竞品分析

- 现有竞品多为付费或功能单一
- 我们的优势：免费、准确、界面友好、移动端优化

## 3. 用户画像与使用场景

### 3.1 核心用户群体

**学生群体 (40%)**

- 年龄：8-18岁
- 需求：晚上查询次日是否停课
- 使用设备：主要为手机

**家长群体 (45%)**

- 年龄：25-45岁
- 需求：安排孩子行程和工作计划
- 使用设备：手机和电脑

**教育工作者 (15%)**

- 年龄：25-55岁
- 需求：教学计划调整参考
- 使用设备：主要为电脑

### 3.2 典型使用场景

**场景1：晚间预查询**

- 时间：晚上8-11点
- 用户：学生和家长
- 目的：提前规划次日安排

**场景2：早晨确认**

- 时间：早上5-8点
- 用户：家长和教师
- 目的：最终确认出行计划

**场景3：实时监控**

- 时间：降雪期间
- 用户：所有群体
- 目的：持续关注天气变化

## 4. 核心功能设计

### 4.1 主要功能

#### 4.1.1 位置输入系统

```
输入方式：
- 城市名称 (如: "Toronto", "New York")
- 邮政编码 (如: "10001", "M5V 3A8")
- 自动定位 (获取用户GPS位置)

支持格式：
- 城市名 + 州/省 (如: "Boston, MA")
- 城市名 + 国家 (如: "Toronto, Canada")
```

#### 4.1.2 实时天气数据获取

```
API调用：
基础URL: https://api.openweathermap.org/data/2.5/weather
参数：
- q: 城市名称
- appid: xxxxxxx
- units: metric (使用公制单位)
- lang: en (英语响应)

关键数据字段：
- main.temp: 当前温度
- main.feels_like: 体感温度
- weather[0].main: 天气主要状态
- wind.speed: 风速
- visibility: 能见度
- snow.1h: 1小时降雪量
- clouds.all: 云量覆盖率
```

#### 4.1.3 停课概率算法

```javascript
function calculateSnowDayProbability(weatherData) {
  let probability = 0

  // 基础分数
  const baseScore = 10
  probability += baseScore

  // 降雪量影响 (最高40分)
  const snowfall = weatherData.snow?.["1h"] || 0
  if (snowfall > 0) {
    probability += Math.min(snowfall * 8, 40)
  }

  // 温度影响 (最高25分)
  const temp = weatherData.main.temp
  if (temp < -5) {
    probability += Math.min((-5 - temp) * 2, 25)
  }

  // 风速影响 (最高20分)
  const windSpeed = weatherData.wind.speed * 3.6 // 转换为km/h
  if (windSpeed > 20) {
    probability += Math.min((windSpeed - 20) * 0.5, 20)
  }

  // 能见度影响 (最高15分)
  const visibility = weatherData.visibility / 1000 // 转换为km
  if (visibility < 5) {
    probability += Math.min((5 - visibility) * 3, 15)
  }

  // 确保概率在0-100之间
  return Math.min(Math.max(probability, 0), 100)
}
```

#### 4.1.4 结果展示系统

```
概率等级：
- 0-20%: "几乎不可能停课" (绿色)
- 21-40%: "停课可能性较低" (黄绿色)
- 41-60%: "停课可能性中等" (黄色)
- 61-80%: "停课可能性较高" (橙色)
- 81-100%: "很可能停课" (红色)

显示元素：
- 概率百分比 (大号字体)
- 概率条形图
- 文字描述
- 天气详情卡片
- 建议文本
```

### 4.2 辅助功能

#### 4.2.1 历史查询记录

- 保存用户最近5次查询位置
- 快速重新查询功能

#### 4.2.2 分享功能

- 社交媒体分享 (Twitter, Facebook)
- 生成分享链接
- 分享图片生成

#### 4.2.3 多语言支持

- 英语 (当前只需要英语就行)

## 5. 技术架构

### 5.1 前端技术栈

```
框架: Next.js 14 + TypeScript
样式: Tailwind CSS
UI组件: 自定义组件
状态管理: React Hooks
数据请求: Fetch API
```

### 5.2 API集成

```typescript
// 天气API调用接口
interface WeatherApiResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  snow?: {
    '1h': number;
  };
  name: string;
  sys: {
    country: string;
  };
}

// 内部API路由
app/api/weather/route.ts
- GET /api/weather?q={location}
- 返回处理后的天气数据和停课概率
```

## 6. 用户界面设计

### 6.1 页面布局

#### 6.1.1 首页设计

```
[Header: Snow Day Calculator Logo]

[Hero Section]
- 大标题: "Will School Be Closed Tomorrow?"
- 副标题: "Get instant snow day predictions for your location"
- 搜索框 + 查询按钮
- 定位按钮

[Features Section]
- 实时天气数据
- 准确概率计算
- 移动端友好

[Footer]
```

#### 6.1.2 结果页设计

```
[天气概览卡片]
- 城市名称
- 当前温度
- 天气状况图标
- 风速、湿度等详情

[停课概率区域]
- 大号概率数字 (80%)
- 彩色进度条
- 概率等级文字
- 建议文本

[详细数据]
- 降雪量
- 能见度
- 体感温度
- 其他关键指标

[操作按钮]
- 重新查询
- 分享结果
- 查看预报 (未来功能)
```

### 6.2 响应式设计

- 移动端优先设计
- 支持屏幕尺寸: 320px - 1920px
- 触摸友好的按钮和输入框

## 7. SEO和营销策略

### 7.1 SEO优化

#### 关键词策略

```
主要关键词:
- snow day calculator
- snow day predictor
- will school be closed
- snow day probability

长尾关键词:
- snow day calculator for [city name]
- school closure predictor
- snow day forecast tool
```

#### 技术SEO

```html
<!-- 页面元数据 -->
<title>Snow Day Calculator - Predict School Closures | Free Tool</title>
<meta
  name="description"
  content="Free snow day calculator predicts school closure probability using real-time weather data. Get instant predictions for your location."
/>

<!-- 结构化数据 -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Snow Day Calculator",
    "description": "Predict school closures based on weather conditions",
    "url": "https://geekskai.com/tools/snow-day-calculator/"
  }
</script>
```
