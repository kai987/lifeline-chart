export const TOOLTIP_FADE_MS = 180
export const TOOLTIP_HIDE_DELAY_MS = 320

export type ViewportPreset = 'mobile' | 'tablet' | 'desktop'

export type Vector3Tuple = [number, number, number]

export type LifelinePoint = {
  stage: string
  stageLines: string[]
  cardNote: string
  tooltipNote: string
  energy: number
  accent: string
}

export type ScenePoint = LifelinePoint & {
  connectorEnd: Vector3Tuple
  isTop: boolean
  labelPosition: Vector3Tuple
  position: Vector3Tuple
  tooltipPosition: Vector3Tuple
}

export type HoveredTooltip = {
  point: ScenePoint
  visible: boolean
}

export type LayoutConfig = {
  cardDistanceFactor: number
  cameraPosition: Vector3Tuple
  edgeShift: number
  labelBottomOffset: number
  labelBottomZOffset: number
  labelTopOffset: number
  labelTopZOffset: number
  maxDistance: number
  minDistance: number
  orbitTarget: Vector3Tuple
  tooltipDirection: number
  tooltipYOffset: number
  tooltipZOffset: number
  xSpacing: number
  yScale: number
  zBase: number
  zDrift: number
  zWave: number
}

export const timelineData: LifelinePoint[] = [
  {
    stage: '小学校',
    stageLines: ['小学校'],
    cardNote: '普通の学生生活',
    tooltipNote: '普通の学生生活を送り、毎日楽しく過ごしていました',
    energy: 2.7,
    accent: '#88a860',
  },
  {
    stage: '高校',
    stageLines: ['高校'],
    cardNote: '将来を少し考える',
    tooltipNote: '将来について少しずつ考え始めた時期でした',
    energy: 4.5,
    accent: '#9cb75d',
  },
  {
    stage: '大学（化学）',
    stageLines: ['大学（化学）'],
    cardNote: '将来に不安',
    tooltipNote: '化学を専攻していましたが、将来について不安を感じ始めました',
    energy: 5.3,
    accent: '#8d9161',
  },
  {
    stage: '独学でプログラミング',
    stageLines: ['独学で', 'プログラミング'],
    cardNote: '人生の転機',
    tooltipNote: '独学でプログラミングを始め、人生の方向が大きく変わりました',
    energy: 6.8,
    accent: '#dc8455',
  },
  {
    stage: 'フロントエンドエンジニア就職',
    stageLines: ['フロントエンド', 'エンジニア就職'],
    cardNote: '成長',
    tooltipNote: 'フロントエンドエンジニアとして就職し、実務開発を学び始めました',
    energy: 8.0,
    accent: '#d56c43',
  },
  {
    stage: 'SNSサービス開発',
    stageLines: ['SNSサービス', '開発'],
    cardNote: '大きな成長',
    tooltipNote: '多くのユーザーが使うSNSサービス開発に携わり、大きく成長しました',
    energy: 9.8,
    accent: '#c75831',
  },
  {
    stage: '日本留学',
    stageLines: ['日本留学'],
    cardNote: '新しい挑戦',
    tooltipNote: '新しい環境に挑戦するため、日本への留学を決意しました',
    energy: 9.3,
    accent: '#3c8a95',
  },
  {
    stage: '日本語学校',
    stageLines: ['日本語学校'],
    cardNote: '少し大変',
    tooltipNote: '日本語の勉強もITの試験も難しいですが、少しずつ頑張っています',
    energy: 8.9,
    accent: '#4b95a1',
  },
  {
    stage: '京都情報大学院大学',
    stageLines: ['京都情報', '大学院大学'],
    cardNote: 'AIとWeb開発',
    tooltipNote: 'AIとWeb開発を学びながら、自分の技術分野を広げています',
    energy: 9.2,
    accent: '#34717c',
  },
  {
    stage: 'アルバイト・業務改善アプリ開発',
    stageLines: ['アルバイト・', '業務改善', 'アプリ開発'],
    cardNote: '技術が役に立つ',
    tooltipNote: 'アルバイト先の業務改善アプリを開発し、技術が役に立つことを実感しました',
    energy: 10.0,
    accent: '#1095b3',
  },
  {
    stage: '就職活動',
    stageLines: ['就職活動'],
    cardNote: '新しいスタート',
    tooltipNote: '日本でエンジニアとして働くため、就職活動を始めました',
    energy: 10.9,
    accent: '#1f6e5d',
  },
]

export const VIEWPORT_LAYOUTS: Record<ViewportPreset, LayoutConfig> = {
  desktop: {
    cardDistanceFactor: 11,
    cameraPosition: [0, 2.1, 32.5],
    edgeShift: 0.95,
    labelBottomOffset: -6.8,
    labelBottomZOffset: 0.38,
    labelTopOffset: 6.6,
    labelTopZOffset: -0.48,
    maxDistance: 44,
    minDistance: 24,
    orbitTarget: [0, 0.7, -0.6],
    tooltipDirection: 2.35,
    tooltipYOffset: 2.25,
    tooltipZOffset: 0.92,
    xSpacing: 4.9,
    yScale: 0.66,
    zBase: -0.24,
    zDrift: 0.06,
    zWave: 0.72,
  },
  tablet: {
    cardDistanceFactor: 12,
    cameraPosition: [0, 1.9, 30.5],
    edgeShift: 0.72,
    labelBottomOffset: -5.8,
    labelBottomZOffset: 0.28,
    labelTopOffset: 5.6,
    labelTopZOffset: -0.34,
    maxDistance: 40,
    minDistance: 22,
    orbitTarget: [0, 0.55, -0.45],
    tooltipDirection: 2,
    tooltipYOffset: 2,
    tooltipZOffset: 0.78,
    xSpacing: 4.35,
    yScale: 0.62,
    zBase: -0.18,
    zDrift: 0.05,
    zWave: 0.58,
  },
  mobile: {
    cardDistanceFactor: 13.5,
    cameraPosition: [0, 1.55, 27.2],
    edgeShift: 0.52,
    labelBottomOffset: -4.9,
    labelBottomZOffset: 0.18,
    labelTopOffset: 4.8,
    labelTopZOffset: -0.24,
    maxDistance: 35,
    minDistance: 18,
    orbitTarget: [0, 0.4, -0.25],
    tooltipDirection: 1.72,
    tooltipYOffset: 1.72,
    tooltipZOffset: 0.62,
    xSpacing: 3.95,
    yScale: 0.58,
    zBase: -0.12,
    zDrift: 0.04,
    zWave: 0.42,
  },
}

export function getViewportPreset(width: number): ViewportPreset {
  if (width < 768) {
    return 'mobile'
  }

  if (width < 1180) {
    return 'tablet'
  }

  return 'desktop'
}

export function getCanvasDpr(viewportPreset: ViewportPreset): [number, number] {
  if (viewportPreset === 'mobile') {
    return [1, 1.25]
  }

  if (viewportPreset === 'tablet') {
    return [1, 1.5]
  }

  return [1, 1.75]
}

export function buildScenePoints(data: LifelinePoint[], layout: LayoutConfig): ScenePoint[] {
  const center = (data.length - 1) / 2

  return data.map((point, index) => {
    const x = (index - center) * layout.xSpacing
    const y = (point.energy - 6.5) * layout.yScale
    const z = Math.sin(index * 0.72) * layout.zWave + (index - center) * layout.zDrift + layout.zBase
    const isTop = index % 2 === 0
    const edgeShift = index === 0 ? layout.edgeShift : index === data.length - 1 ? -layout.edgeShift : 0
    const labelPosition: Vector3Tuple = [
      x + edgeShift,
      y + (isTop ? layout.labelTopOffset : layout.labelBottomOffset),
      z + (isTop ? layout.labelTopZOffset : layout.labelBottomZOffset),
    ]
    const tooltipDirection = index > data.length - 3 ? -layout.tooltipDirection : layout.tooltipDirection

    return {
      ...point,
      connectorEnd: [x, labelPosition[1], labelPosition[2]],
      isTop,
      labelPosition,
      position: [x, y, z],
      tooltipPosition: [x + tooltipDirection, y + layout.tooltipYOffset, z + layout.tooltipZOffset],
    }
  })
}
