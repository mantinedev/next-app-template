"use client"
import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mantine/core';
import Image from 'next/image';

const AddProductImages = ({
  setImages,
  images,
}: {
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  images: File[];
}) => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [image1, setImage1] = useState<File | null>(images[0] || null);

  useEffect(() => {
    const selectedImages = [image1].filter((image): image is File => image !== null);
    setImages(selectedImages);
  }, [image1, setImages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setImage1(file);
      setError(null);
    } else {
      setPreviewUrl(null);
      setError("Bir dosya seçmelisiniz.");
    }
  };

  const renderImage = (image: File | null) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1>Dosya Yükle</h1>
        <input type="file" name="image1" onChange={handleFileChange} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {uploadedUrl && (
          <div>
            <h2>Yükleme Başarılı!</h2>
            <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
              Yüklenen Dosyayı Görüntüle
            </a>
          </div>
        )}
      </div>

      {/* Önizleme alanı */}
      <div style={{ marginLeft: '20px' }}>
        <h2>Önizleme</h2>
        {previewUrl ? (
          <img src={previewUrl} alt="Seçilen dosya" style={{ width: '200px', height: 'auto' }} />
        ) : image ? (
          <Image
            src={URL.createObjectURL(image)}
            alt={image.name}
            width={200}
            height={200}
          />
        ) : (
          <p>Dosya seçilmedi.</p>
        )}
      </div>
    </div>
  );

  return (
    <Box>
      {renderImage(image1)}
      <Button onClick={() => setImage1(null)} style={{ marginTop: '20px' }}>
        Seçimi Temizle
      </Button>
    </Box>
  );
};

export default AddProductImages;
