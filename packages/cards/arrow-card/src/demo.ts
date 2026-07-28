import { defineCustomElement } from 'vue';
import ArrowCard from './ArrowCard.ce.vue';

customElements.define('arrow-card-demo', defineCustomElement(ArrowCard));

document.querySelector('#app')!.innerHTML = `
  <main style="max-width:960px;margin:40px auto;padding:0 20px;font-family:Segoe UI,PingFang SC,sans-serif;">
    <h1>Arrow Card Demo</h1>
    <p>This page runs the arrow card package independently.</p>
    <arrow-card-demo title="Integrated Arrow Card" description="The right-side triangle is part of the same translucent gray surface."></arrow-card-demo>
  </main>
`;
