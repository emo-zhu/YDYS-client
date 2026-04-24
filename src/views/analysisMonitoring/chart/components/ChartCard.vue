<template>
  <div v-if="hasVisibleData" class="chart-card">
    <div class="chart-card__header">
      <div class="chart-card__title">{{ card.title }}</div>
    </div>

    <div class="chart-card__body" :class="{ 'chart-card__body--rank': showRankPanel }">
      <div class="chart-card__chart-wrap">
        <AnalysisG2Chart
          ref="chartRef"
          :type="card.kind"
          :data="chartData"
          :show-legend="chartSetting.showLegend"
          :show-label="chartSetting.showLabel"
        />
      </div>
      <div v-if="showRankPanel" class="chart-rank">
        <div v-for="(item, index) in rankItems" :key="item.name" class="chart-rank__item">
          <span class="chart-rank__badge">NO.{{ index + 1 }}</span>
          <div class="chart-rank__content">
            <span class="chart-rank__name">{{ item.name }}分布</span>
            <span class="chart-rank__value">{{ item.value }}<em>次</em></span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasAction('setting') || hasAction('download')" class="chart-card__tools">
      <button v-if="hasAction('setting')" class="chart-card__tool" type="button" title="设置" @click="openSetting">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.28 7.28 0 0 0-1.69-.98L14.5 2.42A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.61.24-1.18.56-1.69.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.08.65-.08.98s.03.66.08.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.13.23.4.32.6.22l2.49-1c.51.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.49.42h4c.24 0 .45-.18.49-.42l.38-2.65c.61-.24 1.18-.56 1.69-.98l2.49 1c.23.08.48 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
        </svg>
      </button>
      <button v-if="hasAction('download')" class="chart-card__tool" type="button" title="下载" @click="onDownload">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3a1 1 0 0 1 1 1v9.17l3.59-3.58A1 1 0 1 1 18 11l-5.3 5.3a1 1 0 0 1-1.4 0L6 11a1 1 0 1 1 1.41-1.41L11 13.17V4a1 1 0 0 1 1-1Zm-7 15a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
        </svg>
      </button>
    </div>

    <n-modal v-model:show="settingVisible" preset="card" title="参数设置" class="chart-setting-modal">
      <n-form label-placement="left" label-width="72" :model="settingForm" class="chart-setting-form">
        <n-form-item label="名次：">
          <n-input-number v-model:value="settingForm.rankCount" :min="1" :show-button="false" class="chart-setting-input" />
        </n-form-item>
        <n-form-item label="类型：">
          <n-select v-model:value="settingForm.type" :options="typeOptions" class="chart-setting-input" />
        </n-form-item>
        <n-form-item label="年份：">
          <n-select v-model:value="settingForm.year" :options="yearOptions" class="chart-setting-input" />
        </n-form-item>
        <n-form-item label="月份：">
          <n-select v-model:value="settingForm.month" :options="monthOptions" clearable placeholder="请选择" class="chart-setting-input" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <j-button round @click="settingVisible = false">取消</j-button>
          <j-button type="info" round @click="confirmSetting">确定</j-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { JButton } from 'junegoo-ui'
import type { AnalysisChartCard } from '../src/types/chart'
import AnalysisG2Chart from './AnalysisG2Chart.vue'

type ChartInstance = InstanceType<typeof AnalysisG2Chart> | null

const props = defineProps<{
  card: AnalysisChartCard
}>()

const chartRef = ref<ChartInstance>(null)
const settingVisible = ref(false)
const chartSetting = reactive({
  showLegend: true,
  showLabel: true
})
const settingForm = reactive({
  rankCount: 10,
  type: null as string | null,
  year: null as string | null,
  month: null as string | null
})

const typeOptions = [
  { label: '加分', value: 'plus' },
  { label: '减分', value: 'minus' }
]
const yearOptions = [
  { label: '2026年', value: '2026' },
  { label: '2025年', value: '2025' },
  { label: '2024年', value: '2024' }
]
const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}月`,
  value: String(index + 1)
}))

const hasAction = (type: 'setting' | 'download') =>
  props.card.actions?.some((action) => action.type === type)

const rankItems = computed(() =>
  [...(props.card.donut || [])].sort((prev, next) => next.value - prev.value).slice(0, 2)
)

const showRankPanel = computed(() => props.card.kind === 'donut' && rankItems.value.length > 0)

const hasVisibleData = computed(() => {
  if (props.card.kind === 'bar') return Boolean(props.card.bars?.some((item) => item.value !== 0))
  if (props.card.kind === 'donut') return Boolean(props.card.donut?.some((item) => item.value !== 0))
  return Boolean(props.card.lines?.some((line) => line.values.some((value) => value !== 0)))
})

const chartData = computed(() => {
  if (props.card.kind === 'bar') {
    return (props.card.bars || []).map((item) => ({ item: item.name, count: item.value, tooltip: item.label }))
  }

  if (props.card.kind === 'donut') {
    return (props.card.donut || []).map((item) => ({ item: item.name, count: item.value }))
  }

  return (props.card.lines || []).flatMap((line) =>
    line.values.map((value, index) => ({
      item: props.card.xAxis?.[index] || String(index + 1),
      count: value,
      group: line.name
    }))
  )
})

const openSetting = () => {
  settingVisible.value = true
}

const confirmSetting = () => {
  settingVisible.value = false
  window.$message?.success('参数设置成功')
}

const onDownload = async () => {
  const success = await chartRef.value?.downloadImage(props.card.title || '分析图')
  if (success) {
    window.$message?.success('下载成功')
    return
  }
  window.$message?.warning('当前图表暂不支持下载')
}
</script>

<style scoped lang="scss">
.chart-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: rgba(222, 229, 250, 0.6) 1px 1px 9px 1px;
}

.chart-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.chart-card__title {
  position: relative;
  padding-left: 12px;
  color: #1f2329;
  font-size: 16px;
  font-weight: 600;
}

.chart-card__title::before {
  position: absolute;
  top: 2px;
  left: 0;
  width: 4px;
  height: 20px;
  background: #337cff;
  border-radius: 2px;
  content: '';
}

.chart-card__body {
  flex: 1;
  min-height: 300px;
  margin-top: 12px;
}

.chart-card__body--rank {
  display: grid;
  grid-template-columns: minmax(360px, 1fr) 250px;
  align-items: center;
  gap: 18px;
}

.chart-card__chart-wrap {
  min-width: 0;
}

.chart-card__tools {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-card__tool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: #8a95a6;
  line-height: 1;
  background: #f7f9fc;
  border: 1px solid #edf1f7;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease, border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.chart-card__tool svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.chart-card__tool:hover {
  color: #1677ff;
  background: #eef6ff;
  border-color: #b9d8ff;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.14);
}

.chart-rank {
  display: grid;
  gap: 22px;
}

.chart-rank__item + .chart-rank__item {
  padding-top: 22px;
  border-top: 1px solid #edf1f7;
}

.chart-rank__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 10px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  background: #2f80ed;
}

.chart-rank__content {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
  color: #1f2329;
}

.chart-rank__name {
  font-size: 16px;
}

.chart-rank__value {
  color: #2f80ed;
  font-size: 28px;
  font-weight: 600;
  white-space: nowrap;
}

.chart-rank__value em {
  margin-left: 4px;
  color: #1f2329;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}

:global(.chart-setting-modal) {
  width: 520px;
}

.chart-setting-form {
  padding: 28px 32px 18px;
}

.chart-setting-input {
  width: 100%;
}

@media (max-width: 1280px) {
  .chart-card__body--rank {
    grid-template-columns: 1fr;
  }
}
</style>
