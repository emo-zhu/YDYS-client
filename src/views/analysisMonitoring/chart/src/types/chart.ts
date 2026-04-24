export type AnalysisChartKind = 'bar' | 'donut' | 'line' | 'empty'

export interface ChartAction {
  type: 'setting' | 'download'
}

export interface BarChartItem {
  name: string
  value: number
  label: string
}

export interface DonutChartItem {
  name: string
  value: number
  color: string
}

export interface LineChartSeries {
  name: string
  color: string
  values: number[]
}

export interface AnalysisChartCard {
  id: string
  title: string
  kind: AnalysisChartKind
  legend?: DonutChartItem[]
  actions: ChartAction[]
  bars?: BarChartItem[]
  donut?: DonutChartItem[]
  xAxis?: string[]
  lines?: LineChartSeries[]
}
