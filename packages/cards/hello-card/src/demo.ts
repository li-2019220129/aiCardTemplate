import { defineCustomElement } from 'vue';
import HelloCard from './HelloCard.ce.vue';

customElements.define('hello-card-demo', defineCustomElement(HelloCard));

document.querySelector('#app')!.innerHTML = `
  <main style="max-width:960px;margin:40px auto;padding:0 20px;font-family:Segoe UI,PingFang SC,sans-serif;">
    <h1>Hello Card 独立工程</h1>
    <p>这个页面来自卡片自己的 package，可单独运行和调试。</p>
    <hello-card-demo title="独立卡片调试页" description="当前卡片来自 @smart-cards/hello-card"></hello-card-demo>
  </main>
`;
