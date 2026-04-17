import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SettingsService } from '../../core/services/settings.service';
import { BrandSettingsUpdate } from '../../core/models/brand-settings.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';
import { ToastService } from '../../shared/services/toast.service';

interface SettingsForm {
  whatsappNumber: string;
  instagramUrl: string;
  contactEmail: string;
  address: string;
  freeDeliveryThreshold: number;
  deliveryCharge: number;
  inquiryMessage: string;
}

const EMPTY_FORM: SettingsForm = {
  whatsappNumber: '',
  instagramUrl: '',
  contactEmail: '',
  address: '',
  freeDeliveryThreshold: 999,
  deliveryCharge: 99,
  inquiryMessage: '',
};

@Component({
  selector: 'app-manage-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, DatePipe, CurrencyInrPipe],
  templateUrl: './manage-settings.component.html',
  styleUrl: './manage-settings.component.scss',
})
export class ManageSettingsComponent implements OnInit {
  private readonly settings = inject(SettingsService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);
  readonly loading = this.settings.isLoading;
  readonly current = this.settings.current;
  readonly dirty = signal(false);

  // Mutable form state + mirror signal for reactivity in computeds
  form: SettingsForm = { ...EMPTY_FORM };
  private readonly formSignal = signal<SettingsForm>({ ...EMPTY_FORM });

  readonly whatsappDigits = computed(() =>
    this.formSignal().whatsappNumber.replace(/\D/g, '')
  );

  readonly whatsappValid = computed(() => {
    const d = this.whatsappDigits();
    return d.length >= 10 && d.length <= 15;
  });

  readonly whatsappFormatted = computed(() => {
    const d = this.whatsappDigits();
    if (d.length < 10) return '—';
    if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
    // With country code (12 digits for India: 91 + 10)
    const cc = d.slice(0, d.length - 10);
    const rest = d.slice(d.length - 10);
    return `+${cc} ${rest.slice(0, 5)} ${rest.slice(5)}`;
  });

  readonly whatsappPreviewUrl = computed(() => {
    const text = encodeURIComponent(
      this.formSignal().inquiryMessage || 'Hi!'
    );
    return `https://wa.me/${this.whatsappDigits()}?text=${text}`;
  });

  readonly emailValid = computed(() => {
    const email = this.formSignal().contactEmail.trim();
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  });

  readonly instagramValid = computed(() => {
    const url = this.formSignal().instagramUrl.trim();
    if (!url) return true;
    return /^https?:\/\/(www\.)?instagram\.com\//i.test(url);
  });

  readonly instagramHandle = computed(() => {
    const url = this.formSignal().instagramUrl.trim();
    const match = url.match(/instagram\.com\/([^/?#]+)/i);
    return match?.[1] ?? '';
  });

  readonly deliveryValid = computed(() => {
    const f = this.formSignal();
    return (
      Number(f.freeDeliveryThreshold) >= 0 &&
      Number(f.deliveryCharge) >= 0
    );
  });

  readonly formValid = computed(
    () =>
      this.whatsappValid() &&
      this.emailValid() &&
      this.instagramValid() &&
      this.deliveryValid()
  );

  readonly lastSaved = computed(() => this.current()?.updatedAt ?? null);

  readonly dbReady = computed(() => this.current() !== null);

  async ngOnInit(): Promise<void> {
    await this.settings.ready;
    this.hydrate();
  }

  onInput(): void {
    this.dirty.set(true);
    this.syncForm();
  }

  async save(): Promise<void> {
    this.syncForm();

    if (!this.whatsappValid()) {
      this.toast.error('WhatsApp number invalid', 'Include country code — 10 to 15 digits.');
      return;
    }
    if (!this.emailValid()) {
      this.toast.error('Email invalid', 'Enter a valid email address or leave it blank.');
      return;
    }
    if (!this.instagramValid()) {
      this.toast.error('Instagram URL invalid', 'Must start with https://instagram.com/');
      return;
    }
    if (!this.deliveryValid()) {
      this.toast.error('Delivery values invalid', 'Amounts cannot be negative.');
      return;
    }
    if (this.saving() || !this.dirty()) return;

    this.saving.set(true);
    try {
      const patch: BrandSettingsUpdate = {
        whatsappNumber: this.whatsappDigits(),
        instagramUrl: this.form.instagramUrl.trim() || null,
        contactEmail: this.form.contactEmail.trim() || null,
        address: this.form.address.trim() || null,
        freeDeliveryThreshold: Number(this.form.freeDeliveryThreshold) || 0,
        deliveryCharge: Number(this.form.deliveryCharge) || 0,
        inquiryMessage: this.form.inquiryMessage.trim() || null,
      };
      await this.settings.update(patch);
      this.dirty.set(false);
      this.toast.success('Settings saved', 'Customer-facing values are now live.');
      this.hydrate();
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : 'Check your Supabase connection and try again.';
      this.toast.error('Could not save settings', message);
    } finally {
      this.saving.set(false);
    }
  }

  discard(): void {
    if (!this.dirty()) return;
    if (!confirm('Discard your changes? Unsaved edits will be lost.')) return;
    this.hydrate();
    this.dirty.set(false);
    this.toast.info('Changes discarded');
  }

  async refresh(): Promise<void> {
    await this.settings.refresh();
    this.hydrate();
    this.dirty.set(false);
    this.toast.info('Settings reloaded from the database');
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    // Ctrl / Cmd + S → save
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      if (this.dirty() && this.formValid() && !this.saving()) {
        void this.save();
      }
    }
    // Escape → discard
    if (event.key === 'Escape' && this.dirty()) {
      event.preventDefault();
      this.discard();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(e: BeforeUnloadEvent): void {
    if (this.dirty()) {
      e.preventDefault();
      e.returnValue = '';
    }
  }

  private hydrate(): void {
    const s = this.current();
    const next: SettingsForm = s
      ? {
          whatsappNumber: s.whatsappNumber || '',
          instagramUrl: s.instagramUrl || '',
          contactEmail: s.contactEmail || '',
          address: s.address || '',
          freeDeliveryThreshold: s.freeDeliveryThreshold,
          deliveryCharge: s.deliveryCharge,
          inquiryMessage: s.inquiryMessage || '',
        }
      : { ...EMPTY_FORM };
    this.form = next;
    this.formSignal.set({ ...next });
  }

  private syncForm(): void {
    this.formSignal.set({ ...this.form });
  }
}
