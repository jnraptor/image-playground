import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText(/Vite \+ React \+ Hono \+ Cloudflare/i)).toBeInTheDocument()
  })

  it('has increment button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /increment/i })).toBeInTheDocument()
  })

  it('has API button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /get name/i })).toBeInTheDocument()
  })
})
