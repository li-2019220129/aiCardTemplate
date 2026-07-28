<template>
  <article ref="cardRef" class="arrow-card" role="group" :aria-label="title">
    <svg
      class="card-backdrop"
      :viewBox="`0 0 ${shapeWidth} ${shapeHeight}`"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path class="card-fill" :d="shapePath" />
      <path class="card-outline" :d="shapePath" />
    </svg>
    <div class="card-content">
      <p class="card-eyebrow">{{ eyebrow }}</p>
      <h3>{{ title }}</h3>
      <p class="card-copy">{{ description }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

withDefaults(
  defineProps<{
    eyebrow?: string;
    title?: string;
    description?: string;
  }>(),
  {
    eyebrow: "Quick Link",
    title: "Transparent Gray Card",
    description: "A soft translucent card with an integrated right-side arrow.",
  },
);

const cardRef = ref<HTMLElement | null>(null);
const cardSize = ref({ width: 320, height: 136 });
let resizeObserver: ResizeObserver | undefined;

// 右侧箭头向外凸出的深度，数值越大箭头越突出。
const arrowDepth = 12;
// 右侧箭头高度的一半，数值越大箭头越宽厚。
const arrowHalfHeight = 14;
// 卡片主体四角圆角半径。
const radius = 20;

const shapeWidth = computed(() =>
  Math.round(cardSize.value.width + arrowDepth),
);
const shapeHeight = computed(() => Math.round(cardSize.value.height));
const shapePath = computed(() => {
  const bodyWidth = Math.max(80, Math.round(cardSize.value.width));
  const height = Math.max(80, Math.round(cardSize.value.height));
  const r = Math.min(radius, height / 2 - 2, bodyWidth / 2 - 2);
  const centerY = height / 2;
  const topJoin = centerY - arrowHalfHeight;
  const bottomJoin = centerY + arrowHalfHeight;
  const tipX = bodyWidth + arrowDepth;

  return [
    `M ${r} 0`,
    `H ${bodyWidth - r}`,
    `Q ${bodyWidth} 0 ${bodyWidth} ${r}`,
    `V ${topJoin}`,
    `C ${bodyWidth} ${topJoin + 3} ${bodyWidth + 2} ${topJoin + 5} ${bodyWidth + 4} ${topJoin + 7}`,
    `L ${tipX - 2} ${centerY - 2}`,
    `Q ${tipX} ${centerY} ${tipX - 2} ${centerY + 2}`,
    `L ${bodyWidth + 4} ${bottomJoin - 7}`,
    `C ${bodyWidth + 2} ${bottomJoin - 5} ${bodyWidth} ${bottomJoin - 3} ${bodyWidth} ${bottomJoin}`,
    `V ${height - r}`,
    `Q ${bodyWidth} ${height} ${bodyWidth - r} ${height}`,
    `H ${r}`,
    `Q 0 ${height} 0 ${height - r}`,
    `V ${r}`,
    `Q 0 0 ${r} 0`,
    "Z",
  ].join(" ");
});

onMounted(() => {
  if (!cardRef.value) {
    return;
  }

  const updateSize = () => {
    if (!cardRef.value) {
      return;
    }

    const { width, height } = cardRef.value.getBoundingClientRect();
    cardSize.value = { width, height };
  };

  updateSize();
  resizeObserver = new ResizeObserver(updateSize);
  resizeObserver.observe(cardRef.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<style>
:host {
  display: block;
}

.arrow-card {
  /* 卡片填充色：调整 alpha 可以控制背景透明度。 */
  --card-bg: rgba(107, 114, 128, 0.18);
  /* 卡片边框色：这条描边会沿着主体和箭头的完整轮廓绘制。 */
  --card-edge: rgba(255, 255, 255, 0.42);
  /* 卡片内文字颜色。 */
  --card-text: #111827;
  /* 右侧箭头预留宽度：需要和上方脚本里的 arrowDepth 保持一致。 */
  --arrow-depth: 12px;

  position: relative;
  box-sizing: border-box;
  width: calc(100% - var(--arrow-depth));
  min-height: 136px;
  margin-right: var(--arrow-depth);
  padding: 24px 30px 24px 28px;
  color: var(--card-text);
  font-family: "Segoe UI", "PingFang SC", sans-serif;
  overflow: visible;
}

.card-backdrop {
  position: absolute;
  inset: 0;
  right: calc(var(--arrow-depth) * -1);
  z-index: 0;
  width: calc(100% + var(--arrow-depth));
  height: 100%;
  overflow: visible;
}

.card-fill,
.card-outline {
  vector-effect: non-scaling-stroke;
}

.card-fill {
  fill: var(--card-bg);
  stroke: none;
}

.card-outline {
  fill: none;
  stroke: var(--card-edge);
  stroke-linejoin: round;
  stroke-width: 1;
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-eyebrow {
  margin: 0 0 8px;
  color: rgba(17, 24, 39, 0.68);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h3 {
  margin: 0 0 10px;
  font-size: 1.25rem;
  line-height: 1.25;
}

.card-copy {
  max-width: 34rem;
  margin: 0;
  color: rgba(17, 24, 39, 0.72);
  font-size: 0.98rem;
  line-height: 1.55;
}

@media (max-width: 520px) {
  .arrow-card {
    --arrow-depth: 8px;
    min-height: 120px;
    padding: 20px;
  }
}
</style>
