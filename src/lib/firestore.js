// src/lib/firestore.js
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from './firebase'

export async function getProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'))
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getFeaturedProducts() {
  try {
    const q = query(
      collection(db, 'products'),
      where('featured', '==', true),
      limit(8)
    )
    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return products
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export async function getProduct(id) {
  try {
    const docRef = doc(db, 'products', id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

