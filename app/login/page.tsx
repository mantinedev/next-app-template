import { Container } from '@mantine/core'
import React from 'react'
import { LoginOperation } from './login'

const Page:React.FC = () => {
  return (
    <Container size='xl'>
              <LoginOperation/>
    </Container>
  )
}

export default Page