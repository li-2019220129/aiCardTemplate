<template>
  <article class="card-shell">
    <p class="card-eyebrow">Welcome Card</p>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <button type="button" @click="count += 1">Clicks {{ count }}</button>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue';

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
  }>(),
  {
    title: 'Smart Card Component',
    description: 'This card is rendered as a standalone package.'
  }
);

const count = ref(0);
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
  background: linear-gradient(135deg, #cffafe 0%, #f0fdfa 100%);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  font-family: "Segoe UI", "PingFang SC", sans-serif;
}

.card-eyebrow {
  margin: 0 0 8px;
  color: #0f766e;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h3 {
  margin: 0 0 12px;
}

button {
  border: 0;
  border-radius: 999px;
  background: #0f766e;
  color: #fff;
  cursor: pointer;
  font: inherit;
  padding: 0.75rem 1.2rem;
}
</style>
