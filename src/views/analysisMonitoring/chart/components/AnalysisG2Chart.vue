<template>
  <n-spin :show="rendering" class="analysis-g2-chart-spin">
    <div ref="chartRef" class="analysis-g2-chart" />
  </n-spin>
</template>

<script lang="ts" setup>
import { Chart as G2Chart } from '@antv/g2'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { AnalysisChartKind } from '../src/types/chart'

interface ChartDatum {
  item: string
  count: number
  group?: string
  label?: string
  tooltip?: string
}

const props = withDefaults(
  defineProps<{
    type: Exclude<AnalysisChartKind, 'empty'>
    data: ChartDatum[]
    showLegend?: boolean
    showLabel?: boolean
  }>(),
  {
    showLegend: true,
    showLabel: true
  }
)

const palette = ['#78a6f6', '#72cfae', '#f8bd67', '#a98af0', '#ef7bb8', '#f17777', '#8c8c8c']
const chartRef = ref<HTMLElement | null>(null)
const rendering = ref(false)
let chart: G2Chart | null = null

const axisStyle = {
  title: false,
  labelFill: '#000000',
  labelOpacity: 1,
  labelFontSize: 12,
  labelFontWeight: 400,
  line: true,
  tick: true
}

const destroyChart = () => {
  chart?.destroy()
  chart = null
}

const createBaseChart = () => {
  if (!chartRef.value) return null
  const padding = props.type === 'donut' ? ([36, 96, 36, 96] as [number, number, number, number]) : 'auto'

  return new G2Chart({
    container: chartRef.value,
    autoFit: true,
    height: 300,
    padding: padding as never
  })
}

const setLegend = (instance: G2Chart) => {
  if (props.showLegend) {
    instance.legend('color', {
      position: 'top',
      layout: { justifyContent: 'center' },
      itemLabelFontSize: 14,
      itemLabelFontWeight: 400,
      itemMarkerSize: 11,
      itemSpacing: 18
    })
    return
  }

  instance.legend(false)
}

const renderBarChart = (instance: G2Chart) => {
  const sortedData = [...props.data].sort((prev, next) => next.count - prev.count)
  const interval = instance
    .interval()
    .data(sortedData)
    .coordinate({ transform: [{ type: 'transpose' }] })
    .encode('x', 'item')
    .encode('y', 'count')
    .encode('color', 'item')
    .scale('y', { domainMin: 0, nice: true })
    .scale('color', { range: palette })
    .style('radiusTopLeft', 3)
    .style('radiusTopRight', 3)
    .tooltip((data: ChartDatum) => ({ name: data.tooltip || data.item, value: data.count }))

  if (props.showLabel) {
    interval.label({
      text: (data: ChartDatum) => `${data.count}`,
      position: 'right',
      fill: '#000000',
      fontSize: 12,
      fontWeight: 400,
      dx: 8,
      transform: [{ type: 'overlapDodgeY' }]
    })
  }

  instance.axis('x', { ...axisStyle, labelAutoHide: true })
  instance.axis('y', { ...axisStyle, grid: true, gridLineDash: [4, 4] })
  setLegend(instance)
}

const renderRingChart = (instance: G2Chart) => {
  instance.coordinate({ type: 'theta', outerRadius: 0.68, innerRadius: 0.5 })
  const interval = instance
    .interval()
    .data(props.data)
    .transform({ type: 'stackY' })
    .encode('y', 'count')
    .encode('color', 'item')
    .scale('color', { range: palette })
    .style('stroke', '#fff')
    .style('lineWidth', 2)
    .tooltip((data: ChartDatum) => ({ name: data.item, value: data.count }))

  if (props.showLabel) {
    interval.label({
      position: 'outside',
      text: (data: ChartDatum) => `${data.item}：${data.count}`,
      fontSize: 12,
      fill: '#000000',
      connector: true
    })
  }

  setLegend(instance)
  instance.interaction('elementHighlight', true)
}

const renderLineChart = (instance: G2Chart) => {
  const hasGroup = props.data.some((item) => item.group)
  instance.data(props.data)
  const line = instance
    .line()
    .encode('x', 'item')
    .encode('y', 'count')
    .encode('color', hasGroup ? 'group' : 'item')
    .scale('color', { range: palette })
    .style('lineWidth', 2.4)
    .style('lineJoin', 'round')
    .style('lineCap', 'round')
    .tooltip((data: ChartDatum) => ({ name: data.group || data.item, value: data.count }))

  if (props.showLabel) {
    line.label({
      text: (data: ChartDatum) => (data.count > 0 ? String(data.count) : ''),
      style: { dy: -10, fontSize: 12, fill: '#606266' },
      transform: [{ type: 'overlapHide' }]
    })
  }

  instance
    .point()
    .encode('x', 'item')
    .encode('y', 'count')
    .encode('color', hasGroup ? 'group' : 'item')
    .style('fill', '#fff')
    .style('lineWidth', 2)
    .tooltip(false)

  instance.scale('y', { domainMin: 0, nice: true })
  instance.axis('x', { ...axisStyle, labelAutoRotate: false })
  instance.axis('y', { ...axisStyle, grid: true, gridLineDash: [4, 4] })
  setLegend(instance)
}

const renderChart = async () => {
  rendering.value = true
  await nextTick()
  try {
    destroyChart()
    const instance = createBaseChart()
    if (!instance) return

    chart = instance
    if (props.type === 'bar') renderBarChart(instance)
    if (props.type === 'donut') renderRingChart(instance)
    if (props.type === 'line') renderLineChart(instance)
    await Promise.resolve(instance.render())
  } finally {
    rendering.value = false
  }
}

const downloadImage = async (fileName: string) => {
  await nextTick()
  const safeFileName = fileName.replace(/[\\/:*?"<>|]/g, '_')
  const canvas = chartRef.value?.querySelector('canvas')
  if (!canvas) return false

  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `${safeFileName}.png`
  link.click()
  return true
}

onMounted(renderChart)
onBeforeUnmount(destroyChart)
watch(() => [props.type, props.data, props.showLegend, props.showLabel], renderChart, { deep: true })

defineExpose({ downloadImage })
</script>

<style scoped lang="scss">
.analysis-g2-chart-spin {
  width: 100%;
}

.analysis-g2-chart {
  width: 100%;
  height: 300px;
}

.analysis-g2-chart-spin :deep(.n-spin-content) {
  width: 100%;
}
</style>
