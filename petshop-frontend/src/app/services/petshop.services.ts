import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNwrQoGanvwszAfk42dG7g1gBRp8iAaMg",
  authDomain: "tapwebmobile.firebaseapp.com",
  projectId: "tapwebmobile",
  storageBucket: "tapwebmobile.firebasestorage.app",
  messagingSenderId: "63177880078",
  appId: "1:63177880078:web:342805778c8cc9dad7025f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class PetshopService {
  
  async getPetshops() {
    const petshopsRef = collection(db, 'petshops');
    const q = query(petshopsRef, orderBy('nome'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}