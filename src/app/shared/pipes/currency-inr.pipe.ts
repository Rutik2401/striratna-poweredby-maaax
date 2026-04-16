import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyInr',
  standalone: true,
})
export class CurrencyInrPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || isNaN(value)) {
      return '₹0';
    }
    const formatted = value.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    return `₹${formatted}`;
  }
}
