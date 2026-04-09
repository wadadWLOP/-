# 设计规范：时光胶囊·手账贴纸风

## 一、产品设计概念（产品经理视角）

### 设计主题
"时光胶囊·手账贴纸风"

### 核心理念
模拟真实的手账本体验。日记写完后，不应该只是一个冷冰冰的列表，而应该像一张刚拍好的拍立得照片，或者一张刚剪下来贴在笔记本上的贴纸。

### 视觉元素拆解

#### 卡片容器
- 模仿撕裂的胶带纸边缘，或者一张不规则的便利贴

#### 内容排版
- **日期**：使用类似印章或打字机字体
- **标题**：手写体，颜色稍微深一点（如深棕色或酒红色）
- **正文摘要**：像钢笔字一样，行间距较宽，只展示前3行，后面用"..."省略
- **配图**：如果有上传照片，照片周围要有"圆角"和"阴影"，像贴在纸上一样

#### 装饰细节
- 增加一些手绘的小涂鸦（如小星星、爱心）
- 胶带痕迹
- 回形针图标

---

## 二、界面布局描述（软件工程师视角）

### HTML 结构

```html
<div class="diary-card">
  <!-- 装饰元素：左上角的胶带 -->
  <div class="tape"></div>

  <!-- 卡片头部：日期与天气 -->
  <header class="card-header">
    <span class="date">2026.04.09</span>
    <span class="weather">☀️</span>
  </header>

  <!-- 卡片主体：内容 -->
  <main class="card-body">
    <h3 class="title">今天是个好日子</h3>
    <p class="excerpt">今天我们去公园野餐了，阳光超级好，果汁跑得好开心...</p>

    <!-- 图片区域（如果有） -->
    <div class="photo-frame">
      <img src="..." alt="日记配图" />
    </div>
  </main>

  <!-- 卡片底部：互动或标签 -->
  <footer class="card-footer">
    <span class="tag">#开心</span>
    <span class="tag">#春天</span>
  </footer>
</div>
```

---

## 三、AI 生成提示词方案（Midjourney/DALL-E）

### 手账贴纸风格（侧重排版感）

```
UI design of a digital journal card, scrapbooking style, looking like a sticker on a notebook page. Creamy white background with a subtle paper texture. Top left corner has a piece of pink washi tape. The content includes a bold handwritten title "Happy Day", a short paragraph of text simulating fountain pen writing, and a cute weather icon. Soft drop shadows to create depth. The overall vibe is warm, cozy, and romantic. Colors are soft pink, beige, and coffee brown. High quality, vector illustration style, clean layout. --ar 9:16
```

---

## 四、CSS 样式灵感（代码实现建议）

```css
.diary-card {
  background-color: #FFFBF0; /* 米白色纸张感 */
  border-radius: 15px;
  padding: 20px;
  box-shadow: 5px 5px 15px rgba(0,0,0,0.08); /* 柔和阴影 */
  border: 1px solid #F0E6D2;
  position: relative;
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; /* 手写感字体 */
  transition: transform 0.2s;
}

/* 鼠标悬停时微微上浮 */
.diary-card:hover {
  transform: translateY(-5px) rotate(-1deg);
}

/* 模拟胶带 */
.tape {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 25px;
  background-color: rgba(255, 182, 193, 0.6); /* 半透明粉色 */
  border: 1px dashed rgba(255,255,255,0.4);
  z-index: 2;
}

/* 照片框架 */
.photo-frame {
  border-radius: 10px;
  box-shadow: 3px 3px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

/* 标签样式 */
.tag {
  background-color: #FFE4E1;
  color: #8B4513;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}
```

---

## 五、配色方案

| 用途 | 颜色 | Hex |
|------|------|-----|
| 背景（纸张感） | 米白色 | #FFFBF0 |
| 主色调 | 粉色 | #FFB6C1 |
| 强调色 | 咖啡棕 | #8B4513 |
| 边框 | 浅棕 | #F0E6D2 |
| 文字（深色） | 酒红色 | #722F37 |
| 标签背景 | 浅粉 | #FFE4E1 |

---

## 六、设计参考网站

- **Notion**: https://www.notion.so/
- **Miro**: https://miro.com/
- **Figma**: https://figma.com/

