// Image processing utilities for the replicate image app

import { ImageDimensions, ImageFormat } from '../types/image'

/**
 * Generate a unique ID for image files
 */
export const generateImageId = (): string => {
  return `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Validate if a file is a supported image format
 */
export const isValidImageFile = (file: File): boolean => {
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']
  return supportedTypes.includes(file.type)
}

/**
 * Get image dimensions from a file
 */
export const getImageDimensions = (file: File): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}

/**
 * Convert file size to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file extension from image format
 */
export const getFileExtension = (format: ImageFormat): string => {
  const extensions: Record<ImageFormat, string> = {
    'jpeg': 'jpg',
    'png': 'png',
    'webp': 'webp',
    'gif': 'gif',
    'bmp': 'bmp'
  }
  return extensions[format]
}

/**
 * Create a canvas element with given dimensions
 */
export const createCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

/**
 * Load image from URL into an Image element
 */
export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
export const calculateAspectRatioDimensions = (
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): ImageDimensions => {
  if (!targetWidth && !targetHeight) {
    return { width: originalWidth, height: originalHeight }
  }
  
  const aspectRatio = originalWidth / originalHeight
  
  if (targetWidth && targetHeight) {
    // Both dimensions specified - use the one that maintains aspect ratio
    const widthBasedHeight = targetWidth / aspectRatio
    const heightBasedWidth = targetHeight * aspectRatio
    
    if (widthBasedHeight <= targetHeight) {
      return { width: targetWidth, height: Math.round(widthBasedHeight) }
    } else {
      return { width: Math.round(heightBasedWidth), height: targetHeight }
    }
  } else if (targetWidth) {
    return { width: targetWidth, height: Math.round(targetWidth / aspectRatio) }
  } else if (targetHeight) {
    return { width: Math.round(targetHeight * aspectRatio), height: targetHeight }
  }
  
  return { width: originalWidth, height: originalHeight }
}
