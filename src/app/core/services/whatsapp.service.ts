import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WhatsAppService {
  private whatsappNumber = environment.whatsappNumber;

  buildOrderMessage(order: Order): string {
    const itemLines = order.items
      .map(item => `- ${item.productName} x${item.quantity} = Rs.${item.price * item.quantity}`)
      .join('\n');

    return [
      `*New Order - ${order.orderNumber}*`,
      ``,
      `*Customer:* ${order.customer.name}`,
      `*Phone:* ${order.customer.phone}`,
      `*Address:* ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`,
      ``,
      `*Items:*`,
      itemLines,
      ``,
      `*Subtotal:* Rs.${order.subtotal}`,
      `*Delivery:* Rs.${order.deliveryCharge}`,
      `*Total:* Rs.${order.totalAmount}`,
      ``,
      `Thank you for shopping with StreeRatna!`
    ].join('\n');
  }

  buildProductInquiry(product: Product): string {
    return [
      `Hi, I'm interested in the following product:`,
      ``,
      `*${product.nameEn}* (${product.nameHi})`,
      `*Material:* ${product.material}`,
      `*Price:* Rs.${product.price}`,
      ``,
      `Please share more details.`
    ].join('\n');
  }

  sendViaWhatsApp(message: string): void {
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${this.whatsappNumber}?text=${encoded}`;
    window.open(url, '_blank');
  }
}
