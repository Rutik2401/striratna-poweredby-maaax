import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private firestore = inject(Firestore);
  private collectionName = 'categories';

  getAll(): Observable<Category[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, orderBy('order', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Category[]>;
  }

  add(category: Category) {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, { ...category });
  }

  update(id: string, category: Partial<Category>) {
    const ref = doc(this.firestore, this.collectionName, id);
    return updateDoc(ref, { ...category });
  }

  delete(id: string) {
    const ref = doc(this.firestore, this.collectionName, id);
    return deleteDoc(ref);
  }
}
