export interface Product {
  id: string;
  name: string;
  nameMarathi?: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  categoryId: string;
  categoryName?: string;
  tags?: string[];
  inStock: boolean;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  weight?: string;
  material?: string;
  dimensions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  categoryId?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
  inStockOnly?: boolean;
}
