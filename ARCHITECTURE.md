# 架构设计说明

## 1. 项目定位

这个项目不是普通的组件库，而是一个“智能卡片平台”的基础骨架。

平台的核心诉求是：

1. 卡片可以独立开发和演进
2. 宿主系统不需要关心卡片内部实现
3. SDK 统一管理卡片注册、查询、加载和渲染
4. 后续可以平滑演进到远程注册中心、动态加载、权限治理和版本兼容

因此当前架构采用“平台内核 + 浏览器运行时 + 注册表 + 独立卡片包”的分层方式。

---

## 2. 顶层分层

### 2.1 `@smart-cards/sdk-core`

位置：

- `packages/sdk-core`

职责：

- 定义平台核心类型
- 定义卡片注册协议
- 管理卡片注册表
- 提供卡片查询和加载接口

特点：

- 不依赖 Vue
- 不依赖浏览器 DOM
- 不依赖具体卡片

当前核心文件：

- [packages/sdk-core/src/types.ts](C:/workspace/aiCardTemplate/packages/sdk-core/src/types.ts)
- [packages/sdk-core/src/SmartCardRegistry.ts](C:/workspace/aiCardTemplate/packages/sdk-core/src/SmartCardRegistry.ts)

这是平台的“纯内核”。

### 2.2 `@smart-cards/sdk-browser`

位置：

- `packages/sdk-browser`

职责：

- 在浏览器环境中运行 SDK
- 加载卡片模块
- 把卡片定义为 `custom element`
- 创建和挂载卡片元素
- 暴露 `window.SmartCardSDK`

当前核心文件：

- [packages/sdk-browser/src/BrowserCardSDK.ts](C:/workspace/aiCardTemplate/packages/sdk-browser/src/BrowserCardSDK.ts)
- [packages/sdk-browser/src/sdk-entry.ts](C:/workspace/aiCardTemplate/packages/sdk-browser/src/sdk-entry.ts)

这是平台的“运行时层”。

### 2.3 `@smart-cards/registry`

位置：

- `packages/registry`

职责：

- 聚合本地所有卡片 definition
- 对 SDK 提供统一注册入口

当前核心文件：

- [packages/registry/src/index.ts](C:/workspace/aiCardTemplate/packages/registry/src/index.ts)

当前是“本地静态注册表”。
后续可以平滑升级成：

- 远程注册中心
- 后端配置中心
- 动态卡片发现服务

### 2.4 `@smart-cards/card-*`

位置：

- `packages/cards/hello-card`
- `packages/cards/stats-card`

职责：

- 提供卡片自身实现
- 提供卡片 manifest
- 提供卡片 definition
- 单独运行调试和构建

这层是“插件层”。

### 2.5 `@smart-cards/host-demo`

位置：

- `packages/host-demo`

职责：

- 模拟真实业务系统
- 只通过 SDK API 获取卡片信息和渲染卡片
- 验证宿主完全不关心 Vue 内部实现

---

## 3. 为什么要这样拆

如果把所有东西都塞进一个 SDK 包，会有几个长期问题：

1. 平台内核和浏览器实现耦合
2. 每新增一个卡片，都要修改 SDK 本体
3. 后续很难支持远程卡片和动态加载
4. 宿主侧无法明确区分“平台协议”和“具体运行时”

当前拆分的价值在于：

- `sdk-core` 保证平台协议稳定
- `sdk-browser` 保证浏览器渲染能力可替换
- `registry` 保证注册来源可替换
- `card-*` 保证卡片可独立演进

这套结构更适合长期扩展。

---

## 4. 卡片包设计

每个卡片包建议包含三类内容：

### 4.1 组件实现

例如：

- [packages/cards/hello-card/src/HelloCard.ce.vue](C:/workspace/aiCardTemplate/packages/cards/hello-card/src/HelloCard.ce.vue)

它负责真正的 UI 和交互逻辑。

### 4.2 `manifest.ts`

例如：

- [packages/cards/hello-card/src/manifest.ts](C:/workspace/aiCardTemplate/packages/cards/hello-card/src/manifest.ts)

它只负责描述卡片元数据，不负责加载逻辑。

当前 manifest 至少包含：

- `id`
- `name`
- `tag`
- `title`
- `description`
- `version`
- `packageName`
- `category`
- `owner`
- `runtime`
- `status`
- `propsSchema`

这使得 SDK 可以在“不加载组件实现”的情况下先获取卡片信息。

### 4.3 `definition.ts`

例如：

- [packages/cards/hello-card/src/definition.ts](C:/workspace/aiCardTemplate/packages/cards/hello-card/src/definition.ts)

这里把：

- `manifest`
- `load()`

组合成完整的注册定义。

这是一个非常关键的设计点。

因为平台真正关心的不是 `component` 本身，而是：

- 这个卡片是谁
- 它如何被找到
- 它如何被加载

也就是说，平台依赖的是“定义”，不是“组件源码对象”。

---

## 5. 注册与加载链路

当前卡片渲染链路如下：

1. `registry` 聚合所有 `card definition`
2. `sdk-browser` 启动时读取 `localCardRegistry`
3. 宿主调用 `sdk.getCardInfo(name)` 或 `sdk.getAllCards()`
4. 宿主调用 `sdk.renderCard({ name, selector, props })`
5. `sdk-browser` 根据 `name` 找到对应 definition
6. 调用 `load()` 动态加载卡片模块
7. 通过 `defineCustomElement` 注册成自定义元素
8. 创建元素并注入 props
9. 插入到目标容器中

这条链路的好处是：

- 宿主按“卡片名称”工作
- SDK 按“卡片定义”工作
- 卡片包按“独立工程”工作

三者边界清晰。

---

## 6. 当前对外 API

当前浏览器运行时暴露：

```js
window.SmartCardSDK = {
  sdk,
  BrowserCardSDK,
  createSmartCardSDK
}
```

常用接口：

### 6.1 `getAllCards()`

返回全部卡片元数据列表。

适用于：

- 卡片中心列表页
- 权限过滤
- 配置后台
- 宿主动态选择卡片

### 6.2 `getCardInfo(name)`

按卡片名称获取单张卡片元数据。

适用于：

- 宿主按名称渲染前先读标题、描述、版本、tag

### 6.3 `renderCard(options)`

按卡片名称直接渲染。

```js
await sdk.renderCard({
  name: 'hello-card',
  selector: '#target',
  props: {
    title: 'Hello'
  }
});
```

适用于：

- 宿主快速接入
- 页面级挂载

### 6.4 `createCardElement(name, props)`

当前代码里是内部思路，后续建议显式暴露出来。

适用于：

- 宿主自己管理插入和销毁时机
- 微前端或复杂布局系统

---

## 6.5 外部用户如何使用打包产物

如果接入方不是 workspace 内部项目，而是一个独立系统，推荐直接使用 `sdk-browser` 的构建产物。

先构建：

```bash
npm run build:sdk
```

产物位置：

- `packages/sdk-browser/dist/smart-card-sdk.umd.js`
- `packages/sdk-browser/dist/assets/smart-card-sdk.css`

外部系统可以直接在 HTML 中这样接入：

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

这种模式下，外部系统只依赖两个静态文件：

- JS：SDK 运行时
- CSS：SDK 基础样式

如果接入方本身有构建工具，也可以直接通过包方式接入：

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

这也是当前推荐给业务接入方的标准方式。

---

## 7. 当前架构的优点

### 7.1 平台内核已经和 Vue 解耦

`sdk-core` 不依赖 Vue，这意味着未来即使卡片运行时从 Vue Custom Elements 换成别的实现，核心协议层也不用推倒重来。

### 7.2 卡片已经成为独立工程

每张卡片都有自己的：

- `package.json`
- `vite.config.ts`
- `index.html`
- `manifest.ts`
- `definition.ts`

这保证了卡片能独立开发、独立调试、独立构建。

### 7.3 宿主已经按名称调用

宿主不需要直接 import 某个组件或某个 Vue 对象。
这就是平台化最重要的一步。

---

## 8. 当前还可以继续优化的方向

下面这些不是必须现在就做，但很适合下一阶段推进。

### 8.1 让卡片包输出正式发布产物

当前卡片包仍然主要以源码包形式在 workspace 内消费。

后续建议每个卡片包输出：

- `manifest` 产物
- `element bundle`
- `style`
- `types`

这样才真正适合发布到 npm 或私有制品库。

### 8.2 注册表支持远程配置

当前 `registry` 是本地静态聚合：

- [packages/registry/src/index.ts](C:/workspace/aiCardTemplate/packages/registry/src/index.ts)

后续可以升级成：

- 远程 JSON 注册表
- 服务端卡片中心
- 后台可配置卡片列表

### 8.3 补充 manifest schema 校验

当前 manifest 是 TS 约束。
后续建议增加：

- JSON Schema
- CI 校验
- 发布前校验

避免卡片元数据格式漂移。

### 8.4 增加兼容性字段

建议后续补充：

- `minSdkVersion`
- `apiVersion`
- `permissions`
- `eventsSchema`
- `source.bundleUrl`
- `source.styleUrl`

这样未来支持远程卡片和多版本宿主会更稳。

### 8.5 增加更完整的运行时生命周期

当前主要是“渲染”。
后续建议增加：

- `preloadCard(name)`
- `createCardElement(name, props)`
- `updateCard(element, props)`
- `unmountCard(element)`
- `destroyCard(element)`

这样 SDK 的适用场景会更广。

---

## 9. 新增卡片的标准流程

建议团队按下面流程新增卡片：

1. 在 `packages/cards` 下新建一个卡片包目录
2. 写 `package.json`
3. 写 `*.ce.vue`
4. 写 `manifest.ts`
5. 写 `definition.ts`
6. 在 `packages/registry/src/index.ts` 注册这个 definition
7. 在独立 demo 下验证
8. 在 `host-demo` 下验证宿主接入

这样能保证新增卡片的流程标准化。

---

## 10. 推荐的后续演进路线

### 第一阶段

保持当前本地静态注册表模式，继续补齐：

- manifest 校验
- 单元测试
- 类型导出

### 第二阶段

把卡片包做成正式可发布产物包：

- 独立产物
- 版本治理
- 私有 npm 仓库

### 第三阶段

把 `registry` 升级成远程注册中心：

- 动态卡片列表
- 按租户配置
- 按权限下发

### 第四阶段

增加平台治理能力：

- 埋点
- 错误监控
- 权限模型
- 卡片灰度
- 兼容性校验

---

## 11. 结论

当前项目已经从“组件 demo”升级成了“卡片平台雏形”。

它最重要的几个边界已经建立起来了：

- `sdk-core` 负责平台协议
- `sdk-browser` 负责运行时
- `registry` 负责注册来源
- `card-*` 负责独立卡片实现
- `host-demo` 负责模拟宿主

这套结构适合继续往真正的平台化方向演进。

如果后面继续做，我建议优先级按下面来：

1. 卡片包正式产物化
2. manifest schema 校验
3. 远程注册中心
4. 运行时生命周期增强
5. 版本兼容与权限治理
