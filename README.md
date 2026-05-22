# ToolKit

ToolKit 是一个自用优先的纯前端工具站，用来收纳开发、文本、图片、生活计算和个人资料管理类小工具。项目目标是减少反复搜索在线工具站和忍受糟糕体验的时间。

## 技术栈

- Vite
- React
- TypeScript
- React Router
- lucide-react

## 本地开发

```bash
npm install
npm run dev
```

默认访问：

```txt
http://127.0.0.1:5173
```

## 检查与构建

```bash
npm run lint
npm run build
```

## GitHub Pages

项目已配置 GitHub Actions。推送到 `main` 分支后，会自动构建并发布到 GitHub Pages。

Vite 的 `base` 已设置为：

```ts
base: '/Toolkit/'
```

部署地址通常为：

```txt
https://closerdoor.github.io/Toolkit/
```

## 项目说明

更完整的项目背景、目录结构、已完成功能和后续建议见：

[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)
