export interface BrandSettings {
  id: number;
  whatsappNumber: string;
  instagramUrl: string | null;
  contactEmail: string | null;
  address: string | null;
  freeDeliveryThreshold: number;
  deliveryCharge: number;
  inquiryMessage: string | null;
  updatedAt: Date;
}

export type BrandSettingsUpdate = Partial<
  Omit<BrandSettings, 'id' | 'updatedAt'>
>;
