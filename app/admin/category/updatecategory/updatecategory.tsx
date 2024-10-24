'use client';
import { addcategory } from '@/app/actions/category/addcategoryproduction';
import { updatecategory } from '@/app/actions/category/updatecategoryproduction';
import { Alert, Button, Modal, Notification, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useFormState } from 'react-dom';

const initialState = {
  message: '',
};
const UpdateCategory = ({ data, close }: any) => {
  const [state, formAction] = useFormState(updatecategory, initialState);
  return (
    <form action={formAction}>
      <TextInput value={data.id} id="id" name="id" label="Kategori Id" readOnly />
      <TextInput
        defaultValue={data.name}
        id="name"
        name="name"
        label="Kategori Adı"
        placeholder="pantolon"
        required
      />
      <Button
        type="submit"
        fullWidth
        mt="xl"
        variant="gradient"
        gradient={{ from: 'yellow', to: 'orange', deg: 78 }}
        onClick={close}
      >
        Kategori Güncelle
      </Button>
    </form>
  );
};

export default UpdateCategory;
