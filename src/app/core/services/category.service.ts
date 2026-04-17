import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Observable, from, map } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private supabase = inject(SupabaseService).client;

  getCategories(): Observable<Category[]> {
    return from(
      this.supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(this.mapCategory);
      })
    );
  }

  getActiveCategories(): Observable<Category[]> {
    return from(
      this.supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(this.mapCategory);
      })
    );
  }

  async addCategory(category: Omit<Category, 'id'>): Promise<string> {
    const { data, error } = await this.supabase
      .from('categories')
      .insert({
        name: category.name,
        name_marathi: category.nameMarathi,
        description: category.description,
        image: category.image,
        display_order: category.order,
        active: category.active,
      })
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<void> {
    const updateData: any = {};
    if (category.name !== undefined) updateData.name = category.name;
    if (category.nameMarathi !== undefined) updateData.name_marathi = category.nameMarathi;
    if (category.description !== undefined) updateData.description = category.description;
    if (category.image !== undefined) updateData.image = category.image;
    if (category.order !== undefined) updateData.display_order = category.order;
    if (category.active !== undefined) updateData.active = category.active;

    const { error } = await this.supabase
      .from('categories')
      .update(updateData)
      .eq('id', id);
    if (error) throw error;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  private mapCategory(row: any): Category {
    return {
      id: row.id,
      name: row.name,
      nameMarathi: row.name_marathi,
      description: row.description,
      image: row.image,
      order: row.display_order,
      active: row.active,
    };
  }
}
