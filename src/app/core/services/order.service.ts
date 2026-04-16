import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private firestore = inject(Firestore);
  private collectionName = 'orders';

  create(order: Order) {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, {
      ...order,
      orderDate: new Date(),
      updatedAt: new Date()
    });
  }

  getAll(): Observable<Order[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, orderBy('orderDate', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  getById(id: string): Observable<Order> {
    const ref = doc(this.firestore, this.collectionName, id);
    return docData(ref, { idField: 'id' }) as Observable<Order>;
  }

  updateStatus(id: string, status: Order['status']) {
    const ref = doc(this.firestore, this.collectionName, id);
    return updateDoc(ref, { status, updatedAt: new Date() });
  }

  generateOrderNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `SR-${year}${month}${day}-${random}`;
  }
}
