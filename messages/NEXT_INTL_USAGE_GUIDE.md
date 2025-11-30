# next-intl 使用规范指南 (next-intl Usage Guide)

## 📚 目录 (Table of Contents)

1. [核心概念](#核心概念)
2. [t() vs t.rich() 使用规则](#t-vs-trich-使用规则)
3. [JSON 格式规范](#json-格式规范)
4. [代码使用示例](#代码使用示例)
5. [常见错误与修复](#常见错误与修复)
6. [最佳实践](#最佳实践)

---

## 核心概念 (Core Concepts)

### next-intl 提供的两个主要函数

1. **`t(key, values?)`** - 用于简单文本和插值
2. **`t.rich(key, values)`** - 用于富文本和 HTML 标签

### 关键原则

> **根据 JSON 中的格式选择使用 `t()` 还是 `t.rich()`**

- JSON 中**没有 HTML 标签** → 使用 `t()`
- JSON 中**有 HTML 标签** → 使用 `t.rich()`

---

## t() vs t.rich() 使用规则

### 📊 决策表 (Decision Table)

| JSON 格式              | 使用函数   | 传递参数类型 | 何时使用   |
| ---------------------- | ---------- | ------------ | ---------- |
| 纯文本                 | `t()`      | 无           | 静态文本   |
| `{variable}`           | `t()`      | 实际值       | 简单插值   |
| `<strong>...</strong>` | `t.rich()` | 回调函数     | HTML 标签  |
| `<rich>...</rich>`     | `t.rich()` | 回调函数     | 自定义标签 |

### 🎯 使用规则详解

#### 规则 1: 纯文本使用 `t()`

```tsx
// JSON
{
  "title": "Random 4-Digit Number Generator"
}

// 代码
{t("title")}
```

#### 规则 2: 简单插值使用 `t()` + 实际值

```tsx
// JSON
{
  "description": "Perfect for {verification_codes}, {pins}, and {testing_data}.",
  "verification_codes": "verification codes",
  "pins": "PINs",
  "testing_data": "testing data"
}

// 代码 ✅ 正确
{t("description", {
  verification_codes: t("verification_codes"),
  pins: t("pins"),
  testing_data: t("testing_data"),
})}

// 代码 ❌ 错误 - 不要使用回调函数
{t.rich("description", {
  verification_codes: (chunks) => <strong>{chunks}</strong>,
  pins: (chunks) => <strong>{chunks}</strong>,
})}
```

#### 规则 3: HTML 标签使用 `t.rich()` + 回调函数

```tsx
// JSON
{
  "feature": "<strong>Cryptographically Secure</strong>: Uses Web Crypto API"
}

// 代码 ✅ 正确
{t.rich("feature", {
  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
})}

// 代码 ❌ 错误 - 不要使用 t()
{t("feature")} // 会显示原始 HTML 标签文本
```

#### 规则 4: 自定义标签 `<rich>` 使用 `t.rich()` + rich 回调

```tsx
// JSON
{
  "paragraph": "We use the <rich>{crypto_api}</rich> to ensure security.",
  "crypto_api": "Web Crypto API"
}

// 代码 ✅ 正确
{t.rich("paragraph", {
  crypto_api: t("crypto_api"),
  rich: (chunks) => <strong className="text-white">{chunks}</strong>,
})}
```

---

## JSON 格式规范

### ✅ 推荐的 JSON 结构

#### 1. 简单插值格式

```json
{
  "header": {
    "description": "Generate {numbers} for {purpose}.",
    "numbers": "random numbers",
    "purpose": "testing"
  }
}
```

**特点：**

- 使用 `{variable}` 格式
- 变量值单独定义
- 便于翻译和维护

#### 2. HTML 标签格式

```json
{
  "features": {
    "crypto_secure": "<strong>Cryptographically Secure</strong>: Uses Web Crypto API",
    "bulk_generation": "<strong>Bulk Generation</strong>: Generate up to 1000 numbers"
  }
}
```

**特点：**

- 直接包含 HTML 标签
- 标签内容会被回调函数处理
- 适合需要样式的文本

#### 3. 混合格式（插值 + 自定义标签）

```json
{
  "seo_content": {
    "paragraph": "Our {tool_name} uses the <rich>{api_name}</rich> for security.",
    "tool_name": "random number generator",
    "api_name": "Web Crypto API"
  }
}
```

**特点：**

- 结合简单插值和富文本
- `{tool_name}` 传递实际值
- `<rich>{api_name}</rich>` 使用回调函数

### ❌ 避免的 JSON 格式

#### 错误 1: 混淆简单插值和 HTML 标签

```json
// ❌ 错误 - 不要在简单插值中使用 HTML 标签
{
  "description": "Perfect for <strong>{verification_codes}</strong>"
}

// ✅ 正确 - 分开定义
{
  "description": "Perfect for {verification_codes}",
  "verification_codes": "verification codes"
}
```

#### 错误 2: 在 HTML 标签中使用插值

```json
// ❌ 错误 - HTML 标签内不应有插值
{
  "feature": "<strong>{feature_name}</strong>: Description"
}

// ✅ 正确 - 使用自定义标签
{
  "feature": "<strong>Feature Name</strong>: Description"
}
```

---

## 代码使用示例

### 示例 1: 简单文本

```tsx
// JSON
{
  "title": "Random Number Generator"
}

// 代码
<h1>{t("title")}</h1>
```

### 示例 2: 简单插值

```tsx
// JSON
{
  "welcome": "Welcome, {username}!",
  "username": "John"
}

// 代码
<p>{t("welcome", { username: t("username") })}</p>
```

### 示例 3: 多个插值

```tsx
// JSON
{
  "description": "Generate {type} for {purpose} and {usage}.",
  "type": "random numbers",
  "purpose": "testing",
  "usage": "development"
}

// 代码
<p>
  {t("description", {
    type: t("type"),
    purpose: t("purpose"),
    usage: t("usage"),
  })}
</p>
```

### 示例 4: HTML 标签（单个）

```tsx
// JSON
{
  "feature": "<strong>Secure</strong>: Cryptographically secure random numbers"
}

// 代码
<li>
  {t.rich("feature", {
    strong: (chunks) => <strong className="text-white">{chunks}</strong>,
  })}
</li>
```

### 示例 5: HTML 标签（多个）

```tsx
// JSON
{
  "description": "<strong>Fast</strong> and <em>reliable</em> generation"
}

// 代码
<p>
  {t.rich("description", {
    strong: (chunks) => <strong className="font-bold">{chunks}</strong>,
    em: (chunks) => <em className="italic">{chunks}</em>,
  })}
</p>
```

### 示例 6: 自定义标签 + 插值

```tsx
// JSON
{
  "paragraph": "Our {tool} uses the <rich>{api}</rich> for security.",
  "tool": "generator",
  "api": "Web Crypto API"
}

// 代码
<p>
  {t.rich("paragraph", {
    tool: t("tool"),
    api: t("api"),
    rich: (chunks) => <strong className="text-blue-400">{chunks}</strong>,
  })}
</p>
```

### 示例 7: 复杂嵌套

```tsx
// JSON
{
  "features_list": {
    "crypto": "<strong>Crypto Secure</strong>: Uses Web Crypto API",
    "bulk": "<strong>Bulk Generation</strong>: Up to 1000 numbers",
    "free": "<strong>100% Free</strong>: Unlimited usage"
  }
}

// 代码
<ul>
  {["crypto", "bulk", "free"].map((key) => (
    <li key={key}>
      {t.rich(`features_list.${key}`, {
        strong: (chunks) => <strong className="text-white">{chunks}</strong>,
      })}
    </li>
  ))}
</ul>
```

---

## 常见错误与修复

### ❌ 错误 1: 简单插值使用 t.rich() + 回调函数

```tsx
// JSON
{
  "description": "Perfect for {verification_codes}",
  "verification_codes": "verification codes"
}

// ❌ 错误代码
{t.rich("description", {
  verification_codes: (chunks) => <strong>{chunks}</strong>,
})}

// ✅ 正确代码
{t("description", {
  verification_codes: t("verification_codes"),
})}
```

**原因：** JSON 中是简单插值 `{variable}`，不是 HTML 标签。

---

### ❌ 错误 2: HTML 标签使用 t() 而不是 t.rich()

```tsx
// JSON
{
  "feature": "<strong>Secure</strong>: Crypto API"
}

// ❌ 错误代码
{t("feature")} // 会显示 "<strong>Secure</strong>: Crypto API"

// ✅ 正确代码
{t.rich("feature", {
  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
})}
```

**原因：** JSON 中有 HTML 标签 `<strong>`，必须使用 `t.rich()`。

---

### ❌ 错误 3: t.rich() 传递实际值而不是回调函数

```tsx
// JSON
{
  "feature": "<strong>Secure</strong>: Description"
}

// ❌ 错误代码
{t.rich("feature", {
  strong: "Secure", // 传递字符串
})}

// ✅ 正确代码
{t.rich("feature", {
  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
})}
```

**原因：** `t.rich()` 需要回调函数来处理 HTML 标签。

---

### ❌ 错误 4: 混合使用 t() 和 t.rich()

```tsx
// JSON
{
  "description": "We use {api} for security.",
  "api": "Web Crypto API"
}

// ❌ 错误代码 - 混合使用
{t.rich("description", {
  api: t("api"), // 传递实际值，但使用了 t.rich()
})}

// ✅ 正确代码 - 统一使用 t()
{t("description", {
  api: t("api"),
})}
```

**原因：** 简单插值应该使用 `t()`，不需要 `t.rich()`。

---

### ❌ 错误 5: 忘记提供 rich 回调函数

```tsx
// JSON
{
  "paragraph": "We use the <rich>{api}</rich> for security.",
  "api": "Web Crypto API"
}

// ❌ 错误代码 - 缺少 rich 回调
{t.rich("paragraph", {
  api: t("api"),
  // 忘记提供 rich 回调函数
})}

// ✅ 正确代码
{t.rich("paragraph", {
  api: t("api"),
  rich: (chunks) => <strong className="text-white">{chunks}</strong>,
})}
```

**原因：** JSON 中使用了 `<rich>` 标签，必须提供对应的回调函数。

---

## 最佳实践

### ✅ 1. 保持 JSON 结构清晰

```json
{
  "section": {
    "title": "Title Text",
    "description": "Description with {variable}",
    "variable": "variable value",
    "feature": "<strong>Bold Text</strong>: Description"
  }
}
```

**优点：**

- 结构清晰，易于维护
- 变量值单独定义
- 翻译人员容易理解

---

### ✅ 2. 使用语义化的变量名

```json
// ✅ 好的命名
{
  "description": "Perfect for {verification_codes}, {pins}, and {testing_data}",
  "verification_codes": "verification codes",
  "pins": "PINs",
  "testing_data": "testing data"
}

// ❌ 不好的命名
{
  "description": "Perfect for {var1}, {var2}, and {var3}",
  "var1": "verification codes",
  "var2": "PINs",
  "var3": "testing data"
}
```

---

### ✅ 3. 统一 HTML 标签的样式处理

```tsx
// 创建可复用的标签处理函数
const richTextComponents = {
  strong: (chunks: React.ReactNode) => <strong className="text-white">{chunks}</strong>,
  em: (chunks: React.ReactNode) => <em className="italic text-slate-300">{chunks}</em>,
  code: (chunks: React.ReactNode) => (
    <code className="rounded bg-slate-800 px-2 py-1">{chunks}</code>
  ),
}

// 使用
{
  t.rich("feature", {
    strong: richTextComponents.strong,
  })
}
```

---

### ✅ 4. 为复杂内容创建辅助函数

```tsx
// 辅助函数
const renderRichText = (key: string, variables: Record<string, string>) => {
  return t.rich(key, {
    ...Object.fromEntries(Object.entries(variables).map(([k, v]) => [k, t(v)])),
    rich: (chunks) => <strong className="text-white">{chunks}</strong>,
  })
}

// 使用
{
  renderRichText("paragraph", {
    tool: "tool_name",
    api: "api_name",
  })
}
```

---

### ✅ 5. 保持所有语言文件结构一致

```json
// en.json
{
  "header": {
    "description": "Generate {numbers} for {purpose}",
    "numbers": "random numbers",
    "purpose": "testing"
  }
}

// zh-cn.json
{
  "header": {
    "description": "为{purpose}生成{numbers}",
    "numbers": "随机数字",
    "purpose": "测试"
  }
}
```

**注意：** 所有语言文件的 key 结构必须完全一致。

---

### ✅ 6. 使用 TypeScript 类型安全

```tsx
// 定义翻译 key 类型
type TranslationKey = "header.title" | "header.description" | "features.crypto_secure"
// ... 更多 keys

// 使用类型安全的 t()
const title = t("header.title" as TranslationKey)
```

---

### ✅ 7. 为 HTML 标签添加适当的样式

```tsx
// ✅ 好的实践 - 添加有意义的样式
{
  t.rich("feature", {
    strong: (chunks) => <strong className="font-bold text-white">{chunks}</strong>,
  })
}

// ❌ 不好的实践 - 没有样式
{
  t.rich("feature", {
    strong: (chunks) => <strong>{chunks}</strong>,
  })
}
```

---

### ✅ 8. 测试所有语言的渲染

```tsx
// 在开发时测试不同语言
const testLanguages = ["en", "zh-cn", "ja", "ko", "da", "no"]

testLanguages.forEach((locale) => {
  // 切换语言并验证渲染
  console.log(`Testing ${locale}:`, t("header.description"))
})
```

---

## 📋 快速参考表 (Quick Reference)

### 函数选择流程图

```
检查 JSON 格式
    ↓
是否包含 HTML 标签？
    ↓
  是 → 使用 t.rich()
    |   ↓
    |   传递回调函数
    |   strong: (chunks) => <strong>{chunks}</strong>
    ↓
  否 → 是否有插值？
        ↓
      是 → 使用 t() + 传递实际值
        |   t("key", { var: t("var_key") })
        ↓
      否 → 使用 t()
            t("key")
```

### 常用模式速查

| 场景     | JSON 格式                                 | 代码示例                                                  |
| -------- | ----------------------------------------- | --------------------------------------------------------- |
| 纯文本   | `"title": "Text"`                         | `t("title")`                                              |
| 单个插值 | `"text": "Hello {name}"`                  | `t("text", { name: t("name") })`                          |
| 多个插值 | `"text": "{a} and {b}"`                   | `t("text", { a: t("a"), b: t("b") })`                     |
| 单个标签 | `"text": "<strong>Bold</strong>"`         | `t.rich("text", { strong: (c) => <strong>{c}</strong> })` |
| 多个标签 | `"text": "<strong>A</strong> <em>B</em>"` | `t.rich("text", { strong: ..., em: ... })`                |
| 混合格式 | `"text": "{var} <rich>text</rich>"`       | `t.rich("text", { var: t("var"), rich: ... })`            |

---

## 🔍 调试技巧

### 1. 检查 JSON 格式

```bash
# 验证 JSON 格式
python3 -m json.tool messages/en.json > /dev/null && echo "✅ Valid JSON"
```

### 2. 查找所有 t.rich() 使用

```bash
# 搜索所有 t.rich() 调用
grep -r "t\.rich(" app/
```

### 3. 验证 HTML 标签

```bash
# 查找 JSON 中的 HTML 标签
grep -r "<strong>\|<em>\|<rich>" messages/
```

### 4. 检查插值变量

```bash
# 查找 JSON 中的插值
grep -r "{[a-z_]*}" messages/en.json
```

---

## 📚 参考资源

- [next-intl 官方文档](https://next-intl-docs.vercel.app/)
- [next-intl Rich Text 文档](https://next-intl-docs.vercel.app/docs/usage/messages#rich-text)
- [React i18n 最佳实践](https://react.i18next.com/latest/using-with-hooks)

---

## 🎯 总结

### 核心要点

1. **根据 JSON 格式选择函数**
   - 简单插值 → `t()`
   - HTML 标签 → `t.rich()`

2. **传递正确的参数类型**
   - `t()` → 实际值
   - `t.rich()` → 回调函数

3. **保持一致性**
   - 所有语言文件结构一致
   - 命名规范统一
   - 样式处理统一

4. **测试验证**
   - 测试所有语言
   - 验证渲染结果
   - 检查 JSON 格式

---

**文档版本**: 1.0.0  
**最后更新**: 2025-10-26  
**维护者**: Development Team
