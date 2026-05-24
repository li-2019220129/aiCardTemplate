import { defineCustomElement, type DefineComponent } from 'vue';
import { SmartCardRegistry, type BrowserCardRegistration, type CardPublicInfo, type RenderCardOptions } from '@smart-cards/sdk-core';

type BrowserRegistration = BrowserCardRegistration & {
  elementClass?: CustomElementConstructor;
};

export class BrowserCardSDK {
  private registry = new SmartCardRegistry<unknown>();
  private browserCards = new Map<string, BrowserRegistration>();

  registerCard(card: BrowserRegistration) {
    this.registry.register(card);
    this.browserCards.set(card.manifest.name, card);
    return this;
  }

  registerCards(cards: BrowserRegistration[]) {
    cards.forEach((card) => this.registerCard(card));
    return this;
  }

  getCardInfo(name: string): CardPublicInfo | undefined {
    return this.registry.getCardInfo(name);
  }

  getAllCards(): CardPublicInfo[] {
    return this.registry.getAllCards();
  }

  async defineCard(name: string) {
    const registration = this.browserCards.get(name);

    if (!registration) {
      throw new Error(`Card "${name}" is not registered.`);
    }

    if (customElements.get(registration.manifest.tag)) {
      return customElements.get(registration.manifest.tag)!;
    }

    const module = await registration.load();
    const component = this.unwrapModule(module);
    registration.elementClass = defineCustomElement(component as DefineComponent);
    customElements.define(registration.manifest.tag, registration.elementClass);
    return registration.elementClass;
  }

  async defineAllCards() {
    await Promise.all(this.registry.getCardNames().map((name) => this.defineCard(name)));
    return this;
  }

  async createCardElement(name: string, props: Record<string, unknown> = {}) {
    const info = this.getCardInfo(name);

    if (!info) {
      throw new Error(`Card "${name}" is not registered.`);
    }

    await this.defineCard(name);

    const element = document.createElement(info.tag) as HTMLElement & Record<string, unknown>;
    this.applyProps(element, props);
    return element;
  }

  async renderCard(options: RenderCardOptions) {
    const container =
      typeof options.selector === 'string'
        ? document.querySelector(options.selector)
        : options.selector;

    if (!container) {
      throw new Error(`Target "${String(options.selector)}" was not found.`);
    }

    const element = await this.createCardElement(options.name, options.props ?? {});

    if (options.replace ?? true) {
      container.replaceChildren(element);
    } else {
      container.appendChild(element);
    }

    return element;
  }

  private unwrapModule(module: unknown) {
    if (module && typeof module === 'object' && 'default' in module) {
      return (module as { default: unknown }).default;
    }

    return module;
  }

  private applyProps(element: HTMLElement & Record<string, unknown>, props: Record<string, unknown>) {
    Object.entries(props).forEach(([key, value]) => {
      element[key] = value;

      if (typeof value === 'string' || typeof value === 'number') {
        element.setAttribute(this.toKebabCase(key), String(value));
      }
    });
  }

  private toKebabCase(value: string) {
    return value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
  }
}
