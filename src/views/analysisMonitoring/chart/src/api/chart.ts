import type { AnalysisChartCard } from '../types/chart'

export const getAnalysisChartCards = async (): Promise<AnalysisChartCard[]> => [
  {
    id: 'person-plus-ranking',
    title: '人员分析-加分排名',
    kind: 'bar',
    actions: [{ type: 'setting' }, { type: 'download' }],
    bars: [
      { name: '王弘炜', value: 11, label: '11-王弘炜-5669-神经科' },
      { name: '安蓓', value: 10, label: '10-安蓓-3821-内科学系' },
      { name: '梁红艳', value: 1, label: '1-梁红艳-3110-整形美容外科' }
    ]
  },
  {
    id: 'department-plus-ranking',
    title: '科室分析-加分排名',
    kind: 'bar',
    actions: [{ type: 'setting' }, { type: 'download' }],
    bars: [
      { name: '神经科【精神科】', value: 11, label: '本院-神经科【精神科】：11' },
      { name: '内科学系', value: 10, label: '本院-内科学系：10' },
      { name: '外科学系', value: 1, label: '本院-外科学系：1' }
    ]
  },
  {
    id: 'management-participation',
    title: '管理参与度分析',
    kind: 'donut',
    actions: [{ type: 'setting' }, { type: 'download' }],
    legend: [
      { name: '党委办公室 - 次数：2', value: 2, color: '#1e90ff' },
      { name: '神经科 - 次数：2', value: 2, color: '#f5222d' }
    ],
    donut: [
      { name: '党委办公室', value: 2, color: '#1e90ff' },
      { name: '神经科', value: 2, color: '#f5222d' }
    ]
  },
  {
    id: 'behavior-analysis',
    title: '行为分析',
    kind: 'donut',
    actions: [{ type: 'setting' }, { type: 'download' }],
    legend: [
      { name: '加分 - 次数：1', value: 1, color: '#1e90ff' },
      { name: '优秀行为 - 次数：3', value: 3, color: '#f5222d' }
    ],
    donut: [
      { name: '加分', value: 1, color: '#1e90ff' },
      { name: '优秀行为', value: 3, color: '#f5222d' }
    ]
  },
  {
    id: 'plus-minus-trend',
    title: '加减分人次趋势分析',
    kind: 'line',
    actions: [{ type: 'setting' }, { type: 'download' }],
    legend: [{ name: '本年加分人次', value: 0, color: '#1e90ff' }],
    xAxis: ['0', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019'],
    lines: [{ name: '本年加分人次', color: '#1e90ff', values: [0, 4, 896, 2, 2, 0, 0, 0, 0] }]
  },
  {
    id: 'plus-minus-behavior-trend',
    title: '加减分行为趋势分析',
    kind: 'line',
    actions: [{ type: 'setting' }, { type: 'download' }],
    legend: [
      { name: '患者表扬', value: 0, color: '#1e90ff' },
      { name: '加分', value: 0, color: '#f5222d' },
      { name: '廉洁执业', value: 0, color: '#52c41a' },
      { name: '荣誉表彰', value: 0, color: '#faad14' },
      { name: '优秀行为', value: 0, color: '#2f80ed' }
    ],
    xAxis: ['0', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019'],
    lines: [
      { name: '患者表扬', color: '#1e90ff', values: [0, 3, 433, 0, 0, 0, 0, 0, 0] },
      { name: '加分', color: '#f5222d', values: [0, 0, 2, 0, 0, 0, 0, 0, 0] },
      { name: '廉洁执业', color: '#52c41a', values: [0, 0, 13, 0, 0, 0, 0, 0, 0] },
      { name: '荣誉表彰', color: '#faad14', values: [0, 0, 2, 0, 0, 0, 0, 0, 0] },
      { name: '优秀行为', color: '#2f80ed', values: [0, 0, 13, 0, 0, 0, 0, 0, 0] }
    ]
  },
  {
    id: 'management-participation-trend',
    title: '管理参与度趋势分析',
    kind: 'line',
    actions: [{ type: 'setting' }, { type: 'download' }],
    legend: [
      { name: '党委办公室', value: 0, color: '#1e90ff' },
      { name: '纪委监察室', value: 0, color: '#f5222d' },
      { name: '科室申报', value: 0, color: '#52c41a' },
      { name: '门诊部办公室', value: 0, color: '#faad14' },
      { name: '神经科', value: 0, color: '#8c8c8c' },
      { name: '心血管内科', value: 0, color: '#722ed1' }
    ],
    xAxis: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'],
    lines: [
      { name: '党委办公室', color: '#1e90ff', values: [0, 425, 0, 4, 0, 0, 0, 0, 0, 0] },
      { name: '心血管内科', color: '#722ed1', values: [0, 468, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: '神经科', color: '#8c8c8c', values: [0, 9, 0, 0, 0, 0, 0, 0, 0, 0] }
    ]
  }
]
