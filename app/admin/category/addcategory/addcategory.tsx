'use client';
import { addcategory } from '@/app/actions/category/addcategoryproduction';
import { Alert, Button, Modal, TextInput } from '@mantine/core';
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
          <TextInput id="desc" name="desc" label="Kategori desc" placeholder="pantolon" required />
          {state?.message ? (
            <Alert mt={15} variant="filled" color="green" title="">
              Kayıt Başarılı
            </Alert>
          ) : null}
          <Button
            type="submit"
            fullWidth
            mt="xl"
            variant="gradient"
            gradient={{ from: 'yellow', to: 'orange', deg: 78 }}
          >
            Kategori Ekle
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default AddCategory;
