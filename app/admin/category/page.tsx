"use client"
import { Box, Container, Title } from '@mantine/core'
import React from 'react'
import { CategoryList } from './categorylist'

const page = () => {
  return (
   <Container mt='lg' size="xl" >
    
      <Box mb='md'>
          <Title order={3} size="h1">
            H3 heading with h1 font-size
          </Title>
        </Box>
        <CategoryList />
    </Container>
  )
}

export default page