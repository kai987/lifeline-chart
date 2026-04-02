import { useMemo } from 'react'
import { LifelineCanvas } from '@/components/LifelineCanvas'
import { useSceneTooltip } from '@/hooks/useSceneTooltip'
import { useViewportPreset } from '@/hooks/useViewportPreset'
import { buildScenePoints, timelineData, VIEWPORT_LAYOUTS } from '@/lib/lifeline'
import '@/App.css'

const CHART_ARIA_LABEL = '学校生活から就職活動までの人生の節目を3Dで表現したライフラインチャート'

function App() {
  const viewportPreset = useViewportPreset()
  const layout = VIEWPORT_LAYOUTS[viewportPreset]
  const scenePoints = useMemo(() => buildScenePoints(timelineData, layout), [layout])
  const {
    hoveredTooltip,
    handlePointHover,
    handleTooltipMouseEnter,
    handleTooltipMouseLeave,
    scheduleTooltipHide,
  } = useSceneTooltip()

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
            aria-label={CHART_ARIA_LABEL}
          >
            <LifelineCanvas
              hoveredTooltip={hoveredTooltip}
              layout={layout}
              onHover={handlePointHover}
              onLeave={scheduleTooltipHide}
              onTooltipMouseEnter={handleTooltipMouseEnter}
              onTooltipMouseLeave={handleTooltipMouseLeave}
              points={scenePoints}
              viewportPreset={viewportPreset}
            />
          </div>

          <div className="chart-caption">
            <span>Left to right: 学び / 技術との出会い / 日本での挑戦 / 新しいスタート</span>
            <span>ドラッグで左右上下に移動し、ピンチやホイールで拡大縮小できます。マウスの右ボタンを押したままドラッグすると、視点を変えられます。</span>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
