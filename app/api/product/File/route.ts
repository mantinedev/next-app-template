import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: "dj9sknitc", 
        api_key: "339673989917425", 
  api_secret: "XVgNicWrFmgezIVj0N08uUO1xkc",  // Hata düzeltildi: 'API_KEY' yerine 'API_SECRET'
});

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Dosyayı buffer olarak oku
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudinary'ye yükleme yap ve sonucu bekle
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'your-folder-name' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!); // Burada result'un null olmayacağını varsayıyoruz
          }
        }
      );

      // Buffer'ı stream'e yaz ve işlemi bitir
      uploadStream.end(buffer);
    });

    // Yüklenen dosyanın URL'sini dön
    return NextResponse.json({ success: true, url: uploadResult.secure_url }, { status: 200 });

  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
