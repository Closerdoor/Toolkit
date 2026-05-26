import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  DefenseWaveGameTool,
  GlyphCasterGameTool,
  MathPracticeGameTool,
  NumberSlidePuzzleGameTool,
  PathArchitectGameTool,
  ReactionTargetGameTool,
  SphereEngineerClassicGameTool,
  SphereEngineerEnhancedGameTool,
} from '../../src/tools'

describe('game and entertainment tools', () => {
  it('math practice scores a correct answer and advances the round', () => {
    render(<MathPracticeGameTool />)
    fireEvent.change(screen.getByLabelText('Answer'), { target: { value: '56' } })
    fireEvent.click(screen.getByText('Submit'))

    expect(screen.getByText('Score 1')).toBeInTheDocument()
    expect(screen.getByText('Round 2')).toBeInTheDocument()
    expect(screen.getByText(/Correct/)).toBeInTheDocument()
  })

  it('number slide puzzle can shuffle, move, and reset', () => {
    render(<NumberSlidePuzzleGameTool />)
    fireEvent.click(screen.getByText('Shuffle'))
    expect(screen.getByText(/Move adjacent tiles/)).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Tile 5'))
    expect(screen.getByText(/Move adjacent tiles|Puzzle solved/)).toBeInTheDocument()

    fireEvent.click(screen.getByText('Reset'))
    expect(screen.getByText('Puzzle solved.')).toBeInTheDocument()
  })

  it('reaction target tracks hits, shots, and reset state', () => {
    render(<ReactionTargetGameTool />)
    fireEvent.click(screen.getByText('Hit'))
    expect(screen.getByText('Hits 1')).toBeInTheDocument()
    expect(screen.getByText('Shots 1')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Reset'))
    expect(screen.getByText('Hits 0')).toBeInTheDocument()
  })

  it('defense wave game changes resources and can restart', () => {
    render(<DefenseWaveGameTool />)
    fireEvent.click(screen.getByText('Reinforce'))
    expect(screen.getByText('Supplies 3')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Next wave'))
    expect(screen.getByText('Wave 2')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Restart'))
    expect(screen.getByText('Wave 1')).toBeInTheDocument()
  })

  it('glyph caster builds and clears a spell sequence', () => {
    render(<GlyphCasterGameTool />)
    fireEvent.click(screen.getByText('Sun'))
    fireEvent.click(screen.getByText('Moon'))
    expect(screen.getByText('Sun - Moon')).toBeInTheDocument()
    expect(screen.getByText('Power 24%')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Clear'))
    expect(screen.getByText('Choose glyphs to compose a spell sequence.')).toBeInTheDocument()
  })

  it('path architect creates a copyable route and resets it', () => {
    render(<PathArchitectGameTool />)
    fireEvent.click(screen.getByText('Right'))
    fireEvent.click(screen.getByText('Goal'))
    expect(screen.getByText('Start -> Right -> Goal')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Reset path'))
    expect(screen.getAllByText('Start').length).toBeGreaterThan(0)
    expect(screen.queryByText('Start -> Right -> Goal')).not.toBeInTheDocument()
  })

  it('classic sphere engineer responds to slider changes', () => {
    render(<SphereEngineerClassicGameTool />)
    expect(screen.getByText(/Ecology balance/)).toBeInTheDocument()
    fireEvent.change(screen.getByDisplayValue('4'), { target: { value: '10' } })
    expect(screen.getByText(/Ecology balance/)).toBeInTheDocument()
  })

  it('enhanced sphere engineer exposes independent light and microbes controls', () => {
    render(<SphereEngineerEnhancedGameTool />)
    expect(screen.getByText(/Sphere stability/)).toBeInTheDocument()
    expect(screen.getByText(/Oxygen/)).toBeInTheDocument()
    expect(screen.getByText(/Humidity/)).toBeInTheDocument()
    fireEvent.change(screen.getByDisplayValue('6'), { target: { value: '9' } })
    expect(screen.getByText(/Tune all four sliders/)).toBeInTheDocument()
  })
})
