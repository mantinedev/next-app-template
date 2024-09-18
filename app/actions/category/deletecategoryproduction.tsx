"use server";

import { cookies } from "next/headers";

export async function deletecategory(formData:any){
   const id= formData.get('id');
   const cookie =cookies();
   const token= cookie.get('Authorization')?.value;
   try{
      const response = await fetch('http://localhost:3000/api/category', {
         method:'DELETE',
         headers:{
            'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
         },
         body:JSON.stringify({id})
   });
   const endResponse = JSON.parse(await response.text());
   if (response.ok) {
     return {
       message: endResponse.message,
     };
   } else {
     return {
       message: endResponse.message,
     };
   }
 } catch (error) {
   return {};
 }
}