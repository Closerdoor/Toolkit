# Anakin 样式采集摘要

来源文件：`3df5de6b-9c2f-477b-813f-21ed1b932913.htm`

说明：浏览器安全策略阻止直接打开 `file://` SingleFile，所以本次采集采用静态解析方式，从保存的 HTML 中提取真实 DOM、内联 style、CSS 变量和 CSS 规则。完整原始报告见：

- `style-reports/anakin-style-report.json`
- `style-reports/anakin-style-report.md`

## 页面结构

Anakin 的搜索区和频道导航是分开的，不在同一行。

```text
搜索横幅 / 搜索框

频道 Tabs
  推荐 / AI 模型 / 写作 / 文案 / 图像生成 / 电商 / 外贸 / ...

应用卡片网格
```

频道导航使用标准 Tabs 结构：

```html
<div class="ui-tabs ui-tabs-top ui-tabs-middle ui-tabs-full-content ui-tabs-full-content--scrollable pui-components-app-explorer-index-explorerTabBar">
  <div role="tablist" class="ui-tabs-nav">
    <div class="ui-tabs-nav-wrap" style="flex-grow:1">
      <div class="ui-tabs-nav-list" style="transform:translate(0px,0px)">
        <div data-node-key="0" class="ui-tabs-tab ui-tabs-tab-active">
          <div role="tab" aria-selected="true" class="ui-tabs-tab-btn">推荐</div>
        </div>
        ...
        <div class="ui-tabs-ink-bar ui-tabs-ink-bar-animated" style="left:0px;width:64px"></div>
      </div>
    </div>
  </div>
</div>
```

频道列表：

```text
推荐, AI 模型, 写作, 文案, 图像生成, 电商, 外贸, 职业, 编程, 办公, 通用, 生活, 翻译, 游戏, 情感, 教育, 销售, 娱乐
```

## Tabs 样式

关键 CSS：

```css
.pui-components-app-explorer-index-explorerTabBar {
  position: sticky;
  top: 0;
  z-index: 3;
  background: var(--ui-body-background);
}

.pui-components-app-explorer-index-explorerTabBar .ui-tabs-nav .ui-tabs-nav-wrap .ui-tabs-nav-list .ui-tabs-tab {
  margin: 0 !important;
  padding: 9px 12px !important;
}

.pui-components-app-explorer-index-explorerTabBar .ui-tabs-nav .ui-tabs-nav-wrap .ui-tabs-nav-list .ui-tabs-tab-btn {
  font-weight: var(--ui-font-weight-base);
  font-size: var(--ui-font-size-base);
  color: var(--ui-text-color-secondary);
}

.ui-tabs-top > .ui-tabs-nav:before,
.ui-tabs-top > div > .ui-tabs-nav:before {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  border-bottom: var(--ui-border-width-base) var(--ui-border-style-base) var(--ui-border-color-split);
  content: "";
}

.ui-tabs-top > .ui-tabs-nav .ui-tabs-ink-bar {
  height: 2px;
  bottom: 0;
  border-radius: 99px 99px 0 0;
}

.ui-tabs-top > .ui-tabs-nav .ui-tabs-ink-bar-animated {
  transition: width .3s, left .3s, right .3s;
}
```

关键变量：

```css
--ui-font-size-base: 14px;
--ui-font-size-lg: 16px;
--ui-font-weight-semibold: 500;
--ui-line-height-base: 1.57142857;
--ui-tabs-color: var(--ui-text-color-secondary);
--ui-tabs-highlight-color: var(--ui-primary-color);
--ui-tabs-hover-color: var(--ui-primary-color-hover);
--ui-tabs-ink-bar-color: var(--ui-primary-color);
--ui-tabs-horizontal-gutter: 6px;
--ui-border-color-split: var(--ui-fill-4);
--ui-fill-4: #f2f4f7;
--ui-primary-color: #9373ee;
```

结论：Tabs 底部有整条浅分割线，active 项通过 `ui-tabs-ink-bar` 显示 2px 下划线。不是浅色块按钮。

## 搜索区样式

搜索框 DOM：

```html
<div class="pui-pages-app-main-discover-apps-index-appSearchWrapper">
  <span class="ui-input-affix-wrapper ui-input-affix-wrapper-focused pui-pages-app-main-discover-apps-index-appSearch ui-input-affix-wrapper-variant-default">
    <input placeholder height="40" width="520" class="ui-input ui-input-variant-default" type="text">
    <span class="ui-input-suffix">
      <button type="button" class="ui-btn ui-btn-primary ui-btn-flex ml-1">
        <span>搜索</span>
      </button>
    </span>
  </span>
</div>
```

关键 CSS：

```css
.pui-pages-app-main-discover-apps-index-searchBanner .pui-pages-app-main-discover-apps-index-appSearchWrapper {
  max-width: 520px;
  min-width: 216px;
}

.pui-pages-app-main-discover-apps-index-searchBanner .pui-pages-app-main-discover-apps-index-appSearch {
  height: 40px;
  width: 528px;
  max-width: 100%;
  padding: 4px;
}

.pui-pages-app-main-discover-apps-index-searchBanner .pui-pages-app-main-discover-apps-index-appSearch input {
  text-indent: 8px;
}
```

## 卡片样式

首张卡片示例：`DeepSeek`

卡片 DOM 关键结构：

```html
<div style="width:25%;max-width:25%">
  <div class="ui-col" style="padding-left:8px;padding-right:8px;flex:1 1 auto">
    <div class="ui-card ui-card-bordered ui-card-hoverable ui-card-middle pui-components-app-public-item-index-card" style="height:190px">
      <div class="ui-card-body">
        ...
      </div>
    </div>
  </div>
</div>
```

卡片内容：

```text
标题：DeepSeek
描述：DeepSeek 是一家专注实现 AGI 的中国人工智能企业...
标签：对话智能体, AI 模型
```

关键 CSS：

```css
.ui-card-hoverable {
  cursor: pointer;
  transition: box-shadow .3s, border-color .3s;
}

.ui-card-hoverable:hover {
  border-color: transparent;
  box-shadow: 0 0 4px rgba(40,41,61,.02), 0 2px 24px rgba(40,41,61,.08);
  box-shadow: var(--ui-card-shadow);
}

.ui-card-bordered {
  border: var(--ui-border-width-base) var(--ui-border-style-base) var(--ui-border-color-split);
}

.pui-components-app-public-item-index-card {
  border-radius: 8px;
}

.pui-components-app-public-item-index-card .ui-card-body {
  height: 100%;
  padding: 16px;
}

.pui-components-app-public-item-index-cardTitle {
  font-weight: var(--ui-font-weight-semibold);
  font-size: var(--ui-font-size-base);
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}

.pui-components-app-public-item-index-description {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
  font-weight: var(--ui-font-weight-400);
}

.pui-components-app-public-item-index-overflow2 {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.pui-components-app-public-item-index-tagsContainer {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  height: 24px;
  overflow: hidden;
  opacity: 1;
  transition: opacity .5s;
}

.ui-tag-borderless {
  padding: 0 8px;
  border: 0;
  --ui-tag-line-height: calc(var(--ui-content-height-sm) + 2px);
}
```

## 对 ToolKit 的直接映射

下一步复刻时应优先改这些点：

1. 搜索区单独一排，不和 Tabs 放同一行。
2. Tabs 单独一排，底部加 `1px` 浅分割线。
3. Active tab 不使用背景块，改成文字高亮 + `2px` 下划线。
4. Tab item 使用 `padding: 9px 12px`，字号 `14px`。
5. 卡片保持 `height: 190px`、`padding: 16px`、`border-radius: 8px`。
6. 卡片网格外层按 `25%` 列宽，列内左右 `8px` padding，相当于桌面 4 列。
