"use client"
import { useSearchParams } from 'next/navigation';
import React from 'react';
import UploadImage from './uploadimage';

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const isim = searchParams.get('isim');
  
  return(
    <>
    <span>
      UPLOAD İŞLEMLERİ İÇİN
    </span>
    <UploadImage/>
    </>
  )
};

export default Page;
