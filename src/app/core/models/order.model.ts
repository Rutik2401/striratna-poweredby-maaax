export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id?: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  status: 'pending' | 'packed' | 'dispatched' | 'delivered';
  orderDate?: any;
  updatedAt?: any;
  whatsappSent: boolean;
}
