"use client"
import { useSearchParams } from 'next/navigation';
import React from 'react';

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const isim = searchParams.get('isim');
  console.log(isim)
  return <div>{isim}</div>;
};

export default Page;
