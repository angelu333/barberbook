const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export async function uploadImage(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Faltan las variables de entorno de Cloudinary')
  }

  try {
    // Validar el tamaño del archivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen no debe superar los 5MB')
    }

    // Validar el tipo de archivo
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error de Cloudinary:', errorData)
      throw new Error(errorData.error?.message || 'Error al subir la imagen')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Error al subir imagen:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Error al subir la imagen')
  }
} 