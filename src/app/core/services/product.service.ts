import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Observable, from, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private supabase = inject(SupabaseService).client;

  getProducts(): Observable<Product[]> {
    return from(
      this.supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(this.mapProduct);
      })
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return from(
      this.supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) return undefined;
        return data ? this.mapProduct(data) : undefined;
      })
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return from(
      this.supabase
        .from('products')
        .select('*, categories(name)')
        .eq('featured', true)
        .eq('in_stock', true)
        .limit(8)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(this.mapProduct);
      })
    );
  }

  getBestSellers(): Observable<Product[]> {
    return from(
      this.supabase
        .from('products')
        .select('*, categories(name)')
        .eq('best_seller', true)
        .eq('in_stock', true)
        .limit(8)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(this.mapProduct);
      })
    );
  }

  getNewArrivals(): Observable<Product[]> {
    return from(
      this.supabase
        .from('products')
        .select('*, categories(name)')
        .eq('new_arrival', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(8)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(this.mapProduct);
      })
    );
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return from(
      this.supabase
        .from('products')
        .select('*, categories(name)')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(this.mapProduct);
      })
    );
  }

  searchProducts(searchQuery: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) =>
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )
    );
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const { data, error } = await this.supabase
      .from('products')
      .insert({
        name: product.name,
        name_marathi: product.nameMarathi,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice,
        images: product.images,
        category_id: product.categoryId,
        tags: product.tags,
        in_stock: product.inStock,
        featured: product.featured,
        best_seller: product.bestSeller,
        new_arrival: product.newArrival,
        weight: product.weight,
        material: product.material,
        dimensions: product.dimensions,
      })
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const updateData: any = {};
    if (product.name !== undefined) updateData.name = product.name;
    if (product.nameMarathi !== undefined) updateData.name_marathi = product.nameMarathi;
    if (product.description !== undefined) updateData.description = product.description;
    if (product.price !== undefined) updateData.price = product.price;
    if (product.originalPrice !== undefined) updateData.original_price = product.originalPrice;
    if (product.images !== undefined) updateData.images = product.images;
    if (product.categoryId !== undefined) updateData.category_id = product.categoryId;
    if (product.tags !== undefined) updateData.tags = product.tags;
    if (product.inStock !== undefined) updateData.in_stock = product.inStock;
    if (product.featured !== undefined) updateData.featured = product.featured;
    if (product.bestSeller !== undefined) updateData.best_seller = product.bestSeller;
    if (product.newArrival !== undefined) updateData.new_arrival = product.newArrival;
    if (product.weight !== undefined) updateData.weight = product.weight;
    if (product.material !== undefined) updateData.material = product.material;
    if (product.dimensions !== undefined) updateData.dimensions = product.dimensions;

    const { error } = await this.supabase
      .from('products')
      .update(updateData)
      .eq('id', id);
    if (error) throw error;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  private mapProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      nameMarathi: row.name_marathi,
      description: row.description,
      price: row.price,
      originalPrice: row.original_price,
      images: row.images || [],
      categoryId: row.category_id,
      categoryName: row.categories?.name,
      tags: row.tags || [],
      inStock: row.in_stock,
      featured: row.featured,
      bestSeller: row.best_seller,
      newArrival: row.new_arrival,
      weight: row.weight,
      material: row.material,
      dimensions: row.dimensions,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
