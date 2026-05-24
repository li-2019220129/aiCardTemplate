<template>
  <article class="card-shell">
    <p class="card-eyebrow">Stats Card</p>
    <h3>{{ title }}</h3>
    <div class="stats-grid">
      <section v-for="item in items" :key="item.label" class="stats-item">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </section>
    </div>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    items?: Array<{ label: string; value: string }>;
  }>(),
  {
    title: 'Daily Overview',
    items: () => [
      { label: 'New Messages', value: '12' },
      { label: 'Pending Tasks', value: '6' },
      { label: 'Completion', value: '89%' }
    ]
  }
);
</script>

<style>
:host {
  display: block;
}

.card-shell {
  width: 100%;
  border-radius: 24px;
  padding: 24px;
  color: #0f172a;
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  font-family: "Segoe UI", "PingFang SC", sans-serif;
}

.card-eyebrow {
  margin: 0 0 8px;
  color: #1d4ed8;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stats-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.stats-item {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.68);
  padding: 18px;
}
</style>
