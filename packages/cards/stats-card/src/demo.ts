import { defineCustomElement } from 'vue';
import StatsCard from './StatsCard.ce.vue';

customElements.define('stats-card-demo', defineCustomElement(StatsCard));

document.querySelector('#app')!.innerHTML = `
  <main style="max-width:960px;margin:40px auto;padding:0 20px;font-family:Segoe UI,PingFang SC,sans-serif;">
    <h1>Stats Card 独立工程</h1>
    <p>这个页面来自卡片自己的 package，可单独运行和调试。</p>
    <stats-card-demo title="独立卡片调试页"></stats-card-demo>
  </main>
`;
