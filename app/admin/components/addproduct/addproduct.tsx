import {
  Button,
  Modal,
  Group,
  Stepper,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AddproductInputs from './components/AddproductInputs';
import { useState } from 'react';
import AddProductImages from './components/AddProductImages';

const AddProduct = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));


  
  return (
    <>
      <Button
        onClick={open}
        variant="gradient"
        gradient={{ from: 'yellow', to: 'orange', deg: 78 }}
      >
        Gradient button
      </Button>
      <Modal opened={opened} onClose={close} size="xl" title="Ürün Ekleme" centered>
      <Stepper active={active} onStepClick={setActive}>
      <Stepper.Step label="Ürün bilgileri">
      <AddproductInputs />
        <Group style={{ justifyContent: 'space-between' }}>
        <Button mt="md" variant="default" onClick={prevStep}>Back</Button>
        <Button  mt="md" onClick={nextStep}>Next step</Button>
        </Group>
      </Stepper.Step>
      <Stepper.Step label="Ürün Medya Dosyaları" >
        <AddProductImages/>
      <Group style={{ justifyContent: 'space-between' }}>
        <Button mt="md" variant="default" onClick={prevStep}>Back</Button>
        <Button  mt="md" onClick={nextStep}>Next step</Button>
        </Group>
      </Stepper.Step>
      <Stepper.Step label="Önizleme" ></Stepper.Step>
      </Stepper>
       
      </Modal>
    </>
  );
};

export default AddProduct;
