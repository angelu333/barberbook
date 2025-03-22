import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadImage(file: File, userId: string): Promise<string> {
  try {
    const extension = file.name.split('.').pop()
    const storageRef = ref(storage, `profile-images/${userId}.${extension}`)
    
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    
    return downloadURL
  } catch (error) {
    console.error('Error al subir imagen:', error)
    throw new Error('Error al subir la imagen')
  }
} 