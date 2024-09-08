import { Box, LoadingOverlay, NumberInput, Textarea, TextInput } from '@mantine/core'
import React from 'react'

const AddproductInputs = () => {
  return (
              <Box>
               <TextInput
                 label="Ürün Adı"
                 placeholder="Ürün Adı"
                 rightSectionPointerEvents="all"
                 mt="md"
               />
               <NumberInput
                 label="Ürün Fiyatı"
                 placeholder="Ürün Fiyatı"
                 rightSectionPointerEvents="all"
                 mt="md"
               />
               <NumberInput
                 label="Ürün Stok Adedi"
                 placeholder="Ürün Stok Adedi"
                 rightSectionPointerEvents="all"
                 mt="md"
               />
             <Textarea
               mt="md"
               label="Ürün Açıklaması"
               minRows={4}
               placeholder="Ürün Açıklaması"
               autosize
             />
              </Box>
  )
}

export default AddproductInputs