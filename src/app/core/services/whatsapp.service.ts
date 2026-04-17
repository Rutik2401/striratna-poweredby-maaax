import { Injectable, inject } from '@angular/core';
import { CartItem } from './cart.service';
import { SettingsService } from './settings.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private readonly settings = inject(SettingsService);

  generateOrderMessage(
    items: CartItem[],
    customerName: string,
    address: string,
    totalAmount: number
  ): string {
    let message = `🛍️ *New Order - ${environment.brandName}*\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
    message += `👤 *Customer:* ${customerName}\n`;
    message += `📍 *Address:* ${address}\n\n`;
    message += `📦 *Order Details:*\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}\n`;
      message += `   Subtotal: ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *Total: ₹${totalAmount.toLocaleString('en-IN')}*\n\n`;
    message += `Thank you for shopping with ${environment.brandName}! 🙏`;

    return message;
  }

  generateProductInquiry(productName: string, productPrice: number): string {
    return `Hi! I'm interested in *${productName}* (₹${productPrice.toLocaleString('en-IN')}) from ${environment.brandName}. Please share more details. 🙏`;
  }

  openWhatsApp(message: string): void {
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${this.settings.whatsappNumber()}?text=${encoded}`;
    window.open(url, '_blank');
  }

  sendOrder(items: CartItem[], customerName: string, address: string, total: number): void {
    const message = this.generateOrderMessage(items, customerName, address, total);
    this.openWhatsApp(message);
  }

  sendInquiry(productName: string, productPrice: number): void {
    const message = this.generateProductInquiry(productName, productPrice);
    this.openWhatsApp(message);
  }
}
