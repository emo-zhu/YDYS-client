import { ref } from 'vue'
import { getAnalysisChartCards } from '../api/chart'
import type { AnalysisChartCard } from '../types/chart'

export const useAnalysisChartPage = () => {
  const loading = ref(false)
  const cards = ref<AnalysisChartCard[]>([])

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
    loadCharts,
    onSetting,
    onDownload
  }
}
