import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent)
  },
  {
    path: 'shop/:category',
    loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  // Admin Routes
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [() => import('./core/guards/auth.guard').then(m => m.authGuard)]
  },
  {
    path: 'admin/orders',
    loadComponent: () => import('./admin/manage-orders/manage-orders.component').then(m => m.ManageOrdersComponent),
    canActivate: [() => import('./core/guards/auth.guard').then(m => m.authGuard)]
  },
  {
    path: 'admin/products',
    loadComponent: () => import('./admin/manage-products/manage-products.component').then(m => m.ManageProductsComponent),
    canActivate: [() => import('./core/guards/auth.guard').then(m => m.authGuard)]
  },
  {
    path: 'admin/categories',
    loadComponent: () => import('./admin/manage-categories/manage-categories.component').then(m => m.ManageCategoriesComponent),
    canActivate: [() => import('./core/guards/auth.guard').then(m => m.authGuard)]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
