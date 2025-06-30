import { useState } from 'react'
import { ChangeEvent } from 'react'
import { ImageFile } from '../types/image'
import { isValidImageFile, generateImageId, formatFileSize } from '../utils/imageUtils'
import ImageProcessor from './ImageProcessor'

function ImageApp() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const imageFiles: ImageFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (isValidImageFile(file)) {
        const url = URL.createObjectURL(file)
        const newImage: ImageFile = {
          file,
          id: generateImageId(),
          name: file.name,
          size: file.size,
          type: file.type,
          url,
        }
        imageFiles.push(newImage)
      }
    }

    setImages((prevImages) => [...prevImages, ...imageFiles])
  }

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handleRemoveImage = (index: number) => {
    const imageToRemove = images[index]
    URL.revokeObjectURL(imageToRemove.url)
    
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
    
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null)
    } else if (selectedImageIndex !== null && selectedImageIndex > index) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  const selectedImage = selectedImageIndex !== null ? images[selectedImageIndex] : null

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Image Processing Playground</h1>
      
      {/* Upload Section */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '2px dashed #ccc', borderRadius: '8px' }}>
        <h2>Upload Images</h2>
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
        <p style={{ color: '#666', fontSize: '14px' }}>
          Supported formats: JPEG, PNG, WebP, GIF, BMP
        </p>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2>Uploaded Images ({images.length})</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '15px' 
          }}>
            {images.map((image, index) => (
              <div 
                key={image.id}
                style={{ 
                  border: selectedImageIndex === index ? '3px solid #007bff' : '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '10px',
                  cursor: 'pointer',
                  backgroundColor: selectedImageIndex === index ? '#f8f9fa' : 'white'
                }}
                onClick={() => handleImageSelect(index)}
              >
                <img 
                  src={image.url} 
                  alt={image.name} 
                  style={{ 
                    width: '100%', 
                    height: '150px', 
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {image.name}
                  </div>
                  <div style={{ color: '#666' }}>
                    {formatFileSize(image.size)}
                  </div>
                  <div style={{ color: '#666' }}>
                    {image.type}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage(index)
                    }}
                    style={{ 
                      marginTop: '8px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing Section */}
      {selectedImage && (
        <div>
          <h2>Process Selected Image</h2>
          <ImageProcessor 
            image={selectedImage}
            onProcessedImage={(dataUrl) => {
              console.log('Image processed:', dataUrl.substring(0, 50) + '...')
            }}
          />
        </div>
      )}

      {/* Instructions */}
      {images.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
          <h3>Get Started</h3>
          <p>Upload one or more images to begin processing them.</p>
          <p>You can resize images, convert formats, adjust quality, and download the results.</p>
        </div>
      )}
    </div>
  )
}

export default ImageApp
