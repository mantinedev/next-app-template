'use server';

import { cookies } from 'next/headers';

export async function addproduct(prevState: any, formData: any) {
  const name = formData.get('name');
  const price = formData.get('price');
  const image = formData.get('image1');
  const descrip = formData.get('descrip');
  const stock = formData.get('stock');
  const cookie = cookies();
  const token = cookie.get('Authorization')?.value;
  try {
    const response = await fetch('http://localhost:3000/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, price, descrip, stock }),
    });
    const endResponse = JSON.parse(await response.text());

    if (response.ok) {
      const id = endResponse.NewProduct.id;
      try {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('id', id);

        const response2 = await fetch('http://localhost:3000/api/product/File', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const endResponseFile = await response2.json(); // Fetch response should be from response2
        if (!response2.ok) {
          throw new Error('Fotoğraf Yüklenemedi');
        }
      } catch (error) {
        return {
          message: 'Fotoğraf Yüklenemedi',
        };
      }
      return {
        message: endResponse.message,
        id: endResponse.NewProduct.id,
      };
    } else {
      return {
        message: endResponse.message,
      };
    }
  } catch (error) {
    message: 'hata';
  }
}
