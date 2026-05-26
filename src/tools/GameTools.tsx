import { useMemo, useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import { copyText } from '../utils/clipboard'

const solvedTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0]
const shuffledTiles = [1, 2, 3, 4, 0, 6, 7, 5, 8]

export function MathPracticeGameTool() {
  const [question, setQuestion] = useState({ a: 7, b: 8 })
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [feedback, setFeedback] = useState('Solve the multiplication question and submit your answer.')

  const nextQuestion = () => {
    setQuestion((current) => ({
      a: (current.a % 12) + 1,
      b: ((current.b + 3) % 12) + 1,
    }))
    setAnswer('')
    setRound((value) => value + 1)
  }

  const submit = () => {
    const expected = question.a * question.b
    if (Number(answer) === expected) {
      setScore((value) => value + 1)
      setFeedback(`Correct. ${question.a} x ${question.b} = ${expected}.`)
    } else {
      setFeedback(`Not quite. ${question.a} x ${question.b} = ${expected}.`)
    }
    nextQuestion()
  }

  return (
    <div className="mini-game-panel">
      <div className="game-scorebar">
        <span>Round {round}</span>
        <strong>Score {score}</strong>
      </div>
      <h3>{question.a} x {question.b} = ?</h3>
      <input className="input" aria-label="Answer" inputMode="numeric" value={answer} onChange={(event) => setAnswer(event.target.value)} />
      <div className="button-row">
        <button className="button primary" type="button" onClick={submit}>Submit</button>
        <button className="button" type="button" onClick={() => { setScore(0); setRound(1); setQuestion({ a: 7, b: 8 }); setAnswer(''); setFeedback('Game reset.') }}>
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
      <p className="status">{feedback}</p>
    </div>
  )
}

export function NumberSlidePuzzleGameTool() {
  const [tiles, setTiles] = useState(solvedTiles)
  const empty = tiles.indexOf(0)
  const won = tiles.join(',') === solvedTiles.join(',')

  const move = (index: number) => {
    const sameRow = Math.floor(index / 3) === Math.floor(empty / 3)
    const sameColumn = index % 3 === empty % 3
    const adjacent = (sameRow && Math.abs(index - empty) === 1) || (sameColumn && Math.abs(index - empty) === 3)
    if (!adjacent) return
    setTiles((current) => {
      const next = [...current]
      ;[next[empty], next[index]] = [next[index], next[empty]]
      return next
    })
  }

  return (
    <div className="tool-form">
      <div className="puzzle-board" aria-label="Number slide puzzle">
        {tiles.map((tile, index) => (
          <button className={`puzzle-tile ${tile === 0 ? 'empty' : ''}`} key={`${tile}-${index}`} type="button" aria-label={tile ? `Tile ${tile}` : 'Empty tile'} onClick={() => move(index)}>
            {tile || ''}
          </button>
        ))}
      </div>
      <div className="button-row">
        <button className="button primary" type="button" onClick={() => setTiles(shuffledTiles)}>Shuffle</button>
        <button className="button" type="button" onClick={() => setTiles(solvedTiles)}>Reset</button>
      </div>
      <p className="status">{won ? 'Puzzle solved.' : 'Move adjacent tiles into the empty space until the numbers are back in order.'}</p>
    </div>
  )
}

const targetPositions = [
  { left: 18, top: 22 },
  { left: 66, top: 30 },
  { left: 42, top: 62 },
  { left: 72, top: 68 },
]

export function ReactionTargetGameTool() {
  const [score, setScore] = useState(0)
  const [shots, setShots] = useState(0)
  const position = targetPositions[score % targetPositions.length]
  const accuracy = shots === 0 ? 100 : Math.round((score / shots) * 100)

  const hit = () => {
    setScore((value) => value + 1)
    setShots((value) => value + 1)
  }

  return (
    <div className="tool-form">
      <div className="game-scorebar">
        <strong>Hits {score}</strong>
        <span>Shots {shots}</span>
        <span>Accuracy {accuracy}%</span>
      </div>
      <button className="shooting-arena" type="button" onClick={() => setShots((value) => value + 1)} aria-label="Shooting arena">
        <span className="target-button moving-target" style={{ left: `${position.left}%`, top: `${position.top}%` }} role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); hit() }}>
          Hit
        </span>
      </button>
      <button className="button" type="button" onClick={() => { setScore(0); setShots(0) }}>Reset</button>
    </div>
  )
}

export function DefenseWaveGameTool() {
  const [wall, setWall] = useState(6)
  const [supplies, setSupplies] = useState(4)
  const [wave, setWave] = useState(1)
  const [log, setLog] = useState('Prepare the wall before starting the next wave.')
  const defeated = wall <= 0

  const reinforce = () => {
    if (supplies <= 0) {
      setLog('No supplies left. Start a wave to salvage more.')
      return
    }
    setWall((value) => Math.min(10, value + 2))
    setSupplies((value) => value - 1)
    setLog('Wall reinforced.')
  }

  const nextWave = () => {
    const damage = Math.min(8, wave + 1)
    setWall((value) => Math.max(0, value - damage))
    setSupplies((value) => value + 2)
    setWave((value) => value + 1)
    setLog(`Wave ${wave} dealt ${damage} damage. Salvaged 2 supplies.`)
  }

  return (
    <div className="mini-game-panel">
      <div className="game-scorebar">
        <strong>Wave {wave}</strong>
        <span>Supplies {supplies}</span>
      </div>
      <label>Wall integrity {wall}/10<progress max={10} value={wall} /></label>
      <div className="button-row">
        <button className="button primary" type="button" onClick={reinforce} disabled={defeated}>Reinforce</button>
        <button className="button" type="button" onClick={nextWave} disabled={defeated}>Next wave</button>
        <button className="button" type="button" onClick={() => { setWall(6); setSupplies(4); setWave(1); setLog('Defense restarted.') }}>Restart</button>
      </div>
      <p className="status">{defeated ? 'The wall fell. Restart to try another defense plan.' : log}</p>
    </div>
  )
}

export function GlyphCasterGameTool() {
  const [glyphs, setGlyphs] = useState<string[]>([])
  const spell = glyphs.join(' - ')
  const power = Math.min(100, glyphs.length * 12)

  return (
    <div className="tool-form">
      <div className="glyph-pad">
        {['Sun', 'Moon', 'Spark', 'Stone', 'Wave', 'Wind'].map((glyph) => (
          <button className="glyph-button" key={glyph} type="button" onClick={() => setGlyphs((current) => [...current, glyph])}>{glyph}</button>
        ))}
      </div>
      <pre className="result-box">{spell || 'Choose glyphs to compose a spell sequence.'}</pre>
      <div className="game-scorebar">
        <span>Power {power}%</span>
        <span>Glyphs {glyphs.length}</span>
      </div>
      <div className="button-row">
        <button className="button" type="button" onClick={() => copyText(spell)} disabled={!spell}>
          <Copy size={16} />
          Copy spell
        </button>
        <button className="button" type="button" onClick={() => setGlyphs([])}>Clear</button>
      </div>
    </div>
  )
}

export function PathArchitectGameTool() {
  const [path, setPath] = useState<string[]>(['Start'])
  const add = (step: string) => setPath((current) => [...current, step])
  const route = path.join(' -> ')

  return (
    <div className="tool-form">
      <div className="button-row">
        {['Up', 'Right', 'Down', 'Left', 'Bridge', 'Gate', 'Goal'].map((step) => (
          <button className="button" key={step} type="button" onClick={() => add(step)}>{step}</button>
        ))}
      </div>
      <div className="path-preview">{path.map((step, index) => <span key={`${step}-${index}`}>{step}</span>)}</div>
      <pre className="result-box">{route}</pre>
      <div className="button-row">
        <button className="button" type="button" onClick={() => copyText(route)}>Copy route</button>
        <button className="button" type="button" onClick={() => setPath(['Start'])}>Reset path</button>
      </div>
    </div>
  )
}

export function SphereEngineerClassicGameTool() {
  const [plants, setPlants] = useState(4)
  const [water, setWater] = useState(5)
  const balance = useMemo(() => Math.max(0, 100 - Math.abs(plants - water) * 14), [plants, water])

  return (
    <div className="mini-game-panel">
      <h3>Ecology balance: {balance}%</h3>
      <label>Plants {plants}<input type="range" min="0" max="10" value={plants} onChange={(event) => setPlants(Number(event.target.value))} /></label>
      <label>Water {water}<input type="range" min="0" max="10" value={water} onChange={(event) => setWater(Number(event.target.value))} /></label>
      <p className="status">{balance >= 80 ? 'Stable ecosystem.' : 'Move plants and water closer together to stabilize the sphere.'}</p>
    </div>
  )
}

export function SphereEngineerEnhancedGameTool() {
  const [plants, setPlants] = useState(5)
  const [water, setWater] = useState(5)
  const [light, setLight] = useState(6)
  const [microbes, setMicrobes] = useState(4)
  const oxygen = Math.max(0, Math.min(100, plants * 8 + light * 4 - microbes * 3))
  const humidity = Math.max(0, Math.min(100, water * 9 - light * 2 + microbes * 2))
  const stability = Math.round((100 - Math.abs(oxygen - 62) - Math.abs(humidity - 58)) * 0.8)

  return (
    <div className="mini-game-panel">
      <h3>Sphere stability: {Math.max(0, stability)}%</h3>
      <label>Plants {plants}<input type="range" min="0" max="10" value={plants} onChange={(event) => setPlants(Number(event.target.value))} /></label>
      <label>Water {water}<input type="range" min="0" max="10" value={water} onChange={(event) => setWater(Number(event.target.value))} /></label>
      <label>Light {light}<input type="range" min="0" max="10" value={light} onChange={(event) => setLight(Number(event.target.value))} /></label>
      <label>Microbes {microbes}<input type="range" min="0" max="10" value={microbes} onChange={(event) => setMicrobes(Number(event.target.value))} /></label>
      <div className="game-scorebar">
        <span>Oxygen {oxygen}%</span>
        <span>Humidity {humidity}%</span>
      </div>
      <p className="status">Tune all four sliders to keep oxygen and humidity near the target range.</p>
    </div>
  )
}
