"use client"
import { TextInput, PasswordInput, Paper, Title, Container, Button } from '@mantine/core';
import classes from './login.module.css';
import { useFormState } from 'react-dom';
import { loginUser } from '../actions/login/loginuser';

const initialState = {
  message: '',
};

export function LoginOperation() {
  const [state, formAction] = useFormState(loginUser, initialState);
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Hoşgeldiniz!
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form action={formAction}>
          <TextInput id="email" name="email" label="E-Posta" placeholder="can@makettech.dev" required />
          <PasswordInput  id="password" name="password" label="Şifre" placeholder="Şifreniz" required mt="md" />
          <PasswordInput id="repassword" name="repassword" label="Şifre Tekrar" placeholder="Şifreniz" required mt="md" />
          <p aria-live="polite">{state?.message}</p>
          <Button type='submit' fullWidth mt="xl">
            Giriş Yap
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
