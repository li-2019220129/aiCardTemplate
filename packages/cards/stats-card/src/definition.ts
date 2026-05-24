import type { BrowserCardRegistration } from '@smart-cards/sdk-core';
import { statsCardManifest } from './manifest';

export const statsCardDefinition: BrowserCardRegistration = {
  manifest: statsCardManifest,
  load: async () => (await import('./StatsCard.ce.vue')).default
};
