import type { BrowserCardRegistration } from '@smart-cards/sdk-core';
import { helloCardDefinition } from '@smart-cards/hello-card';
import { statsCardDefinition } from '@smart-cards/stats-card';

export const localCardRegistry: BrowserCardRegistration[] = [helloCardDefinition, statsCardDefinition];
