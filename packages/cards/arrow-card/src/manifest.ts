import { CardManifest } from '@smart-cards/sdk-core';

export const arrowCardManifest: CardManifest = {
  id: 'smart-cards.arrow-card',
  name: 'arrow-card',
  tag: 'smart-arrow-card',
  title: 'Arrow Card',
  description: 'A translucent gray card with an integrated right-side triangle arrow.',
  version: '1.0.0',
  packageName: '@smart-cards/arrow-card',
  category: 'basic',
  owner: 'frontend-platform',
  runtime: 'web-component',
  status: 'active',
  propsSchema: {
    type: 'object',
    properties: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' }
    }
  }
};
