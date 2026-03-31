import { useEffect, useRef, useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import './App.css'

const TOOLTIP_FADE_MS = 180
const TOOLTIP_HIDE_DELAY_MS = 120
const TOOLTIP_WIDTH = 220
const TOOLTIP_HEIGHT = 88
const TOOLTIP_GAP = 20

type LifelinePoint = {
  stage: string
  stageLines: string[]
  note: string
  energy: number
  accent: string
}

const timelineData: LifelinePoint[] = [
  {
    stage: '小学校',
    stageLines: ['小学校'],
    note: '普通の学生生活',
    energy: 2.7,
    accent: '#88a860',
  },
  {
    stage: '高校',
    stageLines: ['高校'],
    note: '将来を少し考える',
    energy: 4.5,
    accent: '#9cb75d',
  },
  {
    stage: '大学（化学）',
    stageLines: ['大学（化学）'],
    note: '将来に不安',
    energy: 5.3,
    accent: '#8d9161',
  },
  {
    stage: '独学でプログラミング',
    stageLines: ['独学で', 'プログラミング'],
    note: '人生の転機',
    energy: 6.8,
    accent: '#dc8455',
  },
  {
    stage: 'フロントエンドエンジニア就職',
    stageLines: ['フロントエンド', 'エンジニア就職'],
    note: '成長',
    energy: 8.0,
    accent: '#d56c43',
  },
  {
    stage: 'SNSサービス開発',
    stageLines: ['SNSサービス', '開発'],
    note: '大きな成長',
    energy: 9.8,
    accent: '#c75831',
  },
  {
    stage: '日本留学',
    stageLines: ['日本留学'],
    note: '新しい挑戦',
    energy: 9.3,
    accent: '#3c8a95',
  },
  {
    stage: '日本語学校',
    stageLines: ['日本語学校'],
    note: '少し大変',
    energy: 8.9,
    accent: '#4b95a1',
  },
  {
    stage: '京都情報大学院大学',
    stageLines: ['京都情報', '大学院大学'],
    note: 'AIとWeb開発',
    energy: 9.2,
    accent: '#34717c',
  },
  {
    stage: 'アルバイト・業務改善アプリ開発',
    stageLines: ['アルバイト・', '業務改善', 'アプリ開発'],
    note: '技術が役に立つ',
    energy: 10.0,
    accent: '#1095b3',
  },
  {
    stage: '就職活動',
    stageLines: ['就職活動'],
    note: '新しいスタート',
    energy: 10.9,
    accent: '#1f6e5d',
  },
]

type TimelineNodeProps = {
  cx?: number
  cy?: number
  index?: number
  payload?: LifelinePoint
  onHover?: (tooltip: HoveredTooltip) => void
  onLeave?: () => void
}

function TimelineNode({
  cx,
  cy,
  index = 0,
  payload,
  onHover,
  onLeave,
}: TimelineNodeProps) {
  if (cx == null || cy == null || !payload) {
    return null
  }

  const isTop = index % 2 === 0
  const cardWidth = 156
  const titleLineHeight = 18
  const connectorLength = 48
  const cardHeight = 78 + (payload.stageLines.length - 1) * titleLineHeight
  const cardY = isTop ? cy - connectorLength - cardHeight : cy + connectorLength
  const connectorEndY = isTop ? cardY + cardHeight : cardY
  const noteY = cardY + 44 + (payload.stageLines.length - 1) * titleLineHeight
  const noteWidth = Math.max(86, payload.note.length * 12 + 20)

  return (
    <g
      onMouseEnter={() =>
        onHover?.({
          point: payload,
          x: cx,
          y: cy,
          visible: true,
        })
      }
      onMouseLeave={onLeave}
      style={{ cursor: 'pointer' }}
    >
      <circle cx={cx} cy={cy} fill="transparent" r={34} />
      <line
        x1={cx}
        y1={cy + (isTop ? -13 : 13)}
        x2={cx}
        y2={connectorEndY}
        stroke={payload.accent}
        strokeDasharray="5 6"
        strokeOpacity={0.9}
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} fill={payload.accent} fillOpacity={0.18} r={15} />
      <circle
        className="node-anchor"
        cx={cx}
        cy={cy}
        fill={payload.accent}
        r={8}
      />
      <circle cx={cx} cy={connectorEndY} fill={payload.accent} r={4} />
      <rect
        x={cx - cardWidth / 2}
        y={cardY}
        width={cardWidth}
        height={cardHeight}
        rx={24}
        fill="rgba(255, 251, 245, 0.96)"
        filter="url(#cardShadow)"
        stroke={payload.accent}
        strokeOpacity={0.2}
      />
      <text
        className="node-title"
        textAnchor="start"
        x={cx - cardWidth / 2 + 18}
        y={cardY + 28}
      >
        {payload.stageLines.map((line, lineIndex) => (
          <tspan
            key={`${payload.stage}-${lineIndex}`}
            x={cx - cardWidth / 2 + 18}
            dy={lineIndex === 0 ? 0 : titleLineHeight}
          >
            {line}
          </tspan>
        ))}
      </text>
      <rect
        x={cx - noteWidth / 2}
        y={noteY}
        width={noteWidth}
        height={28}
        rx={14}
        fill={`${payload.accent}22`}
      />
      <text className="node-note" textAnchor="middle" x={cx} y={noteY + 19}>
        {payload.note}
      </text>
    </g>
  )
}

type LifelineTooltipProps = {
  point: LifelinePoint | null
  visible: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

type HoveredTooltip = {
  point: LifelinePoint
  x: number
  y: number
  visible: boolean
}

function LifelineTooltip({
  point,
  visible,
  onMouseEnter,
  onMouseLeave,
}: LifelineTooltipProps) {
  if (!point) {
    return null
  }

  return (
    <div
      className={`tooltip-card${visible ? ' is-visible' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className="tooltip-label">Journey Point</p>
      <p className="tooltip-stage">{point.stage}</p>
      <p className="tooltip-note">{point.note}</p>
    </div>
  )
}

function App() {
  const chartCanvasRef = useRef<HTMLDivElement | null>(null)
  const hideTooltipTimeoutRef = useRef<number | null>(null)
  const [hoveredTooltip, setHoveredTooltip] = useState<HoveredTooltip | null>(null)
  const [chartCanvasSize, setChartCanvasSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (!hoveredTooltip || hoveredTooltip.visible) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setHoveredTooltip((current) =>
        current && !current.visible ? null : current,
      )
    }, TOOLTIP_FADE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [hoveredTooltip])

  useEffect(() => {
    return () => {
      if (hideTooltipTimeoutRef.current != null) {
        window.clearTimeout(hideTooltipTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const chartNode = chartCanvasRef.current

    if (!chartNode) {
      return undefined
    }

    const updateCanvasSize = () => {
      setChartCanvasSize({
        width: chartNode.clientWidth,
        height: chartNode.clientHeight,
      })
    }

    updateCanvasSize()

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })

    resizeObserver.observe(chartNode)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const clearTooltipHideTimeout = () => {
    if (hideTooltipTimeoutRef.current != null) {
      window.clearTimeout(hideTooltipTimeoutRef.current)
      hideTooltipTimeoutRef.current = null
    }
  }

  const scheduleTooltipHide = () => {
    clearTooltipHideTimeout()
    hideTooltipTimeoutRef.current = window.setTimeout(() => {
      setHoveredTooltip((current) =>
        current ? { ...current, visible: false } : current,
      )
      hideTooltipTimeoutRef.current = null
    }, TOOLTIP_HIDE_DELAY_MS)
  }

  const handleTooltipLeave = () => {
    scheduleTooltipHide()
  }

  const handleTooltipHover = (tooltip: HoveredTooltip) => {
    clearTooltipHideTimeout()
    setHoveredTooltip(tooltip)
  }

  const handleTooltipMouseEnter = () => {
    clearTooltipHideTimeout()
    setHoveredTooltip((current) =>
      current ? { ...current, visible: true } : current,
    )
  }

  const maxTooltipLeft = Math.max(chartCanvasSize.width - TOOLTIP_WIDTH - 16, 16)
  const chartMarginX =
    chartCanvasSize.width >= 1280 ? 88 : chartCanvasSize.width >= 1120 ? 72 : 56
  const axisPaddingX =
    chartCanvasSize.width >= 1280 ? 18 : chartCanvasSize.width >= 1120 ? 14 : 10

  const tooltipLeft = hoveredTooltip
    ? Math.min(
        Math.max(hoveredTooltip.x + TOOLTIP_GAP, 16),
        maxTooltipLeft,
      )
    : 0

  const tooltipTop = hoveredTooltip
    ? (() => {
        const topPosition = hoveredTooltip.y - TOOLTIP_HEIGHT - TOOLTIP_GAP
        const bottomPosition = hoveredTooltip.y + TOOLTIP_GAP

        if (topPosition >= 16) {
          return topPosition
        }

        return Math.min(
          bottomPosition,
          Math.max(chartCanvasSize.height - TOOLTIP_HEIGHT - 16, 16),
        )
      })()
    : 0

  return (
    <main className="page">
      <div className="shell">
        <section className="chart-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Career Timeline</p>
              <h2 className="section-title">人生の節目をたどる Lifeline</h2>
            </div>
            <p className="section-note">
              迷いがある時期も、技術と出会って伸びる時期も、その後の挑戦につながる流れとして表現しています。
              長いラベルはカード化し、ホバー時には各ステージを確認できます。
            </p>
          </div>

          <div
            className="chart-scroll"
            role="img"
            aria-label="学校生活から就職活動までの人生の節目を表したライフラインチャート"
          >
            <div className="chart-canvas" ref={chartCanvasRef}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={timelineData}
                  margin={{
                    top: 156,
                    right: chartMarginX,
                    bottom: 122,
                    left: chartMarginX,
                  }}
                >
                  <defs>
                    <linearGradient id="lifelineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#88a860" />
                      <stop offset="40%" stopColor="#d27c4b" />
                      <stop offset="75%" stopColor="#338997" />
                      <stop offset="100%" stopColor="#1f6e5d" />
                    </linearGradient>
                    <linearGradient id="lifelineArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(210, 124, 75, 0.28)" />
                      <stop offset="100%" stopColor="rgba(210, 124, 75, 0)" />
                    </linearGradient>
                    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="160%">
                      <feDropShadow
                        dx="0"
                        dy="18"
                        stdDeviation="16"
                        floodColor="#6b4b36"
                        floodOpacity="0.14"
                      />
                    </filter>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(98, 76, 53, 0.16)"
                    strokeDasharray="5 9"
                  />
                  <XAxis
                    dataKey="stage"
                    hide
                    padding={{ left: axisPaddingX, right: axisPaddingX }}
                  />
                  <YAxis hide domain={[0, 10]} />
                  <Area
                    dataKey="energy"
                    fill="url(#lifelineArea)"
                    fillOpacity={1}
                    stroke="none"
                    type="monotone"
                  />
                  <Line
                    dataKey="energy"
                    dot={(props) => (
                      <TimelineNode
                        {...props}
                        onHover={handleTooltipHover}
                        onLeave={handleTooltipLeave}
                      />
                    )}
                    stroke="url(#lifelineStroke)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={5}
                    type="monotone"
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div
                className="chart-tooltip-layer"
                style={{
                  left: `${tooltipLeft}px`,
                  top: `${tooltipTop}px`,
                }}
              >
                <LifelineTooltip
                  point={hoveredTooltip?.point ?? null}
                  visible={hoveredTooltip?.visible ?? false}
                  onMouseEnter={handleTooltipMouseEnter}
                  onMouseLeave={handleTooltipLeave}
                />
              </div>
            </div>
          </div>

          <div className="chart-caption">
            <span>Left to right: 学び / 技術との出会い / 日本での挑戦 / 新しいスタート</span>
            <span>モバイルでは横スクロールで全体を確認できます。</span>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
