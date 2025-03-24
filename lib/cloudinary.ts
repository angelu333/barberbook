const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export const uploadImage = async (file: File) => {
  try {
    // Validar tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('El archivo es demasiado grande. El tamaño máximo es 5MB.')
    }

    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG, GIF y WebP.')
    }

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Faltan las variables de entorno de Cloudinary')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

    console.log('Iniciando subida a Cloudinary...')
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
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
    console.log('Imagen subida exitosamente:', data.secure_url)
    return data.secure_url
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error)
    throw error
  }
} 