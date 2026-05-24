import { sdk } from './sdk-entry';

const registryList = document.querySelector('#registry-list');
const codeBlock = document.querySelector('#code-example');

async function mountHelloCard() {
  await sdk.renderCard({
    name: 'hello-card',
    selector: '#card-mount',
    props: {
      title: '由 Browser SDK 渲染',
      description: '运行时层通过 registry 找到卡片 loader，再完成注册和渲染。'
    }
  });
}

async function mountStatsCard() {
  await sdk.renderCard({
    name: 'stats-card',
    selector: '#card-mount',
    props: {
      title: '运行时数据卡片',
      items: [
        { label: 'Core', value: 'Separated' },
        { label: 'Registry', value: 'Separated' },
        { label: 'Browser', value: 'Separated' }
      ]
    }
  });
}

if (registryList) {
  registryList.innerHTML = sdk
    .getAllCards()
    .map(
      (card) => `
        <article class="registry-item">
          <div>
            <strong>${card.title}</strong>
            <div class="registry-meta">${card.name} / ${card.tag}</div>
            <div class="registry-meta">${card.packageName} v${card.version}</div>
          </div>
          <button type="button" data-card-name="${card.name}">渲染</button>
        </article>
      `
    )
    .join('');

  registryList.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    const cardName = target.dataset.cardName;

    if (cardName === 'stats-card') {
      await mountStatsCard();
      return;
    }

    if (cardName === 'hello-card') {
      await mountHelloCard();
    }
  });
}

document.querySelector('#mount-hello')?.addEventListener('click', () => {
  void mountHelloCard();
});

document.querySelector('#mount-stats')?.addEventListener('click', () => {
  void mountStatsCard();
});

if (codeBlock) {
  codeBlock.textContent = `const sdk = window.SmartCardSDK.sdk;

const cards = sdk.getAllCards();
const hello = sdk.getCardInfo('hello-card');

await sdk.renderCard({
  name: 'hello-card',
  selector: '#target',
  props: { title: hello?.title }
});`;
}

void mountHelloCard();
