import '@smart-cards/sdk-browser/style';
import { sdk } from '@smart-cards/sdk-browser';

const logBlock = document.querySelector('#host-log');
const registryBlock = document.querySelector('#host-registry');

function writeLog(message: string) {
  if (logBlock) {
    logBlock.textContent = message;
  }
}

async function renderByName(name: string) {
  if (name === 'stats-card') {
    const node = await sdk.renderCard({
      name,
      selector: '#host-card',
      props: {
        title: '外部系统动态渲染',
        items: [
          { label: 'Card Name', value: name },
          { label: 'API', value: 'sdk.renderCard' },
          { label: 'State', value: 'Mounted' }
        ]
      }
    });
    writeLog(`已渲染 ${name} -> <${node.tagName.toLowerCase()}>`);
    return;
  }

  const node = await sdk.renderCard({
    name,
    selector: '#host-card',
    props: {
      title: '外部系统动态渲染',
      description: `当前是通过 sdk.renderCard({ name: '${name}' }) 渲染的卡片。`
    }
  });
  writeLog(`已渲染 ${name} -> <${node.tagName.toLowerCase()}>`);
}

document.querySelector('#mount-hello')?.addEventListener('click', () => {
  void renderByName('hello-card');
});

document.querySelector('#mount-stats')?.addEventListener('click', () => {
  void renderByName('stats-card');
});

if (registryBlock) {
  registryBlock.textContent = JSON.stringify(sdk.getAllCards(), null, 2);
}

void renderByName('hello-card');
