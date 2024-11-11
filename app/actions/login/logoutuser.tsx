'use server';
import { cookies } from 'next/headers';

export async function logout() {
  const cookie = cookies();
  cookie.delete('Authorization');
}
