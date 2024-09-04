import { Button } from '@mantine/core'
import { IconLogin } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'
import classes from './AdminLogin.module.css';

const AdminLogin:React.FC = () => {
  return (
    <>

     <Link className={classes.loginlogo} href="/login" >
     <IconLogin style={{ width: '15px' }} />
            </Link>
    </>
  )
}

export default AdminLogin