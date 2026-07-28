import type { BrowserCardRegistration } from '@smart-cards/sdk-core';
import { arrowCardManifest } from './manifest';

export const arrowCardDefinition: BrowserCardRegistration = {
  manifest: arrowCardManifest,
  load: async () => (await import('./ArrowCard.ce.vue')).default
};
