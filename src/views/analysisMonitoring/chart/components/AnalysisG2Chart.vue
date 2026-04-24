<template>
  <div ref="chartRef" class="analysis-g2-chart" />
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
let chart: G2Chart | null = null

const destroyChart = () => {
  chart?.destroy()
  chart = null
}

const createBaseChart = () => {
  if (!chartRef.value) return null

  return new G2Chart({
    container: chartRef.value,
    autoFit: true,
    height: 350,
    padding: 'auto'
  })
}

const setLegend = (instance: G2Chart) => {
  if (props.showLegend) {
    instance.legend('color', {
      position: 'top',
      layout: { justifyContent: 'center' },
      itemLabelFontSize: 16,
      itemLabelFontWeight: 600,
      itemMarkerSize: 14,
      itemSpacing: 22
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
    .tooltip((data: ChartDatum) => ({ name: data.item, value: data.count }))

  if (props.showLabel) {
    interval.label({
      text: (data: ChartDatum) => data.label || `${data.count}`,
      position: 'inside',
      fill: '#fff',
      fontSize: 12,
      transform: [{ type: 'overlapDodgeY' }]
    })
  }

  instance.axis('x', { title: false, labelAutoHide: true, labelFill: '#606266' })
  instance.axis('y', { title: false, grid: true, gridLineDash: [4, 4], labelFill: '#909399' })
  setLegend(instance)
}

const renderRingChart = (instance: G2Chart) => {
  instance.coordinate({ type: 'theta', outerRadius: 0.78, innerRadius: 0.56 })
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
      fontSize: 12
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
  instance.axis('x', { title: false, labelAutoRotate: false, labelFill: '#606266' })
  instance.axis('y', { title: false, grid: true, gridLineDash: [4, 4], labelFill: '#909399' })
  setLegend(instance)
}

const renderChart = async () => {
  await nextTick()
  destroyChart()
  const instance = createBaseChart()
  if (!instance) return

  chart = instance
  if (props.type === 'bar') renderBarChart(instance)
  if (props.type === 'donut') renderRingChart(instance)
  if (props.type === 'line') renderLineChart(instance)
  instance.render()
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
.analysis-g2-chart {
  width: 100%;
  height: 350px;
}
</style>
