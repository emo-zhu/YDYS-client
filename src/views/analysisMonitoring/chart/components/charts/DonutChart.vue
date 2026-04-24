<template>
  <div class="donut-chart">
    <svg viewBox="0 0 220 220" class="donut-chart__svg">
      <circle cx="110" cy="110" r="68" fill="none" stroke="#f2f3f5" stroke-width="44" />
      <circle
        v-for="segment in segments"
        :key="segment.name"
        cx="110"
        cy="110"
        r="68"
        fill="none"
        :stroke="segment.color"
        stroke-width="44"
        :stroke-dasharray="`${segment.length} ${circumference - segment.length}`"
        :stroke-dashoffset="segment.offset"
        transform="rotate(-90 110 110)"
      />
      <circle cx="110" cy="110" r="42" fill="#fff" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { DonutChartItem } from '../../src/types/chart'

const props = defineProps<{
  items: DonutChartItem[]
}>()

const circumference = 2 * Math.PI * 68
const total = computed(() => props.items.reduce((sum, item) => sum + item.value, 0) || 1)
const segments = computed(() => {
  let offset = 0
  return props.items.map((item) => {
    const length = (item.value / total.value) * circumference
    const segment = {
      ...item,
      length,
      offset: -offset
    }
    offset += length
    return segment
  })
})
</script>

<style scoped lang="scss">
.donut-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.donut-chart__svg {
  width: 260px;
  height: 260px;
}
</style>
