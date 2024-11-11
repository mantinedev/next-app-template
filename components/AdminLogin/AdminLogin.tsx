import { Button } from '@mantine/core'
import { IconLogin } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'
import classes from './AdminLogin.module.css';
import { logout } from '@/app/actions/login/logoutuser';

const AdminLogin:React.FC = () => {
  const handleLogout = async () => {
    await logout()
  }
  return (
    <>

     <Link onClick={handleLogout} className={classes.loginlogo} href="/login" >
     <IconLogin style={{ width: '15px' }} />
            </Link>
    </>
  )
}

export default AdminLogin