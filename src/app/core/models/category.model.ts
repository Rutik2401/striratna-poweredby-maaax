export interface Category {
  id: string;
  name: string;
  nameMarathi?: string;
  description?: string;
  image?: string;
  order: number;
  active: boolean;
  productCount?: number;
}
