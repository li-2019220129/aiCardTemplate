import './styles/base.css';
import { localCardRegistry } from '@smart-cards/registry';
import { BrowserCardSDK } from './BrowserCardSDK';

declare global {
  interface Window {
    SmartCardSDK?: {
      sdk: BrowserCardSDK;
      BrowserCardSDK: typeof BrowserCardSDK;
      createSmartCardSDK: () => BrowserCardSDK;
    };
  }
}

export { BrowserCardSDK };
export { localCardRegistry } from '@smart-cards/registry';

export function createSmartCardSDK() {
  return new BrowserCardSDK().registerCards(localCardRegistry);
}

export const sdk = createSmartCardSDK();
void sdk.defineAllCards();

if (typeof window !== 'undefined') {
  window.SmartCardSDK = {
    sdk,
    BrowserCardSDK,
    createSmartCardSDK
  };
}
