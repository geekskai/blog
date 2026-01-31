# Schema.org 结构化数据说明

## 1. Product Snippet vs Merchant Listing 的区别

### Product Snippet（产品摘要）
- **用途**: 用于**不能直接购买**的产品页面
- **适用场景**:
  - 产品评测页面
  - 产品对比页面
  - 聚合产品信息的网站
  - 编辑类内容页面
- **显示位置**: 仅在**有机搜索结果**中以文本形式显示
- **显示内容**: 评分、评论、价格、可用性等增强信息
- **数据来源**: 网站上的 Product 结构化数据

### Merchant Listing（商家列表）
- **用途**: 用于**可以直接购买**的产品页面
- **适用场景**:
  - 电商产品页面
  - 在线商店
  - 可以直接下单的页面
- **显示位置**: 
  - 有机搜索结果
  - Shopping 标签页
  - Google Images
  - YouTube
- **显示内容**: 更全面的产品信息，**必须包含价格**，可以出现在轮播图中
- **数据来源**: 
  - Google Merchant Center 数据源（传统方式）
  - 网站上的 Product 结构化数据（新方式，无需 Merchant Center）

### 主要区别总结

| 特性 | Product Snippet | Merchant Listing |
|------|----------------|------------------|
| **购买能力** | 不能直接购买 | 可以直接购买 |
| **价格要求** | 可选 | **必须** |
| **显示位置** | 仅有机搜索 | 搜索、Shopping、图片、YouTube |
| **数据源** | 网站结构化数据 | Merchant Center 或网站结构化数据 |
| **额外标记** | 基础 Product schema | 支持 ProductGroup（变体） |
| **适用页面** | 评测、对比、聚合 | 电商、在线商店 |

---

## 2. featureList 报错原因详解

### 问题根源

你的代码中使用了：
```typescript
featureList: [
  t("schema_feature_1"),
  t("schema_feature_2"),
  // ...
]
```

### Schema.org 规范要求

根据 [Schema.org 官方文档](https://schema.org/featureList)，`featureList` 属性的期望类型是：

- ✅ **Text**（文本字符串）
- ✅ **URL**（URL 链接）
- ❌ **Array**（数组）- **不支持**

### 为什么会出现报错？

1. **类型不匹配**: Schema.org 规范明确要求 `featureList` 必须是 Text 或 URL，而不是数组
2. **验证工具严格性**: Google 的结构化数据测试工具和某些验证工具会严格按照 Schema.org 规范验证
3. **JSON-LD 解析**: 虽然 JSON-LD 允许数组格式，但 Schema.org 的语义定义要求特定类型

### 正确的解决方案

#### ✅ 方案 1: 使用逗号分隔的字符串（推荐）
```typescript
featureList: [
  t("schema_feature_1"),
  t("schema_feature_2"),
  t("schema_feature_3"),
  // ...
].join(", ")
// 结果: "Feature 1, Feature 2, Feature 3"
```

#### ✅ 方案 2: 使用单个字符串
```typescript
featureList: `${t("schema_feature_1")}, ${t("schema_feature_2")}, ${t("schema_feature_3")}`
```

#### ✅ 方案 3: 使用 ItemList（如果需要更结构化的数据）
```typescript
// 在 WebApplication schema 中添加
hasFeature: {
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: t("schema_feature_1")
    },
    {
      "@type": "ListItem",
      position: 2,
      name: t("schema_feature_2")
    },
    // ...
  ]
}
```

### 为什么其他工具可能不报错？

1. **验证工具差异**: 不同的验证工具对规范的执行严格程度不同
2. **容错性**: 某些工具可能自动将数组转换为字符串
3. **Schema.org 版本**: 不同版本的 Schema.org 规范可能有细微差异

### 最佳实践建议

1. **严格遵循 Schema.org 规范**: 使用 Text 类型而不是数组
2. **使用逗号分隔**: `.join(", ")` 是最简单且符合规范的解决方案
3. **验证工具**: 使用 Google 的 [Rich Results Test](https://search.google.com/test/rich-results) 验证
4. **文档参考**: 始终参考 [Schema.org 官方文档](https://schema.org/WebApplication)

---

## 3. 你的代码修复

已修复的代码：
```typescript
featureList: [
  t("schema_feature_1"),
  t("schema_feature_2"),
  t("schema_feature_3"),
  t("schema_feature_4"),
  t("schema_feature_5"),
  t("schema_feature_6"),
  t("schema_feature_7"),
  t("schema_feature_8"),
].join(", "),  // ✅ 转换为符合规范的字符串格式
```

这样修改后：
- ✅ 符合 Schema.org 规范（Text 类型）
- ✅ 验证工具不会再报错
- ✅ 功能信息完整保留
- ✅ 搜索引擎可以正确解析

---

## 4. 相关资源

- [Schema.org WebApplication](https://schema.org/WebApplication)
- [Schema.org featureList](https://schema.org/featureList)
- [Google Product Structured Data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
