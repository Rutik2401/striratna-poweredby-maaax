import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonType = 'product-card' | 'product-detail' | 'text';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
})
export class SkeletonLoaderComponent {
  readonly type = input<SkeletonType>('product-card');
  readonly count = input<number>(3);

  readonly lines = computed(() => Array.from({ length: this.count() }));
}
