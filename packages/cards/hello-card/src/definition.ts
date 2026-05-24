import type { BrowserCardRegistration } from '@smart-cards/sdk-core';
import { helloCardManifest } from './manifest';

export const helloCardDefinition: BrowserCardRegistration = {
  manifest: helloCardManifest,
  load: async () => (await import('./HelloCard.ce.vue')).default
};
