import { useState, useCallback } from 'react'
import { saveAs } from 'file-saver'
import { 
  ImageFile, 
  ImageProcessingOptions, 
  ImageFormat,
  ImageDimensions 
} from '../types/image'
import { 
  createCanvas, 
  loadImage, 
  getFileExtension,
  calculateAspectRatioDimensions 
} from '../utils/imageUtils'

export const useImageProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resizeImage = useCallback(async (
    imageFile: ImageFile,
    options: ImageProcessingOptions
  ): Promise<string> => {
    setIsProcessing(true)
    setError(null)

    try {
      const img = await loadImage(imageFile.url)
      const { width: originalWidth, height: originalHeight } = img

      const targetDimensions = calculateAspectRatioDimensions(
        originalWidth,
        originalHeight,
        options.width,
        options.height
      )

      const canvas = createCanvas(targetDimensions.width, targetDimensions.height)
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      ctx.drawImage(img, 0, 0, targetDimensions.width, targetDimensions.height)

      const quality = options.quality || 0.9
      const format = options.format || 'jpeg'
      const mimeType = `image/${format}`

      return canvas.toDataURL(mimeType, quality)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resize image'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const convertFormat = useCallback(async (
    imageFile: ImageFile,
    targetFormat: ImageFormat,
    quality = 0.9
  ): Promise<string> => {
    setIsProcessing(true)
    setError(null)

    try {
      const img = await loadImage(imageFile.url)
      const canvas = createCanvas(img.naturalWidth, img.naturalHeight)
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      ctx.drawImage(img, 0, 0)

      const mimeType = `image/${targetFormat}`
      return canvas.toDataURL(mimeType, quality)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert image format'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const cropImage = useCallback(async (
    imageFile: ImageFile,
    cropArea: { x: number; y: number; width: number; height: number },
    options: Partial<ImageProcessingOptions> = {}
  ): Promise<string> => {
    setIsProcessing(true)
    setError(null)

    try {
      const img = await loadImage(imageFile.url)
      const canvas = createCanvas(cropArea.width, cropArea.height)
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      )

      const quality = options.quality || 0.9
      const format = options.format || 'jpeg'
      const mimeType = `image/${format}`

      return canvas.toDataURL(mimeType, quality)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to crop image'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const downloadImage = useCallback(async (
    dataUrl: string,
    filename: string,
    format: ImageFormat = 'jpeg'
  ) => {
    try {
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const extension = getFileExtension(format)
      const downloadFilename = `${filename.replace(/\.[^/.]+$/, '')}.${extension}`
      saveAs(blob, downloadFilename)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download image'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getImageDimensions = useCallback(async (imageFile: ImageFile): Promise<ImageDimensions> => {
    try {
      const img = await loadImage(imageFile.url)
      return {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get image dimensions'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  return {
    resizeImage,
    convertFormat,
    cropImage,
    downloadImage,
    getImageDimensions,
    isProcessing,
    error,
    clearError: () => setError(null)
  }
}
