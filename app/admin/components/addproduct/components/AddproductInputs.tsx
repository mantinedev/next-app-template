"use client"
import { ProductInputs } from "@/app/types/product/addproduct";
import { Box,  NumberInput, Textarea, TextInput } from "@mantine/core";
import React from 'react';

const AddproductInputs = ({ inputs, setInputs}: { inputs: ProductInputs; setInputs: any; }) => {
  return (
    <>
     
      <TextInput
        label="Ürün Adı"
        placeholder="Ürün Adı"
        rightSectionPointerEvents="all"
        value={inputs.name}
        name="name"
        id="name"
        onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
        mt="md"
      />
      <NumberInput
        label="Ürün Fiyatı"
        placeholder="Ürün Fiyatı"
        rightSectionPointerEvents="all"
        mt="md"
        name="price"
        value={inputs.price}
        onChange={(value) => setInputs({ ...inputs, price: value })}
      />
      
      <NumberInput
        label="Ürün Stok Adedi"
        placeholder="Ürün Stok Adedi"
        rightSectionPointerEvents="all"
        mt="md"
        name="stock"
        value={inputs.stock}
        onChange={(value) => setInputs({ ...inputs, stock: value })}
      />
      
      <Textarea
        mt="md"
        label="Ürün Açıklaması"
        minRows={4}
        placeholder="Ürün Açıklaması"
        autosize
        name="descrip"
        value={inputs.descrip}
        onChange={(e) => setInputs({ ...inputs, descrip: e.target.value })}
      />
    </>
  );
};

export default AddproductInputs;
