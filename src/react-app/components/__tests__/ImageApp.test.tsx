import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ImageApp from '../ImageApp'

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url')
global.URL.revokeObjectURL = vi.fn()

describe('ImageApp', () => {
  it('renders upload section', () => {
    render(<ImageApp />)
    
    expect(screen.getByText('Image Processing Playground')).toBeInTheDocument()
    expect(screen.getByText('Upload Images')).toBeInTheDocument()
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument()
  })

  it('shows instructions when no images uploaded', () => {
    render(<ImageApp />)
    
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.getByText(/Upload one or more images to begin processing them/)).toBeInTheDocument()
  })

  it('handles file upload', async () => {
    render(<ImageApp />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    expect(input).toBeInTheDocument()

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    })

    fireEvent.change(input)

    await waitFor(() => {
      expect(screen.getByText('Uploaded Images (1)')).toBeInTheDocument()
    })
  })

  it('displays supported formats information', () => {
    render(<ImageApp />)
    
    expect(screen.getByText('Supported formats: JPEG, PNG, WebP, GIF, BMP')).toBeInTheDocument()
  })
})
