import { Button, Modal, Group, Stepper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

const AddCategory = () => {
  const [opened, { open, close }] = useDisclosure(false);


  return (
    <>
      <Button
        onClick={open}
        variant="gradient"
        gradient={{ from: 'yellow', to: 'orange', deg: 78 }}
      >
        Kategori Ekle
      </Button>
      <Modal opened={opened} onClose={close} size="xl" title="Ürün Ekleme" centered></Modal>
    </>
  );
};

export default AddCategory;
