# Smart Card Workspace

这是一个基于 `npm workspaces` 的智能卡片平台工程。

项目目标不是只做几个组件，而是提供一套可扩展的卡片平台基础设施：

- 每张卡片都是独立 package，可单独开发、调试、构建
- `sdk-core` 负责平台内核，不依赖 Vue
- `sdk-browser` 负责浏览器运行时和渲染
- `registry` 负责统一收集卡片定义
- `host-demo` 模拟外部业务系统接入

## 包结构

```text
packages/
  sdk-core/         平台内核
  sdk-browser/      浏览器运行时
  registry/         本地注册表
  host-demo/        外部宿主演示
  cards/
    hello-card/     独立卡片包
    stats-card/     独立卡片包
```

## 运行方式

安装依赖：

```bash
npm install
```

启动 SDK Browser：

```bash
npm run dev:sdk
```

启动宿主演示：

```bash
npm run dev:host
```

启动单独卡片：

```bash
npm run dev:hello
npm run dev:stats
```

默认端口：

- SDK Browser: `http://localhost:5173/`
- Hello Card: `http://localhost:5174/`
- Stats Card: `http://localhost:5175/`
- Host Demo: `http://localhost:5176/`

## 构建

构建全部：

```bash
npm run build
```

单独构建：

```bash
npm run build:sdk
npm run build:host
npm run build:hello
npm run build:stats
```

## SDK 调用示例

```js
const sdk = window.SmartCardSDK.sdk;

const cards = sdk.getAllCards();
const hello = sdk.getCardInfo('hello-card');

await sdk.renderCard({
  name: 'hello-card',
  selector: '#target',
  props: {
    title: hello?.title
  }
});
```

## 外部用户如何使用打包产物

如果外部用户不接入源码工程，只想直接使用打包后的文件，推荐方式如下。

先构建 SDK：

```bash
npm run build:sdk
```

构建产物位置：

- `packages/sdk-browser/dist/smart-card-sdk.umd.js`
- `packages/sdk-browser/dist/assets/smart-card-sdk.css`

外部页面可以直接这样接入：

```html
<link rel="stylesheet" href="./smart-card-sdk.css" />
<div id="card-root"></div>

<script src="./smart-card-sdk.umd.js"></script>
<script>
  const sdk = window.SmartCardSDK.sdk;

  console.log(sdk.getAllCards());
  console.log(sdk.getCardInfo('hello-card'));

  sdk.renderCard({
    name: 'hello-card',
    selector: '#card-root',
    props: {
      title: '外部页面渲染的卡片'
    }
  });
</script>
```

这种方式适合：

- 普通 HTML 页面
- 老系统
- 不走 npm 的接入方

如果外部用户本身也是前端工程，也可以直接以包方式接入：

```ts
import { sdk } from '@smart-cards/sdk-browser';

await sdk.renderCard({
  name: 'stats-card',
  selector: '#card-root',
  props: {
    title: '来自业务系统'
  }
});
```

外部接入时最常用的 3 个 API 是：

- `sdk.getAllCards()`
- `sdk.getCardInfo(name)`
- `sdk.renderCard({ name, selector, props })`

## 详细文档

更完整的架构说明、分层职责、卡片扩展方式、接入流程请看：

- [ARCHITECTURE.md](C:/workspace/aiCardTemplate/ARCHITECTURE.md)
