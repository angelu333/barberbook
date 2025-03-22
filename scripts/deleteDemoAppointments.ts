import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCkSf7YGbIpEs3EhtW_iTBBSbBQqZ2mfYY",
  authDomain: "barbernuevaa.firebaseapp.com",
  projectId: "barbernuevaa",
  storageBucket: "barbernuevaa.appspot.com",
  messagingSenderId: "94523008032",
  appId: "1:94523008032:web:ea4ad0d2956de49d7b8845"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function deleteDemoAppointments() {
  try {
    const appointmentsRef = collection(db, 'appointments')
    const querySnapshot = await getDocs(appointmentsRef)
    
    const deletePromises = querySnapshot.docs.map(doc => {
      const data = doc.data()
      // Verificar si es una cita de ejemplo (cliente1, cliente2, etc.)
      if (data.clientName && data.clientName.toLowerCase().startsWith('cliente')) {
        console.log(`Eliminando cita de ${data.clientName}...`)
        return deleteDoc(doc.ref)
      }
      return null
    }).filter(Boolean)

    await Promise.all(deletePromises)
    console.log('Citas de ejemplo eliminadas correctamente')
  } catch (error) {
    console.error('Error al eliminar las citas:', error)
  }
}

deleteDemoAppointments() 