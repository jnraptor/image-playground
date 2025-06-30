// Image processing types for the replicate image app

export interface ImageFile {
  file: File
  id: string
  name: string
  size: number
  type: string
  url: string
  thumbnail?: string
}

export interface ImageProcessingOptions {
  width?: number
  height?: number
  quality?: number
  format?: ImageFormat
  maintainAspectRatio?: boolean
}

export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp'

export interface ImageFilter {
  id: string
  name: string
  description: string
  apply: (imageData: ImageData) => ImageData
}

export interface ProcessingProgress {
  id: string
  progress: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
}

export interface ImageDimensions {
  width: number
  height: number
}

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageHistoryState {
  id: string
  action: string
  timestamp: number
  imageData: string
  options?: ImageProcessingOptions
}
