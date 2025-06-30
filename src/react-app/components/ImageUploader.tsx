import { ChangeEvent, useState } from 'react';
import { isValidImageFile, generateImageId, formatFileSize } from '../utils/imageUtils';
import { ImageFile } from '../types/image';

function ImageUploader() {
  const [images, setImages] = useState<ImageFile[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const imageFiles: ImageFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (isValidImageFile(file)) {
        const url = URL.createObjectURL(file);
        const newImage: ImageFile = {
          file,
          id: generateImageId(),
          name: file.name,
          size: file.size,
          type: file.type,
          url,
        };
        imageFiles.push(newImage);
      }
    }

    setImages((prevImages) => [...prevImages, ...imageFiles]);
  };

  return (
    <div>
      <h2>Upload Images</h2>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      <div>
        {images.map((image) => (
          <div key={image.id}>
            <img src={image.url} alt={image.name} width={100} />
            <p>{image.name} - {formatFileSize(image.size)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageUploader;

