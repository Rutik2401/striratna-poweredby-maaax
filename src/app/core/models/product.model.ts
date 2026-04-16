export interface Product {
  id?: string;
  nameEn: string;
  nameHi: string;
  category: string;
  price: number;
  mrp: number;
  material: string;
  description: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  createdAt?: any;
  updatedAt?: any;
}
