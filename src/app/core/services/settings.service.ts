import { Injectable, computed, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BrandSettings, BrandSettingsUpdate } from '../models/brand-settings.model';
import { environment } from '../../environments/environment';

/**
 * Brand-wide settings loaded once from `brand_settings` (single-row table).
 * Admin edits live here — no rebuild/redeploy required.
 * Falls back to `environment.ts` values if the row is missing or the fetch fails.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly supabase = inject(SupabaseService).client;

  private readonly settings = signal<BrandSettings | null>(null);
  private readonly loading = signal(true);

  readonly isLoading = this.loading.asReadonly();
  readonly ready: Promise<void>;

  readonly whatsappNumber = computed(
    () => this.settings()?.whatsappNumber ?? environment.whatsappNumber
  );
  readonly instagramUrl = computed(
    () => this.settings()?.instagramUrl ?? 'https://instagram.com/'
  );
  readonly contactEmail = computed(
    () => this.settings()?.contactEmail ?? 'contact@striratna.in'
  );
  readonly address = computed(
    () => this.settings()?.address ?? 'Pune, Maharashtra'
  );
  readonly freeDeliveryThreshold = computed(
    () => this.settings()?.freeDeliveryThreshold ?? 999
  );
  readonly deliveryCharge = computed(
    () => this.settings()?.deliveryCharge ?? 99
  );
  readonly inquiryMessage = computed(
    () =>
      this.settings()?.inquiryMessage ??
      `Hi! I'd like to know more about ${environment.brandName} jewellery.`
  );

  readonly current = this.settings.asReadonly();

  constructor() {
    this.ready = this.load();
  }

  async refresh(): Promise<void> {
    await this.load();
  }

  async update(patch: BrandSettingsUpdate): Promise<BrandSettings> {
    const { data, error } = await this.supabase
      .from('brand_settings')
      .update(this.toRow(patch))
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    const mapped = this.mapRow(data);
    this.settings.set(mapped);
    return mapped;
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('brand_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        this.settings.set(this.mapRow(data));
      }
    } catch (err) {
      console.warn('[SettingsService] Using env fallback:', err);
    } finally {
      this.loading.set(false);
    }
  }

  private mapRow(row: any): BrandSettings {
    return {
      id: row.id,
      whatsappNumber: row.whatsapp_number,
      instagramUrl: row.instagram_url,
      contactEmail: row.contact_email,
      address: row.address,
      freeDeliveryThreshold: Number(row.free_delivery_threshold) || 999,
      deliveryCharge: Number(row.delivery_charge) || 99,
      inquiryMessage: row.inquiry_message,
      updatedAt: new Date(row.updated_at),
    };
  }

  private toRow(patch: BrandSettingsUpdate): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    if (patch.whatsappNumber !== undefined) row['whatsapp_number'] = patch.whatsappNumber;
    if (patch.instagramUrl !== undefined) row['instagram_url'] = patch.instagramUrl;
    if (patch.contactEmail !== undefined) row['contact_email'] = patch.contactEmail;
    if (patch.address !== undefined) row['address'] = patch.address;
    if (patch.freeDeliveryThreshold !== undefined)
      row['free_delivery_threshold'] = patch.freeDeliveryThreshold;
    if (patch.deliveryCharge !== undefined) row['delivery_charge'] = patch.deliveryCharge;
    if (patch.inquiryMessage !== undefined) row['inquiry_message'] = patch.inquiryMessage;
    return row;
  }
}
