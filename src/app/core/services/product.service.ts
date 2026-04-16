import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private firestore = inject(Firestore);
  private collectionName = 'products';

  getAll(): Observable<Product[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  getById(id: string): Observable<Product> {
    const ref = doc(this.firestore, this.collectionName, id);
    return docData(ref, { idField: 'id' }) as Observable<Product>;
  }

  getByCategory(categoryId: string): Observable<Product[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, where('category', '==', categoryId), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  getFeatured(): Observable<Product[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, where('featured', '==', true), where('inStock', '==', true));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  search(queryStr: string): Observable<Product[]> {
    // Firestore does not support full-text search natively.
    // We fetch all products and filter client-side.
    return this.getAll().pipe(
      map(products => {
        const lower = queryStr.toLowerCase();
        return products.filter(p =>
          p.nameEn.toLowerCase().includes(lower) ||
          p.nameHi.includes(queryStr) ||
          p.description.toLowerCase().includes(lower) ||
          p.material.toLowerCase().includes(lower)
        );
      })
    );
  }

  add(product: Product) {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, { ...product, createdAt: new Date(), updatedAt: new Date() });
  }

  update(id: string, product: Partial<Product>) {
    const ref = doc(this.firestore, this.collectionName, id);
    return updateDoc(ref, { ...product, updatedAt: new Date() });
  }

  delete(id: string) {
    const ref = doc(this.firestore, this.collectionName, id);
    return deleteDoc(ref);
  }
}
