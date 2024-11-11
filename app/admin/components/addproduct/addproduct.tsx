'use client';
import { Button, Modal, Group} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AddproductInputs from './components/AddproductInputs';
import {  useState } from 'react';
import AddProductImages from './components/AddProductImages';
import { ProductInputs } from '@/app/types/product/addproduct';
import { useFormState } from 'react-dom';
import { addproduct } from '@/app/actions/product/POST/addproduct';
import { notifications } from '@mantine/notifications';

const initialState = {
  message: '',
  id: '',
};

const AddProduct = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [state, formAction] = useFormState(addproduct, initialState);

  const [inputs, setInputs] = useState<ProductInputs>({
    name: '',
    price: 0,
    descrip: '',
    stock: 0,
  });

  const [images, setImages] = useState<File[]>([]);

  const handleClose = () => {
    // Modal kapanırken resimleri sıfırla
    setImages([]);
    close();
  };


  return (
    <>
      <Button
        onClick={open}
        variant="gradient"
        gradient={{ from: 'yellow', to: 'orange', deg: 78 }}
      >
        Ürün Ekleme
      </Button>
     
     

      <Modal opened={opened} onClose={handleClose} size="xl" title="Ürün Ekleme" centered>
        <form action={formAction}>
          <AddproductInputs inputs={inputs} setInputs={setInputs} />
          <AddProductImages setImages={setImages} images={images} />

          <Group style={{ justifyContent: 'space-between' }}>
            <Button mt="md" variant="default">
              İptal Et
            </Button>
            <Button
              mt="md"
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange', deg: 78 }}
              type="submit"
            >
              Kaydet
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default AddProduct;
