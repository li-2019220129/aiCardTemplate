import type { CardManifest, CardPublicInfo, CardRegistration } from './types';

export class SmartCardRegistry<TModule = unknown> {
  private cards = new Map<string, CardRegistration<TModule>>();

  register(card: CardRegistration<TModule>) {
    this.cards.set(card.manifest.name, card);
    return this;
  }

  registerMany(cards: CardRegistration<TModule>[]) {
    cards.forEach((card) => this.register(card));
    return this;
  }

  has(name: string) {
    return this.cards.has(name);
  }

  getRegistration(name: string) {
    return this.cards.get(name);
  }

  getManifest(name: string): CardManifest | undefined {
    return this.cards.get(name)?.manifest;
  }

  getCardInfo(name: string): CardPublicInfo | undefined {
    const manifest = this.getManifest(name);
    return manifest ? { ...manifest } : undefined;
  }

  getAllCards(): CardPublicInfo[] {
    return Array.from(this.cards.values()).map((card) => ({ ...card.manifest }));
  }

  getCardNames() {
    return Array.from(this.cards.keys());
  }

  async load(name: string) {
    const registration = this.cards.get(name);

    if (!registration) {
      throw new Error(`Card "${name}" is not registered.`);
    }

    return registration.load();
  }
}
