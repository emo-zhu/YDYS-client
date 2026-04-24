import { computed, ref } from 'vue'
import { getAnalysisChartCards } from '../api/chart'
import type { AnalysisChartCard } from '../types/chart'

const hasChartData = (card: AnalysisChartCard) => {
  if (card.kind === 'bar') return Boolean(card.bars?.some((item) => item.value !== 0))
  if (card.kind === 'donut') return Boolean(card.donut?.some((item) => item.value !== 0))
  if (card.kind === 'line') {
    return Boolean(card.lines?.some((line) => line.values.some((value) => value !== 0)))
  }
  return false
}

export const useAnalysisChartPage = () => {
  const loading = ref(false)
  const cards = ref<AnalysisChartCard[]>([])
  const visibleCards = computed(() => cards.value.filter(hasChartData))

  const loadCharts = async () => {
    loading.value = true
    try {
      cards.value = await getAnalysisChartCards()
    } finally {
      loading.value = false
    }
  }

  const onSetting = (card: AnalysisChartCard) => {
    window.$message?.info(`${card.title || '图表'}配置待接入`)
  }

  const onDownload = (card: AnalysisChartCard) => {
    window.$message?.success(`${card.title || '图表'}下载待接入`)
  }

  return {
    loading,
    cards,
    visibleCards,
    loadCharts,
    onSetting,
    onDownload
  }
}
