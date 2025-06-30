import { describe, it, expect } from 'vitest'
import {
  generateImageId,
  isValidImageFile,
  formatFileSize,
  getFileExtension,
  calculateAspectRatioDimensions
} from '../imageUtils'

describe('imageUtils', () => {
  describe('generateImageId', () => {
    it('generates unique IDs', () => {
      const id1 = generateImageId()
      const id2 = generateImageId()
      
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^img-\d+-[a-z0-9]+$/)
      expect(id2).toMatch(/^img-\d+-[a-z0-9]+$/)
    })
  })

  describe('isValidImageFile', () => {
    it('returns true for valid image files', () => {
      const jpegFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const pngFile = new File([''], 'test.png', { type: 'image/png' })
      const webpFile = new File([''], 'test.webp', { type: 'image/webp' })
      
      expect(isValidImageFile(jpegFile)).toBe(true)
      expect(isValidImageFile(pngFile)).toBe(true)
      expect(isValidImageFile(webpFile)).toBe(true)
    })

    it('returns false for invalid file types', () => {
      const textFile = new File([''], 'test.txt', { type: 'text/plain' })
      const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' })
      
      expect(isValidImageFile(textFile)).toBe(false)
      expect(isValidImageFile(pdfFile)).toBe(false)
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1073741824)).toBe('1 GB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })
  })

  describe('getFileExtension', () => {
    it('returns correct extensions for formats', () => {
      expect(getFileExtension('jpeg')).toBe('jpg')
      expect(getFileExtension('png')).toBe('png')
      expect(getFileExtension('webp')).toBe('webp')
      expect(getFileExtension('gif')).toBe('gif')
      expect(getFileExtension('bmp')).toBe('bmp')
    })
  })

  describe('calculateAspectRatioDimensions', () => {
    it('maintains original dimensions when no targets provided', () => {
      const result = calculateAspectRatioDimensions(800, 600)
      expect(result).toEqual({ width: 800, height: 600 })
    })

    it('calculates height when width is provided', () => {
      const result = calculateAspectRatioDimensions(800, 600, 400)
      expect(result).toEqual({ width: 400, height: 300 })
    })

    it('calculates width when height is provided', () => {
      const result = calculateAspectRatioDimensions(800, 600, undefined, 300)
      expect(result).toEqual({ width: 400, height: 300 })
    })

    it('maintains aspect ratio when both dimensions provided', () => {
      const result = calculateAspectRatioDimensions(800, 600, 200, 200)
      expect(result).toEqual({ width: 200, height: 150 })
    })
  })
})
