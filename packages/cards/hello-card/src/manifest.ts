
import { CardManifest } from '@smart-cards/sdk-core';

export const helloCardManifest: CardManifest = {
  id: 'smart-cards.hello-card',
  name: 'hello-card',
  tag: 'smart-hello-card',
  title: '欢迎卡片',
  description: '用于展示欢迎文案和简单交互的基础卡片。',
  version: '1.0.0',
  packageName: '@smart-cards/hello-card',
  category: 'basic',
  owner: 'frontend-platform',
  runtime: 'web-component',
  status: 'active',
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' }
    }
  }
};


