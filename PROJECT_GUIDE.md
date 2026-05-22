# ToolKit 项目指导文档

## 项目定位

ToolKit 是一个自用优先的纯前端工具站，目标是把日常开发、文本处理、图片处理、生活计算和个人资料收纳类小工具集中到一个干净、快速、可持续扩展的网页里。

这个项目的初心是减少反复搜索在线工具站、试错、忍受广告或糟糕体验的时间。它不是商业落地页，也不是营销官网，而是一个长期自用、可分享给熟人的工具工作台。

## 技术架构

- 前端框架：Vite + React + TypeScript
- 路由：react-router-dom
- 图标：lucide-react
- 二维码：qrcode
- YAML 转换：yaml
- 数据持久化：localStorage
- 当前形态：纯前端静态站，适合后续部署到 GitHub Pages
- 部署：已配置 GitHub Actions，推送 `main` 后自动部署 GitHub Pages

常用命令：

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

当前本地开发地址通常是：

```txt
http://127.0.0.1:5173
```

## 主要页面

- `/`：首页，展示工具导航、搜索、分类筛选、最近使用。
- `/tools/:toolId`：工具详情页，每个工具都有独立 URL。
- `/references`：参考网页，记录灵感来源、复刻对象和功能参考。
- `/about`：项目初心和设计原则说明。

## 目录结构

```txt
src/
  App.tsx              应用路由和顶栏
  main.tsx             React 入口
  index.css            全局样式和响应式布局
  components/          通用组件
  data/
    tools.ts           工具注册表聚合入口
    tools/             按分类拆分的工具注册表
    references.ts      参考网页数据
  hooks/
    useLocalStorage.ts localStorage 状态 Hook
  pages/               首页、工具页、参考网页、关于页
  tools/               每个工具的独立组件
  utils/               剪贴板、下载、格式化等工具函数
```

新增工具的推荐流程：

1. 在 `src/tools/` 新建工具组件。
2. 在 `src/tools/index.ts` 导出组件。
3. 在对应分类文件中注册工具：
   - `src/data/tools/developer.ts`
   - `src/data/tools/text.ts`
   - `src/data/tools/image.ts`
   - `src/data/tools/life.ts`
4. 注册配置包括 `id`、`path`、`category`、`keywords`、`component` 等。
5. 运行 `npm run lint` 和 `npm run build`。

## 已完成工具

当前已实现 52 个工具，均接入首页搜索、分类、侧边栏和独立 URL。

开发工具：

- JSON 格式化
- Hash 生成
- 正则表达式测试
- 时间戳转换
- UUID 生成
- 文本 Diff 对比
- JWT 解析
- JWT 生成
- Cron 表达式解析
- SQL 格式化
- YAML / JSON 转换
- JSON Path 查询
- JSON 转 TypeScript
- URL 参数解析器
- User-Agent 解析
- IP / CIDR 计算器

文本编码：

- Base64 编码解码
- URL 编码解码
- Markdown 预览
- 命名风格转换
- HTML 实体转换
- 文本清洗
- 正则替换
- 文本统计

视觉图片：

- 颜色转换
- 图片压缩
- 图片尺寸调整
- 表情包生成器
- Favicon 生成器
- 渐变色生成器
- 图片 Base64 转换
- 图片格式转换
- 长图拼接
- 占位图生成器

生活实用：

- 二维码生成
- 随机决策器
- 单位换算
- 贷款计算器
- BMI 计算器
- 密码生成器
- 倒计时
- 随机字符串生成器
- 抽签 / 分组工具
- 纪念日计算器
- 工作日计算器
- 汇率换算
- 常用片段库
- 端口占用速查笔记
- 个人链接收藏
- 工具请求池
- 本地便签
- 灵感分析面板

## 参考网页模块

`/references` 用来记录 ToolKit 的灵感来源，而不是普通友情链接。当前已录入：

- JSONTop
- RunJS Cool
- IT Tools
- Anakin AI Discover
- JSON.cn
- BEJSON
- Regex101
- CyberChef
- TinyPNG
- 草料二维码

参考网页数据在 `src/data/references.ts`。后续可以继续扩展字段，例如喜欢程度、截图、待复刻状态、视觉评价等。

## 当前实现状态与注意点

- 多数工具是“轻量但可用”的首版实现，适合快速解决日常问题。
- JSON、Base64、URL、Hash、二维码、图片处理等工具均在浏览器本地处理。
- 本地资料类工具使用 localStorage，例如常用片段库、端口笔记、个人链接、工具请求池、本地便签。
- Cron 当前支持常见 5 段表达式。
- SQL 格式化、Markdown 预览、User-Agent 解析是轻量实现，不是完整专业解析器。
- JWT 生成当前用于调试结构，采用 `alg=none`，不用于生产签名。
- 汇率换算当前使用手动汇率，后续如接后端可改为实时汇率 API。
- 图片压缩、转换、长图拼接等使用浏览器 Canvas。

## 产品设计方向

当前界面是首版工作台风格，用户对界面尚不完全满意，后续会基于参考网页继续归纳设计方向。改版时要保留这些原则：

- 每个工具必须有独立 URL。
- 首页要适合大量工具浏览、搜索、筛选。
- 默认浅色主题，支持深色主题。
- 优先纯前端本地处理，涉及隐私的输入不要上传。
- 不做营销首页，第一屏应服务“找到并打开工具”。
- 参考网页和灵感分析是项目的一部分，用来帮助长期演进。

## GitHub Pages 部署

项目已配置：

- `vite.config.ts` 中的 `base: '/Toolkit/'`
- `src/main.tsx` 中的 React Router `basename`
- `.github/workflows/deploy.yml`
- SPA fallback：构建时复制 `dist/index.html` 到 `dist/404.html`

仓库地址：

```txt
git@github.com:Closerdoor/Toolkit.git
```

部署地址通常为：

```txt
https://closerdoor.github.io/Toolkit/
```

## 后续建议

优先级较高的下一步：

- 给高频工具补复制按钮、示例、错误提示和更专业的解析能力。
- 改造参考网页为可新增/编辑/删除的 localStorage 数据库。
- 基于参考网页归纳新的视觉风格，再重做首页和工具页布局。

每次继续开发前，建议先运行：

```bash
npm run lint
npm run build
```
