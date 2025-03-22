const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET || '')
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Error al subir la imagen')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Error al subir imagen:', error)
    throw new Error('Error al subir la imagen')
  }
} 