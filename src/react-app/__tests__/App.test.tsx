import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url')
global.URL.revokeObjectURL = vi.fn()

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Image Processing Playground')).toBeInTheDocument()
  })

  it('shows upload section', () => {
    render(<App />)
    expect(screen.getByText('Upload Images')).toBeInTheDocument()
  })

  it('shows getting started instructions', () => {
    render(<App />)
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })
})
