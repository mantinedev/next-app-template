"use client"
import Image from 'next/image';
import { useState } from 'react';

export default function UploadImage({image,setFile}:any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  
  // Dosya seçildiğinde çağrılacak fonksiyon
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setFile(file)

    // Önizleme için dosya URL'sini oluştur
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    } else {
      setPreviewUrl(null);
    }
  };



  return (
    <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <h1>Dosya Yükle</h1>
        <input  type="file" onChange={handleFileChange} />
        {/* <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Yükleniyor...' : 'Yükle'}
        </button> */}
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
            <img 
              src={previewUrl} 
              alt="Seçilen dosya" 
              style={{ width: '200px', height: 'auto' }} 
            />
          ) : image ? (
            <Image
              src={URL.createObjectURL(image)}
              alt={image.name}
              width={200}
              height={200}
            />
          ) : null}
        </div>
    
    </div>
   </>

  );
}
