import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (type === 'product-card') {
      <div class="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div class="aspect-square bg-gray-200 animate-pulse"></div>
        <div class="p-4 space-y-3">
          <div class="h-3 bg-gray-200 rounded-full w-1/3 animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse"></div>
          <div class="h-5 bg-gray-200 rounded-full w-1/2 animate-pulse"></div>
        </div>
      </div>
    }

    @if (type === 'product-detail') {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 rounded-full w-1/4 animate-pulse"></div>
          <div class="h-8 bg-gray-200 rounded-full w-3/4 animate-pulse"></div>
          <div class="h-6 bg-gray-200 rounded-full w-1/3 animate-pulse"></div>
          <div class="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
          <div class="h-12 bg-gray-200 rounded-full w-1/2 animate-pulse"></div>
        </div>
      </div>
    }

    @if (type === 'text') {
      <div class="space-y-2">
        @for (_ of lines; track $index) {
          <div
            class="h-4 bg-gray-200 rounded-full animate-pulse"
            [style.width]="$index === lines.length - 1 ? '60%' : '100%'"
          ></div>
        }
      </div>
    }
  `,
})
export class SkeletonLoaderComponent {
  @Input() type: 'product-card' | 'product-detail' | 'text' = 'product-card';
  @Input() count = 3;

  get lines(): number[] {
    return Array.from({ length: this.count });
  }
}
