export type CardRuntime = 'web-component';

export interface CardManifest {
  id: string;
  name: string;
  tag: string;
  title: string;
  description: string;
  version: string;
  packageName: string;
  category: string;
  owner: string;
  runtime: string;
  status: 'active' | 'beta' | 'deprecated';
  propsSchema: Record<string, unknown>;
  minSdkVersion?: string;
}

export interface CardPublicInfo extends CardManifest { }

export interface CardRegistration<TModule = unknown> {
  manifest: CardManifest;
  load: () => Promise<TModule>;
}

export type BrowserCardRegistration = CardRegistration<unknown>;

export interface RenderCardOptions {
  name: string;
  selector: string | Element;
  props?: Record<string, unknown>;
  replace?: boolean;
}
