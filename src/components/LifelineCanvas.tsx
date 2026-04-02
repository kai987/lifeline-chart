import { useMemo, useRef, type RefObject } from 'react'
import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { ContactShadows, Html, Line as DreiLine, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import {
  getCanvasDpr,
  type HoveredTooltip,
  type LayoutConfig,
  type ScenePoint,
  type Vector3Tuple,
  type ViewportPreset,
} from '@/lib/lifeline'

type LifelineCanvasProps = {
  hoveredTooltip: HoveredTooltip | null
  layout: LayoutConfig
  onHover: (point: ScenePoint) => void
  onLeave: () => void
  onTooltipMouseEnter: () => void
  onTooltipMouseLeave: () => void
  points: ScenePoint[]
  viewportPreset: ViewportPreset
}

type LifelineTooltipProps = {
  point: ScenePoint | null
  viewportPreset: ViewportPreset
  visible: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

type StageCardProps = {
  distanceFactor: number
  point: ScenePoint
  viewportPreset: ViewportPreset
}

type SceneNodeProps = {
  cardDistanceFactor: number
  onLeave: () => void
  onHover: (point: ScenePoint) => void
  point: ScenePoint
  viewportPreset: ViewportPreset
}

type LifelineSceneProps = LifelineCanvasProps & {
  tooltipPortal: RefObject<HTMLDivElement | null>
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
      <p className="tooltip-label">人生の節目</p>
      <p className="tooltip-stage">{point.stage}</p>
      <p className="tooltip-note">{point.tooltipNote}</p>
    </div>
  )
}

function StageCard({ distanceFactor, point, viewportPreset }: StageCardProps) {
  return (
    <Html
      center
      distanceFactor={distanceFactor}
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
        <div className="stage-card-note">{point.cardNote}</div>
      </div>
    </Html>
  )
}

function SceneNode({ cardDistanceFactor, onLeave, onHover, point, viewportPreset }: SceneNodeProps) {
  const accentColor = useMemo(() => new THREE.Color(point.accent), [point.accent])
  const [x, y, z] = point.position

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

      <mesh castShadow position={[x, y, z]}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.38}
          metalness={0.1}
          roughness={0.24}
        />
      </mesh>

      <mesh castShadow position={[x, y, z]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#fff9f2" emissive="#fff4e8" emissiveIntensity={0.3} roughness={0.16} />
      </mesh>

      <mesh position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.48, 0.04, 20, 48]} />
        <meshStandardMaterial color="#eef7fb" emissive="#ffffff" emissiveIntensity={0.12} opacity={0.78} roughness={0.24} transparent />
      </mesh>

      <mesh onPointerEnter={handleEnter} onPointerLeave={handleLeave} position={[x, y, z]}>
        <sphereGeometry args={[1.18, 18, 18]} />
        <meshBasicMaterial depthWrite={false} opacity={0} transparent />
      </mesh>

      <StageCard
        distanceFactor={cardDistanceFactor}
        point={point}
        viewportPreset={viewportPreset}
      />
    </group>
  )
}

function SceneEnvironment() {
  return (
    <>
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
    </>
  )
}

function SceneFloor({ floorPath }: { floorPath: Vector3Tuple[] }) {
  return (
    <>
      <mesh position={[0, -6.15, -2.4]} receiveShadow rotation={[-Math.PI / 2.18, 0, 0]}>
        <planeGeometry args={[62, 24]} />
        <meshStandardMaterial color="#f4e6d3" metalness={0.03} roughness={0.96} />
      </mesh>

      <mesh position={[0, -6.45, -4.3]} receiveShadow rotation={[-Math.PI / 2.18, 0, 0]}>
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
    </>
  )
}

function LifelineCurve({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  return (
    <>
      <mesh castShadow>
        <tubeGeometry args={[curve, 420, 0.085, 28, false]} />
        <meshStandardMaterial color="#f7efe5" emissive="#fff7ee" emissiveIntensity={0.12} metalness={0.12} opacity={0.66} roughness={0.26} transparent />
      </mesh>

      <mesh castShadow>
        <tubeGeometry args={[curve, 420, 0.06, 28, false]} />
        <meshStandardMaterial color="#4f5d54" emissive="#b7fff6" emissiveIntensity={0.18} metalness={0.14} roughness={0.24} />
      </mesh>
    </>
  )
}

function SceneTooltip({
  hoveredTooltip,
  onTooltipMouseEnter,
  onTooltipMouseLeave,
  portal,
  viewportPreset,
}: {
  hoveredTooltip: HoveredTooltip | null
  onTooltipMouseEnter: () => void
  onTooltipMouseLeave: () => void
  portal: RefObject<HTMLDivElement | null>
  viewportPreset: ViewportPreset
}) {
  if (!hoveredTooltip?.point) {
    return null
  }

  return (
    <Html
      occlude={false}
      position={hoveredTooltip.point.tooltipPosition}
      portal={portal as RefObject<HTMLElement>}
      zIndexRange={[2147483647, 2147483647]}
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
  )
}

function LifelineScene({
  hoveredTooltip,
  layout,
  onHover,
  onLeave,
  onTooltipMouseEnter,
  onTooltipMouseLeave,
  points,
  tooltipPortal,
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
      curve.getPoints(260).map((point) => [point.x, -5.4, point.z - 2.8] as Vector3Tuple),
    [curve],
  )

  return (
    <>
      <PerspectiveCamera fov={34} makeDefault position={layout.cameraPosition} />
      <SceneEnvironment />

      <group position={[0, -0.35, 0]}>
        <SceneFloor floorPath={floorPath} />
        <LifelineCurve curve={curve} />

        {points.map((point) => (
          <SceneNode
            key={point.stage}
            cardDistanceFactor={layout.cardDistanceFactor}
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

      <SceneTooltip
        hoveredTooltip={hoveredTooltip}
        onTooltipMouseEnter={onTooltipMouseEnter}
        onTooltipMouseLeave={onTooltipMouseLeave}
        portal={tooltipPortal}
        viewportPreset={viewportPreset}
      />

      <OrbitControls
        enableDamping
        enablePan
        enableZoom
        maxAzimuthAngle={0.5}
        maxDistance={layout.maxDistance}
        maxPolarAngle={1.72}
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
        minAzimuthAngle={-0.5}
        minDistance={layout.minDistance}
        minPolarAngle={1.15}
        panSpeed={0.85}
        rotateSpeed={0.5}
        screenSpacePanning
        target={layout.orbitTarget}
        touches={{
          ONE: THREE.TOUCH.PAN,
          TWO: THREE.TOUCH.DOLLY_ROTATE,
        }}
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

export function LifelineCanvas(props: LifelineCanvasProps) {
  const { viewportPreset } = props
  const tooltipPortalRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className={`chart-canvas chart-canvas--${viewportPreset}`}>
      <Canvas dpr={getCanvasDpr(viewportPreset)} shadows>
        <LifelineScene {...props} tooltipPortal={tooltipPortalRef} />
      </Canvas>
      <div ref={tooltipPortalRef} className="chart-tooltip-layer" />
    </div>
  )
}
