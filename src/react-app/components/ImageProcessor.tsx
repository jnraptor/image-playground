import { useState } from 'react'
import { ImageFile, ImageFormat } from '../types/image'
import { useImageProcessor } from '../hooks/useImageProcessor'

interface ImageProcessorProps {
  image: ImageFile
  onProcessedImage?: (dataUrl: string) => void
}

function ImageProcessor({ image, onProcessedImage }: ImageProcessorProps) {
  const {
    resizeImage,
    convertFormat,
    downloadImage,
    isProcessing,
    error,
    clearError
  } = useImageProcessor()

  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: '', height: '' })
  const [quality, setQuality] = useState(90)
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('jpeg')

  const handleResize = async () => {
    try {
      clearError()
      const width = parseInt(dimensions.width) || undefined
      const height = parseInt(dimensions.height) || undefined

      if (!width && !height) {
        alert('Please specify at least width or height')
        return
      }

      const resizedImageUrl = await resizeImage(image, {
        width,
        height,
        quality: quality / 100,
        format: selectedFormat,
        maintainAspectRatio: true
      })

      setProcessedImageUrl(resizedImageUrl)
      onProcessedImage?.(resizedImageUrl)
    } catch (err) {
      console.error('Resize failed:', err)
    }
  }

  const handleFormatConversion = async () => {
    try {
      clearError()
      const convertedImageUrl = await convertFormat(image, selectedFormat, quality / 100)
      setProcessedImageUrl(convertedImageUrl)
      onProcessedImage?.(convertedImageUrl)
    } catch (err) {
      console.error('Format conversion failed:', err)
    }
  }

  const handleDownload = async () => {
    if (processedImageUrl) {
      try {
        await downloadImage(processedImageUrl, image.name, selectedFormat)
      } catch (err) {
        console.error('Download failed:', err)
      }
    }
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Process: {image.name}</h3>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Original Image */}
        <div>
          <h4>Original</h4>
          <img 
            src={image.url} 
            alt={image.name} 
            style={{ maxWidth: '200px', maxHeight: '200px' }}
          />
        </div>

        {/* Processed Image */}
        {processedImageUrl && (
          <div>
            <h4>Processed</h4>
            <img 
              src={processedImageUrl} 
              alt="Processed" 
              style={{ maxWidth: '200px', maxHeight: '200px' }}
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Processing Options</h4>
        
        {/* Resize Controls */}
        <div style={{ marginBottom: '15px' }}>
          <h5>Resize</h5>
          <label>
            Width: 
            <input 
              type="number" 
              value={dimensions.width}
              onChange={(e) => setDimensions(prev => ({ ...prev, width: e.target.value }))}
              placeholder="Auto"
              style={{ marginLeft: '5px', width: '80px' }}
            />
          </label>
          <label style={{ marginLeft: '10px' }}>
            Height: 
            <input 
              type="number" 
              value={dimensions.height}
              onChange={(e) => setDimensions(prev => ({ ...prev, height: e.target.value }))}
              placeholder="Auto"
              style={{ marginLeft: '5px', width: '80px' }}
            />
          </label>
          <button 
            onClick={handleResize} 
            disabled={isProcessing}
            style={{ marginLeft: '10px' }}
          >
            {isProcessing ? 'Resizing...' : 'Resize'}
          </button>
        </div>

        {/* Format Controls */}
        <div style={{ marginBottom: '15px' }}>
          <h5>Format & Quality</h5>
          <label>
            Format: 
            <select 
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as ImageFormat)}
              style={{ marginLeft: '5px' }}
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </label>
          <label style={{ marginLeft: '10px' }}>
            Quality: 
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              style={{ marginLeft: '5px' }}
            />
            <span style={{ marginLeft: '5px' }}>{quality}%</span>
          </label>
          <button 
            onClick={handleFormatConversion} 
            disabled={isProcessing}
            style={{ marginLeft: '10px' }}
          >
            {isProcessing ? 'Converting...' : 'Convert Format'}
          </button>
        </div>

        {/* Download */}
        {processedImageUrl && (
          <div>
            <button onClick={handleDownload}>
              Download Processed Image
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageProcessor
