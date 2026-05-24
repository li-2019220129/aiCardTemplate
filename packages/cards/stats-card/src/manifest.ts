export const statsCardManifest = {
  id: 'smart-cards.stats-card',
  name: 'stats-card',
  tag: 'smart-stats-card',
  title: '数据卡片',
  description: '用于展示多个指标数据的统计类卡片。',
  version: '1.0.0',
  packageName: '@smart-cards/stats-card',
  category: 'dashboard',
  owner: 'frontend-platform',
  runtime: 'web-component',
  status: 'active',
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      items: { type: 'array' }
    }
  }
};
