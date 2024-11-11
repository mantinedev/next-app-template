'use client';
import { addcategory } from '@/app/actions/category/POST/addcategoryproduction';
import { Button, Modal, Notification, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useFormState } from 'react-dom';

const initialState = {
  message: '',
};
const AddCategory = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [state, formAction] = useFormState(addcategory, initialState);

  return (
    <>
     {state?.message ? <Notification >{state.message}</Notification> : null}
      <Button
        onClick={open}
        variant="gradient"
        gradient={{ from: 'yellow', to: 'orange', deg: 78 }}
      >
       
        Kategori Ekle
      </Button>
      <Modal opened={opened} onClose={close} size="xl" title="Ürün Ekleme" centered>
        <form action={formAction}>
          <TextInput id="name" name="name" label="Kategori Adı" placeholder="pantolon" required />

          <Button
            type="submit"
            fullWidth
            mt="xl"
            variant="gradient"
            gradient={{ from: 'yellow', to: 'orange', deg: 78 }}
            onClick={close}
          >
            Kategori Ekle
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default AddCategory;
