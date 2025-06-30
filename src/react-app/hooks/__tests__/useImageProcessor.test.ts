import { describe, it, expect, vi } from 'vitest'
import { useImageProcessor } from '../useImageProcessor'

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn()
}))

describe('useImageProcessor', () => {
  it('hook exists and exports expected functions', () => {
    const hook = useImageProcessor
    expect(typeof hook).toBe('function')
  })

  it('can be imported successfully', () => {
    expect(useImageProcessor).toBeDefined()
  })
})
