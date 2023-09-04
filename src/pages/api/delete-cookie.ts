'use server'
 
import { cookies } from 'next/headers'
 
async function create(data: any) {
  cookies().delete('encryptedObject')
}