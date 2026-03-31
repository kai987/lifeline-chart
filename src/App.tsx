import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { ContactShadows, Html, Line as DreiLine, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

const TOOLTIP_FADE_MS = 180
const TOOLTIP_HIDE_DELAY_MS = 320

type ViewportPreset = 'mobile' | 'tablet' | 'desktop'

type LifelinePoint = {
  stage: string
  stageLines: string[]
  note: string
  energy: number
  accent: string
}

type ScenePoint = LifelinePoint & {
  connectorEnd: [number, number, number]
  isTop: boolean
  labelPosition: [number, number, number]
  position: [number, number, number]
  tooltipPosition: [number, number, number]
}

type HoveredTooltip = {
  point: ScenePoint
  visible: boolean
}

type LayoutConfig = {
  cardDistanceFactor: number
  cameraPosition: [number, number, number]
  edgeShift: number
  labelBottomOffset: number
  labelBottomZOffset: number
  labelTopOffset: number
  labelTopZOffset: number
  maxDistance: number
  minDistance: number
  orbitTarget: [number, number, number]
  tooltipDirection: number
  tooltipDistanceFactor: number
  tooltipYOffset: number
  tooltipZOffset: number
  xSpacing: number
  yScale: number
  zBase: number
  zDrift: number
  zWave: number
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

const VIEWPORT_LAYOUTS: Record<ViewportPreset, LayoutConfig> = {
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
    tooltipDistanceFactor: 11,
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
    tooltipDistanceFactor: 12,
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
    tooltipDistanceFactor: 13.5,
    tooltipYOffset: 1.72,
    tooltipZOffset: 0.62,
    xSpacing: 3.95,
    yScale: 0.58,
    zBase: -0.12,
    zDrift: 0.04,
    zWave: 0.42,
  },
}

function getViewportPreset(width: number): ViewportPreset {
  if (width < 768) {
    return 'mobile'
  }

  if (width < 1180) {
    return 'tablet'
  }

  return 'desktop'
}

function useViewportPreset() {
  const [viewportPreset, setViewportPreset] = useState<ViewportPreset>(() =>
    typeof window === 'undefined' ? 'desktop' : getViewportPreset(window.innerWidth),
  )

  useEffect(() => {
    const handleResize = () => {
      setViewportPreset(getViewportPreset(window.innerWidth))
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return viewportPreset
}

function buildScenePoints(data: LifelinePoint[], layout: LayoutConfig): ScenePoint[] {
  const center = (data.length - 1) / 2

  return data.map((point, index) => {
    const x = (index - center) * layout.xSpacing
    const y = (point.energy - 6.5) * layout.yScale
    const z = Math.sin(index * 0.72) * layout.zWave + (index - center) * layout.zDrift + layout.zBase
    const isTop = index % 2 === 0
    const edgeShift = index === 0 ? layout.edgeShift : index === data.length - 1 ? -layout.edgeShift : 0
    const labelPosition: [number, number, number] = [
      x + edgeShift,
      y + (isTop ? layout.labelTopOffset : layout.labelBottomOffset),
      z + (isTop ? layout.labelTopZOffset : layout.labelBottomZOffset),
    ]
    const connectorEnd: [number, number, number] = [
      x,
      labelPosition[1],
      labelPosition[2],
    ]
    const tooltipDirection = index > data.length - 3 ? -layout.tooltipDirection : layout.tooltipDirection

    return {
      ...point,
      connectorEnd,
      isTop,
      labelPosition,
      position: [x, y, z],
      tooltipPosition: [x + tooltipDirection, y + layout.tooltipYOffset, z + layout.tooltipZOffset],
    }
  })
}

type LifelineTooltipProps = {
  point: ScenePoint | null
  viewportPreset: ViewportPreset
  visible: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

function LifelineTooltip({
  point,
  viewportPreset,
  visible,
  onMouseEnter,
  onMouseLeave,
}: LifelineTooltipProps) {
  if (!point) {
    return null
  }

  return (
    <div
      className={`tooltip-card tooltip-card--${viewportPreset}${visible ? ' is-visible' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className="tooltip-label">Journey Point</p>
      <p className="tooltip-stage">{point.stage}</p>
      <p className="tooltip-note">{point.note}</p>
    </div>
  )
}

function StageCard({ point, viewportPreset }: { point: ScenePoint; viewportPreset: ViewportPreset }) {
  return (
    <Html
      center
      distanceFactor={VIEWPORT_LAYOUTS[viewportPreset].cardDistanceFactor}
      occlude={false}
      position={point.labelPosition}
      style={{ pointerEvents: 'none' }}
    >
      <div className={`stage-card stage-card--${viewportPreset}${point.isTop ? ' is-top' : ' is-bottom'}`}>
        <div className="stage-card-title">
          {point.stageLines.map((line, lineIndex) => (
            <span key={`${point.stage}-${lineIndex}`} className="stage-card-line">
              {line}
            </span>
          ))}
        </div>
        <div className="stage-card-note">{point.note}</div>
      </div>
    </Html>
  )
}

type SceneNodeProps = {
  onLeave: () => void
  onHover: (point: ScenePoint) => void
  point: ScenePoint
  viewportPreset: ViewportPreset
}

function SceneNode({ onLeave, onHover, point, viewportPreset }: SceneNodeProps) {
  const accentColor = useMemo(() => new THREE.Color(point.accent), [point.accent])

  const handleEnter = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    document.body.style.cursor = 'pointer'
    onHover(point)
  }

  const handleLeave = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    document.body.style.cursor = ''
    onLeave()
  }

  return (
    <group>
      <DreiLine
        color={point.accent}
        dashScale={16}
        dashSize={0.22}
        dashed
        gapSize={0.16}
        lineWidth={1.05}
        opacity={0.72}
        points={[point.position, point.connectorEnd]}
        transparent
      />

      <mesh castShadow position={point.position}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.38}
          metalness={0.1}
          roughness={0.24}
        />
      </mesh>

      <mesh castShadow position={[point.position[0], point.position[1], point.position[2]]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#fff9f2" emissive="#fff4e8" emissiveIntensity={0.3} roughness={0.16} />
      </mesh>

      <mesh position={[point.position[0], point.position[1], point.position[2]]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.48, 0.04, 20, 48]} />
        <meshStandardMaterial color="#eef7fb" emissive="#ffffff" emissiveIntensity={0.12} opacity={0.78} roughness={0.24} transparent />
      </mesh>

      <mesh
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        position={point.position}
      >
        <sphereGeometry args={[1.18, 18, 18]} />
        <meshBasicMaterial depthWrite={false} opacity={0} transparent />
      </mesh>

      <StageCard point={point} viewportPreset={viewportPreset} />
    </group>
  )
}

type LifelineSceneProps = {
  hoveredTooltip: HoveredTooltip | null
  layout: LayoutConfig
  onLeave: () => void
  onTooltipMouseEnter: () => void
  onTooltipMouseLeave: () => void
  onHover: (point: ScenePoint) => void
  points: ScenePoint[]
  viewportPreset: ViewportPreset
}

function LifelineScene({
  hoveredTooltip,
  layout,
  onLeave,
  onTooltipMouseEnter,
  onTooltipMouseLeave,
  onHover,
  points,
  viewportPreset,
}: LifelineSceneProps) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        points.map((point) => new THREE.Vector3(...point.position)),
        false,
        'centripetal',
      ),
    [points],
  )

  const floorPath = useMemo(
    () =>
      curve.getPoints(260).map((point) => [
        point.x,
        -5.4,
        point.z - 2.8,
      ] as [number, number, number]),
    [curve],
  )

  return (
    <>
      <PerspectiveCamera fov={34} makeDefault position={layout.cameraPosition} />
      <fog attach="fog" args={['#f3eadf', 22, 56]} />
      <ambientLight color="#fff3e6" intensity={1.35} />
      <hemisphereLight color="#fff8f0" groundColor="#cfbea9" intensity={0.92} />
      <directionalLight
        castShadow
        color="#fff0df"
        intensity={2.4}
        position={[10, 18, 14]}
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
      />
      <pointLight color="#ffb77a" intensity={28} position={[-16, 5, 11]} />
      <pointLight color="#75d4f2" intensity={22} position={[14, 6, 12]} />

      <group position={[0, -0.35, 0]}>
        <mesh
          position={[0, -6.15, -2.4]}
          receiveShadow
          rotation={[-Math.PI / 2.18, 0, 0]}
        >
          <planeGeometry args={[62, 24]} />
          <meshStandardMaterial color="#f4e6d3" metalness={0.03} roughness={0.96} />
        </mesh>

        <mesh
          position={[0, -6.45, -4.3]}
          receiveShadow
          rotation={[-Math.PI / 2.18, 0, 0]}
        >
          <planeGeometry args={[56, 18]} />
          <meshStandardMaterial color="#d5c1aa" metalness={0.02} opacity={0.42} roughness={1} transparent />
        </mesh>

        <DreiLine
          color="#c99a70"
          lineWidth={0.9}
          opacity={0.22}
          points={floorPath}
          transparent
        />

        <mesh castShadow>
          <tubeGeometry args={[curve, 420, 0.085, 28, false]} />
          <meshStandardMaterial color="#f7efe5" emissive="#fff7ee" emissiveIntensity={0.12} metalness={0.12} opacity={0.66} roughness={0.26} transparent />
        </mesh>

        <mesh castShadow>
          <tubeGeometry args={[curve, 420, 0.06, 28, false]} />
          <meshStandardMaterial color="#4f5d54" emissive="#b7fff6" emissiveIntensity={0.18} metalness={0.14} roughness={0.24} />
        </mesh>

        {points.map((point) => (
          <SceneNode
            key={point.stage}
            onHover={onHover}
            onLeave={onLeave}
            point={point}
            viewportPreset={viewportPreset}
          />
        ))}
      </group>

      <ContactShadows
        blur={2.8}
        far={14}
        opacity={0.35}
        position={[0, -6.85, 0]}
        resolution={1024}
        scale={48}
      />

      {hoveredTooltip?.point ? (
        <Html
          distanceFactor={layout.tooltipDistanceFactor}
          occlude={false}
          position={hoveredTooltip.point.tooltipPosition}
        >
          <div className="scene-tooltip-anchor">
            <LifelineTooltip
              point={hoveredTooltip.point}
              viewportPreset={viewportPreset}
              visible={hoveredTooltip.visible}
              onMouseEnter={onTooltipMouseEnter}
              onMouseLeave={onTooltipMouseLeave}
            />
          </div>
        </Html>
      ) : null}

      <OrbitControls
        enableDamping
        enablePan={false}
        enableZoom
        maxAzimuthAngle={0.5}
        maxDistance={layout.maxDistance}
        maxPolarAngle={1.72}
        minAzimuthAngle={-0.5}
        minDistance={layout.minDistance}
        minPolarAngle={1.15}
        rotateSpeed={0.5}
        target={layout.orbitTarget}
        onEnd={() => {
          document.body.style.cursor = ''
        }}
        onStart={() => {
          document.body.style.cursor = 'grabbing'
        }}
      />
    </>
  )
}

function App() {
  const hideTooltipTimeoutRef = useRef<number | null>(null)
  const isTooltipHoveredRef = useRef(false)
  const viewportPreset = useViewportPreset()
  const [hoveredTooltip, setHoveredTooltip] = useState<HoveredTooltip | null>(null)
  const layout = VIEWPORT_LAYOUTS[viewportPreset]
  const scenePoints = useMemo(() => buildScenePoints(timelineData, layout), [layout])

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
      document.body.style.cursor = ''
      isTooltipHoveredRef.current = false
      if (hideTooltipTimeoutRef.current != null) {
        window.clearTimeout(hideTooltipTimeoutRef.current)
      }
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
      if (isTooltipHoveredRef.current) {
        hideTooltipTimeoutRef.current = null
        return
      }

      setHoveredTooltip((current) =>
        current ? { ...current, visible: false } : current,
      )
      hideTooltipTimeoutRef.current = null
      document.body.style.cursor = ''
    }, TOOLTIP_HIDE_DELAY_MS)
  }

  const handleTooltipHover = (point: ScenePoint) => {
    clearTooltipHideTimeout()
    isTooltipHoveredRef.current = false
    setHoveredTooltip({
      point,
      visible: true,
    })
  }

  const handleTooltipMouseEnter = () => {
    isTooltipHoveredRef.current = true
    clearTooltipHideTimeout()
    setHoveredTooltip((current) =>
      current ? { ...current, visible: true } : current,
    )
  }

  const handleTooltipMouseLeave = () => {
    isTooltipHoveredRef.current = false
    scheduleTooltipHide()
  }

  return (
    <main className={`page page--${viewportPreset}`}>
      <div className="shell">
        <section className="chart-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Career Timeline</p>
              <h2 className="section-title">人生の節目をたどる Lifeline</h2>
            </div>
            <p className="section-note">
              迷いがある時期も、技術と出会って伸びる時期も、その後の挑戦につながる流れとして表現しています。
              今回は本物の3Dシーンとして再構成し、奥行きのある生命線として見せています。
            </p>
          </div>

          <div
            className={`chart-scroll chart-scroll--${viewportPreset}`}
            role="img"
            aria-label="学校生活から就職活動までの人生の節目を3Dで表現したライフラインチャート"
          >
            <div className={`chart-canvas chart-canvas--${viewportPreset}`}>
              <Canvas dpr={[1, viewportPreset === 'mobile' ? 1.25 : viewportPreset === 'tablet' ? 1.5 : 1.75]} shadows>
                <LifelineScene
                  hoveredTooltip={hoveredTooltip}
                  layout={layout}
                  onHover={handleTooltipHover}
                  onLeave={scheduleTooltipHide}
                  onTooltipMouseEnter={handleTooltipMouseEnter}
                  onTooltipMouseLeave={handleTooltipMouseLeave}
                  points={scenePoints}
                  viewportPreset={viewportPreset}
                />
              </Canvas>
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
