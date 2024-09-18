'use server';

import { cookies } from 'next/headers';

export async function updatecategory(formData: any) {
  const id = formData.get('id');
  const name = formData.get('name');
  const cookie = cookies();
  const token = cookie.get('Authorization')?.value;
  try {
    const response = await fetch('http://localhost:3000/api/category', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, name }),
    });
    const endResponse = JSON.parse(await response.text());
    if (response.ok) {
      return {
        message: endResponse.message,
      };
    } else {
      return {
        message: endResponse.message,
      };
    }
  } catch (error) {
    return {};
  }
}
