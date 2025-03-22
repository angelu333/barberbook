import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebase'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function uploadImage(file: File, userId: string): Promise<string> {
  try {
    // Validar tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('El archivo es demasiado grande. El tamaño máximo es 5MB.')
    }

    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Use JPG, PNG o WebP.')
    }

    // Generar nombre único para el archivo
    const extension = file.type.split('/')[1]
    const fileName = `${userId}_${Date.now()}.${extension}`
    const storageRef = ref(storage, `profile-images/${userId}/${fileName}`)
    
    // Subir archivo
    const snapshot = await uploadBytes(storageRef, file)
    console.log('Archivo subido exitosamente')
    
    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error: any) {
    console.error('Error al subir imagen:', error)
    if (error.code === 'storage/unauthorized') {
      throw new Error('No tienes permiso para subir archivos')
    }
    throw error
  }
} 