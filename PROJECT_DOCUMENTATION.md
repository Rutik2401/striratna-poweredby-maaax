# Project Documentation
# स्त्रीरत्न - Powered by Maaax
## 1gm Art Jewellery E-Commerce Website
### "साज महाराष्ट्राचा" - The Adornment of Maharashtra

---

## 1. Project Overview

| Field | Details |
|-------|---------|
| **Brand Name** | स्त्रीरत्न (StriRatna) - Powered by Maaax |
| **Meaning** | "Jewel of Women" |
| **Tagline** | "साज महाराष्ट्राचा" (The Adornment of Maharashtra) |
| **Brand Identity** | सुवर्ण उद्योगातील पहिले यशस्वी मराठी पाऊल (First successful Marathi step in the gold industry) |
| **Industry** | 1gm Art Jewellery - Luxury Look, Smart Price |
| **Location** | Shop No. 1/1, Sai Sharan Complex, Pune-Solapur Road, Hadapsar, Pune - 411028, Maharashtra |
| **Phone** | 9579 39 3985 |
| **Instagram** | @striratna_poweredby_maaax (17.8K+ followers, 24 posts) |
| **Parent Brand** | Maaax (@maaax_wholesaler on Instagram) |
| **Google Maps** | maps.app.goo.gl/JuVUzSqivruwccq7A |
| **Current Sales Channel** | Instagram DMs and direct walk-in at Hadapsar shop |
| **Project Type** | E-Commerce Website |
| **Tech Stack** | Angular + Firebase (No Backend Needed) |
| **Total Cost** | Rs.0 (Free tier services only) |

### About the brand

StriRatna is a Pune-based 1gm art jewellery brand. The name means "Jewel of Women" and the tagline "साज महाराष्ट्राचा" means "The Adornment of Maharashtra". They position themselves as the first successful Marathi step in the gold jewellery industry. The brand is powered by Maaax, which is the parent wholesale business (@maaax_wholesaler on Instagram). They sell 1gm art jewellery which means gold-plated jewellery that looks premium but is affordable. The brand already has over 17,800 followers on Instagram with just 24 posts, which shows there is strong demand and customer interest. They also have a physical shop in Hadapsar, Pune. Their launch offer was free delivery for the first 1000 customers.

---

## 2. Problem Statement

### What is happening right now

The brand has a physical shop in Hadapsar, Pune and is also selling through Instagram DMs. On Instagram alone, there are more than 1000 messages coming in every day. With 17.8K followers and growing, the volume keeps increasing. The team is small and they simply cannot reply to everyone. Because of this, orders are getting delayed, some are completely lost. There is no proper system to track which order is pending, which one is packed, which one is dispatched. Customers keep asking the same questions again and again - "What designs do you have?", "Price kitna hai?", "How to order?", "Delivery charge?" The phone number 9579 39 3985 also gets flooded with calls and WhatsApp messages asking the same repeated questions.

### What this is causing

- Sales are being lost because messages go unanswered
- Customers are getting frustrated and moving on
- The team is exhausted from handling DMs all day
- Without order tracking, deliveries are getting missed
- The brand's reputation is slowly getting damaged

---

## 3. What we are building

A free, mobile-first e-commerce website for StriRatna's 1gm art jewellery. The idea is simple - put all the products on a website with images and prices so customers can browse on their own. They pick what they want, fill in their details, and the order goes directly to the business WhatsApp (9579 39 3985) as a clean formatted message. No more back and forth in DMs. The website link can be put in the Instagram bio where 17.8K+ followers already visit regularly.

For the admin side, there will be a dashboard where the team can add or remove products, track all orders from pending to delivered, and see daily sales numbers. Everything accessible from phone or laptop. This also helps the physical shop in Hadapsar since walk-in customers can be directed to the website to browse and order later.

---

## 4. How this fixes the problem

### Message reduction - before and after

| What customers keep asking | Messages per day (now) | After website goes live |
|---|---|---|
| "What designs do you have?" | around 300 | 0 - everything is on the website |
| "Price kya hai?" | around 250 | 0 - price shown on every product |
| "How to order?" | around 200 | 0 - they order through the site |
| "Delivery charge kitna hai?" | around 100 | 0 - mentioned on the website |
| "Mera order kab aayega?" | around 100 | 0 - admin tracks orders internally |
| Actual purchase orders | 50-100 | 50-100 - but now as structured WhatsApp messages |
| **Total messages team has to handle** | **1000+** | **around 50-100** |

### The real difference

| What changes | Before (Instagram DMs) | After (Website) |
|---|---|---|
| Messages to handle daily | 1000+ | around 50-100 |
| Information per order | Scattered across 5-6 messages | 1 clean WhatsApp message with everything |
| Time spent per order | 10-15 minutes of back and forth | 1-2 minutes to just confirm |
| Missed orders | Happens regularly | Should not happen anymore |
| Order tracking | Nothing, all in head | Full dashboard with status updates |
| People needed for DMs | 5-6 people | 1-2 people can manage |

---

## 5. Tech Stack

> **Important Note - No separate backend server is needed for this project.**
>
> We are using Firebase which is a Backend-as-a-Service (BaaS). It handles database, authentication, file storage, and hosting - all the things a traditional backend would do. The Angular app talks directly to Firebase. There is no need to build or maintain a Node.js, Express, or any other server.
>
> **Why this works without a backend:**
> - No online payment processing (orders go via WhatsApp, so no server-side payment verification needed)
> - No server-side rendering required (Angular SPA is enough for a product catalog)
> - No heavy business logic on server (cart runs in browser localStorage, orders write directly to Firestore)
> - Security is handled by Firestore Security Rules (only authenticated admin can modify products and orders)
> - Image uploads go directly to Firebase Storage from the browser
>
> **When would we need a backend in the future:**
> - If we add Razorpay or UPI payments (payment verification must happen on server - can use Firebase Cloud Functions for this)
> - If we want automatic SMS notifications when order status changes
> - If we move to WhatsApp Business API for auto-replies and bulk messages
>
> For now and for the scope of this project, Angular + Firebase is the complete stack. No backend server to build, deploy, or pay for.

| Layer | Technology | What it does | Cost |
|-------|-----------|---------|------|
| Frontend Framework | Angular 17+ | The main app, component based, single page application | Rs.0 |
| Language | TypeScript | Type safety so there are fewer bugs in code | Rs.0 |
| UI Components | Angular Material | Pre-built UI components like buttons, cards, tables, dialogs | Rs.0 |
| Styling | SCSS | Custom styling with variables for the gold and maroon jewelry theme | Rs.0 |
| Database | Firebase Firestore | Stores all products, orders, categories data | Rs.0 |
| Authentication | Firebase Auth | Admin login using email and password | Rs.0 |
| Image Storage | Firebase Storage | Where product images are uploaded and served from | Rs.0 |
| Hosting | Firebase Hosting | Where the website lives, comes with global CDN | Rs.0 |
| Order System | WhatsApp Click-to-Chat | Free WhatsApp link that opens with pre-filled order message | Rs.0 |
| Backend Server | Not needed | Firebase covers everything | Rs.0 |
| **Total** | | | **Rs.0** |

### Firebase Free Tier - what we get and what we will use

| Resource | Free Limit | What we expect to use |
|----------|-----------|---|
| Firestore Reads | 50,000 per day | Around 5,000 per day |
| Firestore Writes | 20,000 per day | Around 500 per day |
| Storage | 5 GB | Around 1-2 GB for product images |
| Hosting Bandwidth | 10 GB per month | Around 2-3 GB per month |
| Authentication | Unlimited users | Just 1-2 admin users |

Plenty of room. We will not hit these limits for a long time.

---

## 6. Design Theme

| Element | Value |
|---------|-------|
| **Primary Color** | Gold (#D4AF37) |
| **Secondary Color** | Maroon or Deep Red (#800020) |
| **Background** | White (#FFFFFF) and Cream (#FFF8E7) |
| **Text Color** | Dark (#1A1A1A) |
| **Accent** | Rose Gold (#B76E79) |
| **Font for English text** | Playfair Display - an elegant serif font |
| **Font for Hindi text** | Noto Sans Devanagari |
| **Overall feel** | Premium, ethnic, trustworthy, feminine |
| **Design approach** | Mobile-first, clean layouts, big product images |

The whole look should feel like a premium 1gm art jewellery brand. Looking at the existing StriRatna branding from Instagram and their promotional material, the brand uses bold maroon/red backgrounds with gold text heavily. The logo itself is written in a stylized Devanagari script in red/maroon with a decorative element on top. Cream and white backgrounds keep the product images clean and visible. The banner style uses traditional Maharashtrian design elements. Product images should always be the hero of every page. The overall vibe should match what customers already see on their Instagram page so there is brand consistency.

---

## 7. Website Pages and Features

### 7.1 Customer Facing Pages (anyone can see these)

#### 7.1.1 Home Page
**Route:** `/`
**File:** `src/app/pages/home/home.component.ts`

This is the landing page. What it should have:
- A hero banner at the top with the StriRatna logo (the stylized Devanagari script with the red/maroon design) and the tagline "साज महाराष्ट्राचा"
- The line "सुवर्ण उद्योगातील पहिले यशस्वी मराठी पाऊल" somewhere visible
- A big "Shop Now" button
- Featured products section that pulls new arrivals automatically from Firestore
- Category cards with images (like Necklaces, Earrings, Bangles etc.)
- A "Why Choose Us" section highlighting quality, free delivery, etc.
- Some customer testimonials
- A link to the Instagram page
- Footer at the bottom with contact info, WhatsApp (9579 39 3985), Instagram (@striratna_poweredby_maaax), shop address in Hadapsar

#### 7.1.2 Shop Page (Product Catalog)
**Route:** `/shop` and `/shop/:category`
**File:** `src/app/pages/shop/shop.component.ts`

This is where all the products are displayed. Features:
- Grid view showing product image, name, and price
- Filter sidebar on the left side:
  - Filter by category (Necklaces, Earrings, Bangles, etc.)
  - Filter by price range (Under Rs.500, Rs.500-1000, etc.)
  - Filter by material (Gold Plated, Silver, Artificial, etc.)
- Sort options: Price low to high, Price high to low, Newest first
- A search bar to find products by name
- Pagination or infinite scroll as user scrolls down
- Quick "Add to Cart" button right on the product card itself

#### 7.1.3 Product Detail Page
**Route:** `/product/:id`
**File:** `src/app/pages/product-detail/product-detail.component.ts`

When someone clicks on a product, they come here. Shows:
- Large product image with zoom on hover or tap
- Product name in both English and Hindi
- Price with the MRP crossed out if there is a discount
- Material and description text
- Whether it is in stock or not
- Quantity selector (plus and minus buttons)
- "Add to Cart" button
- A section below showing related products from the same category
- A WhatsApp button saying "Ask about this product" for quick inquiry

#### 7.1.4 Cart Page
**Route:** `/cart`
**File:** `src/app/pages/cart/cart.component.ts`

The shopping cart page. Shows:
- List of all items added with their images
- Quantity update buttons (plus and minus)
- Remove item button
- Price breakdown showing subtotal, delivery charge (or FREE if above a certain amount), and total
- "Proceed to Checkout" button
- "Continue Shopping" link to go back to the shop

Cart data is saved in the browser localStorage so it stays even if the customer closes the tab and comes back.

#### 7.1.5 Checkout Page
**Route:** `/checkout`
**File:** `src/app/pages/checkout/checkout.component.ts`

This is the final step before placing the order. Has:
- Order summary showing all items and the total
- A form where the customer fills in:
  - Full Name (required)
  - Phone Number (required)
  - Email (optional)
  - Address Line 1 (required)
  - Address Line 2 (optional)
  - City (required)
  - State (required)
  - Pincode (required)
- A "Place Order via WhatsApp" button at the bottom
  - When clicked, it opens WhatsApp with a pre-written message that has all the order details
  - At the same time, the order is saved to Firestore so admin can track it

#### 7.1.6 Contact Page
**Route:** `/contact`
**File:** `src/app/pages/contact/contact.component.ts`

Simple contact page with:
- WhatsApp chat button
- Instagram profile link
- Business address
- Business hours
- An optional contact form (saves to Firestore if we add it)

#### 7.1.7 About Page
**Route:** `/about`
**File:** `src/app/pages/about/about.component.ts`

The brand story page:
- How the brand started
- Mission and vision
- Team photo if available
- Trust badges and quality assurance info

---

### 7.2 Admin Pages (only accessible after login)

All admin pages are protected by an AuthGuard. If someone tries to go to any admin URL without being logged in, they get redirected to the login page. The admin module is lazy loaded so it does not slow down the customer-facing site.

#### 7.2.1 Admin Login
**Route:** `/admin/login`
**File:** `src/app/admin/login/login.component.ts`

Simple login form:
- Email and password fields
- Uses Firebase Authentication
- On successful login, redirects to the dashboard
- Wrong credentials show an error message

#### 7.2.2 Admin Dashboard
**Route:** `/admin/dashboard`
**File:** `src/app/admin/dashboard/dashboard.component.ts`

The main admin home page. Shows at a glance:
- Stat cards at the top:
  - Total orders today
  - Revenue today
  - Pending orders count
  - Dispatched orders count
- A list of the 10 most recent orders
- Quick action buttons to jump to products or orders

#### 7.2.3 Manage Orders
**Route:** `/admin/orders`
**File:** `src/app/admin/manage-orders/manage-orders.component.ts`

Full order management page. Has:
- A table listing all orders with columns for:
  - Order ID
  - Customer name
  - Phone number
  - Items ordered
  - Total amount
  - Order date
  - Status (Pending, Packed, Dispatched, Delivered)
- Filter dropdown to show only orders of a certain status
- Search bar to find orders by customer name or phone number
- Click on any order row to see full details
- Status dropdown on each order to change it (Pending to Packed to Dispatched to Delivered)
- Export button to download all orders as CSV or Excel file

#### 7.2.4 Manage Products
**Route:** `/admin/products`
**File:** `src/app/admin/manage-products/manage-products.component.ts`

Where products are added, edited, and removed. Has:
- Table showing all existing products
- "Add New Product" button at the top
- The add/edit form has these fields:
  - Product Name in English
  - Product Name in Hindi
  - Category (dropdown list)
  - Selling Price in Rs.
  - MRP / Original Price (so we can show discount)
  - Material (Gold Plated, Silver, Artificial, etc.)
  - Description text
  - Image upload (goes to Firebase Storage)
  - Stock status toggle (In Stock or Out of Stock)
  - Featured toggle (Yes or No - featured ones show on homepage)
- Delete button with a confirmation dialog so nothing gets deleted by accident

#### 7.2.5 Manage Categories
**Route:** `/admin/categories`
**File:** `src/app/admin/manage-categories/manage-categories.component.ts`

Category management page:
- List of all categories
- Add new category, edit existing, or delete
- Upload category image
- Drag to reorder categories (changes display order on shop page)

---

## 8. Data Models (Firestore Collections)

These are the three main collections in our Firestore database. Each document in a collection follows the structure shown below.

### 8.1 Products Collection
**Firestore path:** `products/{productId}`
**Model file:** `src/app/core/models/product.model.ts`

```typescript
interface Product {
  id: string;                  // auto generated document ID
  nameEn: string;              // example: "1gm Gold Plated Necklace Set"
  nameHi: string;              // example: "१ ग्रॅम गोल्ड प्लेटेड नेकलेस सेट"
  category: string;            // references a category document ID
  price: number;               // selling price, example: 599
  mrp: number;                 // original price for showing discount, example: 999
  material: string;            // example: "1gm Gold Plated", "Silver", "Artificial"
  description: string;         // product details text
  images: string[];            // array of Firebase Storage download URLs
  inStock: boolean;            // true if available, false if sold out
  featured: boolean;           // true means show on homepage featured section
  createdAt: Timestamp;        // when product was added
  updatedAt: Timestamp;        // last time product was edited
}
```

### 8.2 Categories Collection
**Firestore path:** `categories/{categoryId}`
**Model file:** `src/app/core/models/category.model.ts`

```typescript
interface Category {
  id: string;                  // auto generated document ID
  nameEn: string;              // example: "Necklaces"
  nameHi: string;              // example: "नेकलेस / हार"
  image: string;               // category display image URL from Firebase Storage
  order: number;               // number to control display order on the website
  isActive: boolean;           // false to hide category without deleting it
}
```

### 8.3 Orders Collection
**Firestore path:** `orders/{orderId}`
**Model file:** `src/app/core/models/order.model.ts`

```typescript
interface Order {
  id: string;                  // auto generated document ID
  orderNumber: string;         // readable format like "SR-20260416-001"
  customer: {
    name: string;              // customer full name
    phone: string;             // customer phone number
    email?: string;            // optional email
    address: string;           // delivery address
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    productId: string;         // which product
    productName: string;       // name at the time of order
    price: number;             // price at the time of order
    quantity: number;          // how many
    image: string;             // product image URL
  }[];
  subtotal: number;            // total before delivery charge
  deliveryCharge: number;      // 0 if free delivery
  totalAmount: number;         // final amount customer pays
  status: 'pending' | 'packed' | 'dispatched' | 'delivered';
  orderDate: Timestamp;        // when order was placed
  updatedAt: Timestamp;        // last status change
  whatsappSent: boolean;       // whether WhatsApp message was sent successfully
}
```

---

## 9. Default Jewelry Categories

These are the categories we will set up when the site launches. More can be added anytime through the admin panel.

| No. | English | Hindi | Examples of what goes in here |
|---|---|---|---|
| 1 | Necklaces | नेकलेस / हार | Chokers, long necklaces, pendant sets |
| 2 | Earrings | कानातले / इयररिंग्स | Jhumkas, studs, drops, chandbalis |
| 3 | Bangles | बांगड्या | Traditional bangles, modern designs, stone bangles |
| 4 | Rings | अंगठ्या / रिंग्स | Statement rings, cocktail rings, adjustable rings |
| 5 | Mangalsutra | मंगळसूत्र | Traditional, modern, short, long |
| 6 | Bridal Sets | ब्रायडल सेट | Complete bridal jewelry sets |
| 7 | Anklets | पैंजण / पायल | Silver anklets, gold plated, charm anklets |
| 8 | Bracelets | ब्रेसलेट | Chain bracelets, charm, cuff styles |
| 9 | Maang Tikka | मांग टिका | Traditional tikka, borla, matha patti |
| 10 | Nose Pins | नथ / नोज पिन | Nose rings, studs, traditional nath |

---

## 10. WhatsApp Integration

This is how orders work. No payment gateway, no complicated checkout. Just WhatsApp.

### The flow

1. Customer browses products and adds what they like to the cart
2. They go to checkout and fill in their name, phone, and address
3. They hit "Place Order via WhatsApp"
4. WhatsApp opens on their phone with a ready-made message that looks like this:

```
New Order - StriRatna (स्त्रीरत्न)

Order #SR-20260416-001

Items:
1. 1gm Gold Plated Necklace Set - Rs.599 x 1
2. Jhumka Earrings - Rs.299 x 2

Subtotal: Rs.1,197
Delivery: FREE
Total: Rs.1,197

Customer Details:
Name: Priya Sharma
Phone: 9876543210
Address: 123, MG Road, Pune
City: Pune
State: Maharashtra
Pincode: 411001

---
Sent from StriRatna Website (striratna.web.app)
```

5. Customer just hits send and the order lands on the business WhatsApp
6. At the same time, this order is also saved to Firestore so the admin dashboard has it

### How it works in code
**File:** `src/app/core/services/whatsapp.service.ts`

```typescript
// WhatsApp Click-to-Chat URL - this is completely free, no API key needed
const whatsappNumber = '919579393985'; // StriRatna WhatsApp number
const message = encodeURIComponent(orderMessage);
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
window.open(whatsappUrl, '_blank');
```

It is just a URL. WhatsApp provides this for free. No API keys, no tokens, no server needed. The business number 9579 39 3985 is already being used for customer inquiries so customers are familiar with it.


---

## 11. Complete Project File Structure

Here is every file and folder in the project with what each one does.

```
striratna-website/
|
|-- src/
|   |-- app/
|   |   |
|   |   |-- core/                                    # services and guards used across the whole app
|   |   |   |-- services/
|   |   |   |   |-- product.service.ts               # all product related Firestore operations
|   |   |   |   |-- cart.service.ts                  # add to cart, remove, update quantity, uses localStorage
|   |   |   |   |-- order.service.ts                 # create order, get orders, update status
|   |   |   |   |-- category.service.ts              # get categories, add, edit, delete
|   |   |   |   |-- auth.service.ts                  # Firebase login, logout, check if logged in
|   |   |   |   |-- whatsapp.service.ts              # builds the order message and opens WhatsApp link
|   |   |   |
|   |   |   |-- guards/
|   |   |   |   |-- auth.guard.ts                    # blocks admin routes if not logged in
|   |   |   |
|   |   |   |-- models/
|   |   |       |-- product.model.ts                 # Product interface (fields shown in section 8.1)
|   |   |       |-- order.model.ts                   # Order interface (fields shown in section 8.3)
|   |   |       |-- category.model.ts                # Category interface (fields shown in section 8.2)
|   |   |
|   |   |-- shared/                                  # reusable components used on multiple pages
|   |   |   |-- components/
|   |   |   |   |-- navbar/
|   |   |   |   |   |-- navbar.component.ts          # top navigation bar with logo, links, cart icon
|   |   |   |   |   |-- navbar.component.html
|   |   |   |   |   |-- navbar.component.scss
|   |   |   |   |
|   |   |   |   |-- footer/
|   |   |   |   |   |-- footer.component.ts          # bottom footer with contact info and social links
|   |   |   |   |   |-- footer.component.html
|   |   |   |   |   |-- footer.component.scss
|   |   |   |   |
|   |   |   |   |-- product-card/
|   |   |   |   |   |-- product-card.component.ts    # single product card used in shop grid
|   |   |   |   |   |-- product-card.component.html
|   |   |   |   |   |-- product-card.component.scss
|   |   |   |   |
|   |   |   |   |-- whatsapp-fab/
|   |   |   |   |   |-- whatsapp-fab.component.ts    # floating WhatsApp button in bottom right corner
|   |   |   |   |   |-- whatsapp-fab.component.html
|   |   |   |   |   |-- whatsapp-fab.component.scss
|   |   |   |   |
|   |   |   |   |-- loading-spinner/
|   |   |   |       |-- loading-spinner.component.ts # shown while data is loading from Firestore
|   |   |   |       |-- loading-spinner.component.html
|   |   |   |       |-- loading-spinner.component.scss
|   |   |   |
|   |   |   |-- pipes/
|   |   |       |-- currency-inr.pipe.ts             # formats numbers as Rs. with commas (1,599)
|   |   |
|   |   |-- pages/                                   # all customer facing pages
|   |   |   |-- home/
|   |   |   |   |-- home.component.ts                # landing page with hero, featured, categories
|   |   |   |   |-- home.component.html
|   |   |   |   |-- home.component.scss
|   |   |   |
|   |   |   |-- shop/
|   |   |   |   |-- shop.component.ts                # product catalog with filters and sorting
|   |   |   |   |-- shop.component.html
|   |   |   |   |-- shop.component.scss
|   |   |   |
|   |   |   |-- product-detail/
|   |   |   |   |-- product-detail.component.ts      # single product view with images and add to cart
|   |   |   |   |-- product-detail.component.html
|   |   |   |   |-- product-detail.component.scss
|   |   |   |
|   |   |   |-- cart/
|   |   |   |   |-- cart.component.ts                # shopping cart with quantity controls
|   |   |   |   |-- cart.component.html
|   |   |   |   |-- cart.component.scss
|   |   |   |
|   |   |   |-- checkout/
|   |   |   |   |-- checkout.component.ts            # order form and WhatsApp order placement
|   |   |   |   |-- checkout.component.html
|   |   |   |   |-- checkout.component.scss
|   |   |   |
|   |   |   |-- contact/
|   |   |   |   |-- contact.component.ts             # contact info and WhatsApp link
|   |   |   |   |-- contact.component.html
|   |   |   |   |-- contact.component.scss
|   |   |   |
|   |   |   |-- about/
|   |   |       |-- about.component.ts               # brand story page
|   |   |       |-- about.component.html
|   |   |       |-- about.component.scss
|   |   |
|   |   |-- admin/                                   # admin panel, lazy loaded separately
|   |   |   |-- login/
|   |   |   |   |-- login.component.ts               # admin email password login
|   |   |   |   |-- login.component.html
|   |   |   |   |-- login.component.scss
|   |   |   |
|   |   |   |-- dashboard/
|   |   |   |   |-- dashboard.component.ts           # stats cards and recent orders overview
|   |   |   |   |-- dashboard.component.html
|   |   |   |   |-- dashboard.component.scss
|   |   |   |
|   |   |   |-- manage-orders/
|   |   |   |   |-- manage-orders.component.ts       # order list with status update and filters
|   |   |   |   |-- manage-orders.component.html
|   |   |   |   |-- manage-orders.component.scss
|   |   |   |
|   |   |   |-- manage-products/
|   |   |   |   |-- manage-products.component.ts     # add edit delete products with image upload
|   |   |   |   |-- manage-products.component.html
|   |   |   |   |-- manage-products.component.scss
|   |   |   |
|   |   |   |-- manage-categories/
|   |   |       |-- manage-categories.component.ts   # add edit delete reorder categories
|   |   |       |-- manage-categories.component.html
|   |   |       |-- manage-categories.component.scss
|   |   |
|   |   |-- app.component.ts                        # root component, has router outlet
|   |   |-- app.component.html
|   |   |-- app.component.scss
|   |   |-- app.config.ts                           # app configuration, Firebase initialization
|   |   |-- app.routes.ts                           # all route definitions
|   |
|   |-- assets/
|   |   |-- images/
|   |   |   |-- logo.png                            # brand logo
|   |   |   |-- hero-banner.jpg                     # homepage hero image
|   |   |   |-- placeholder-product.jpg             # shown when product image is loading
|   |   |
|   |   |-- icons/
|   |       |-- whatsapp.svg                        # WhatsApp icon for buttons
|   |
|   |-- environments/
|   |   |-- environment.ts                          # Firebase config for development
|   |   |-- environment.prod.ts                     # Firebase config for production
|   |
|   |-- styles/
|   |   |-- _variables.scss                         # all color codes, font names, spacing values
|   |   |-- _mixins.scss                            # responsive breakpoints for mobile, tablet, desktop
|   |   |-- _global.scss                            # global styles applied to the whole site
|   |
|   |-- styles.scss                                 # main stylesheet that imports everything
|   |-- index.html                                  # the single HTML file, Angular app loads here
|
|-- angular.json                                    # Angular project configuration
|-- package.json                                    # npm dependencies list
|-- tsconfig.json                                   # TypeScript compiler settings
|-- firebase.json                                   # Firebase hosting configuration
|-- .firebaserc                                     # Firebase project ID settings
|-- PROJECT_DOCUMENTATION.md                        # this file
```

---

## 12. Routes

### Customer routes (public, anyone can access)

| URL | Component File | What it shows |
|---|---|---|
| `/` | `src/app/pages/home/home.component.ts` | Landing page with hero banner and featured products |
| `/shop` | `src/app/pages/shop/shop.component.ts` | Full product catalog with filters |
| `/shop/:category` | `src/app/pages/shop/shop.component.ts` | Same shop page but filtered by a specific category |
| `/product/:id` | `src/app/pages/product-detail/product-detail.component.ts` | Individual product detail view |
| `/cart` | `src/app/pages/cart/cart.component.ts` | Shopping cart |
| `/checkout` | `src/app/pages/checkout/checkout.component.ts` | Customer details form and WhatsApp order |
| `/contact` | `src/app/pages/contact/contact.component.ts` | Contact information |
| `/about` | `src/app/pages/about/about.component.ts` | Brand story |

### Admin routes (protected by AuthGuard, must be logged in)

| URL | Component File | What it shows |
|---|---|---|
| `/admin/login` | `src/app/admin/login/login.component.ts` | Admin login page |
| `/admin/dashboard` | `src/app/admin/dashboard/dashboard.component.ts` | Stats and recent orders |
| `/admin/orders` | `src/app/admin/manage-orders/manage-orders.component.ts` | All orders with status management |
| `/admin/products` | `src/app/admin/manage-products/manage-products.component.ts` | Add, edit, delete products |
| `/admin/categories` | `src/app/admin/manage-categories/manage-categories.component.ts` | Add, edit, delete, reorder categories |

**Route file:** `src/app/app.routes.ts`
**Guard file:** `src/app/core/guards/auth.guard.ts`

---

## 13. Services - what each one does

### CartService
**File:** `src/app/core/services/cart.service.ts`

Handles everything related to the shopping cart. The cart is stored in the browser's localStorage, so it stays even if the customer closes the tab.

- `addToCart(product, quantity)` - adds a product to cart
- `removeFromCart(productId)` - removes an item completely
- `updateQuantity(productId, quantity)` - changes the quantity of an item
- `getCartItems()` - returns all items currently in cart
- `getCartTotal()` - calculates and returns the total price
- `clearCart()` - empties the entire cart (called after placing an order)

### WhatsAppService
**File:** `src/app/core/services/whatsapp.service.ts`

Builds the order message text and opens WhatsApp with it. Uses the free wa.me Click-to-Chat URL. No API key needed.

- `buildOrderMessage(order, items, customer)` - creates the formatted order text
- `sendViaWhatsApp(message, phoneNumber)` - opens WhatsApp with the message
- `buildProductInquiry(product)` - creates a quick inquiry message for a single product

### ProductService
**File:** `src/app/core/services/product.service.ts`

All Firestore operations related to products.

- `getAll()` - fetches all products
- `getById(id)` - fetches a single product by its document ID
- `getByCategory(categoryId)` - fetches products filtered by category
- `getFeatured()` - fetches only products marked as featured (for homepage)
- `search(query)` - searches products by name
- `add(product)` - adds a new product (admin only)
- `update(id, product)` - updates an existing product (admin only)
- `delete(id)` - deletes a product (admin only)

### OrderService
**File:** `src/app/core/services/order.service.ts`

All Firestore operations related to orders.

- `create(order)` - saves a new order to Firestore
- `getAll()` - fetches all orders (admin only)
- `getById(id)` - fetches a single order (admin only)
- `updateStatus(id, status)` - changes order status like pending to packed (admin only)
- `getByDateRange(from, to)` - fetches orders within a date range (admin only)
- `exportToCSV()` - downloads order data as a CSV file (admin only)

### CategoryService
**File:** `src/app/core/services/category.service.ts`

Firestore operations for categories.

- `getAll()` - fetches all active categories
- `add(category)` - adds a new category (admin only)
- `update(id, category)` - edits a category (admin only)
- `delete(id)` - removes a category (admin only)
- `reorder(categories)` - updates the display order (admin only)

### AuthService
**File:** `src/app/core/services/auth.service.ts`

Firebase Authentication for admin login.

- `login(email, password)` - signs in using Firebase Auth
- `logout()` - signs out
- `isLoggedIn()` - returns whether the admin is currently logged in
- Used by `auth.guard.ts` to protect admin routes

---

## 14. Deployment

### Step 1 - Set up Firebase project

Go to console.firebase.google.com and:
1. Create a new Firebase project
2. Turn on Firestore Database
3. Turn on Authentication and enable Email/Password sign-in method
4. Turn on Firebase Storage
5. Turn on Firebase Hosting
6. Copy the Firebase config object and paste it in `src/environments/environment.ts` and `environment.prod.ts`

### Step 2 - Build the project

This is where the actual coding happens. The order of building:
1. Create the Angular project and install dependencies (AngularFire, Angular Material)
2. Set up the project structure, routing, and Firebase config
3. Build the shared components first (navbar, footer, product card)
4. Build customer pages one by one (home, shop, product detail, cart, checkout)
5. Build the admin panel (login, dashboard, orders, products, categories)
6. Connect everything to Firebase
7. Test thoroughly on mobile devices since most customers will use phones

### Step 3 - Deploy to Firebase

```bash
# build the production version
ng build --configuration production

# deploy to Firebase Hosting
firebase deploy
```

That is it. The site is live. Firebase gives a free URL like `projectname.web.app` and we can also connect a custom domain later if needed.

### Step 4 - After launch

1. Log into admin panel and add all the real 1gm art jewellery products with images and prices
2. Put the website link in the Instagram bio (replace or add alongside the Google Maps link that is currently there)
3. Share the link on WhatsApp status and stories from the 9579 39 3985 number
4. Put up a QR code or link in the physical Hadapsar shop for walk-in customers
5. Start monitoring orders through the admin dashboard
6. Update Instagram posts to include "Order on our website" in captions

---

## 15. Future Additions (not part of this build)

These are things that can be added later as the business grows. None of these are being built right now.

| What | Why | When to consider adding it |
|---|---|---|
| Online Payment (Razorpay/UPI) | So customers can pay directly on the website | When order volume gets high and manual payment tracking becomes hard. This will need Firebase Cloud Functions (server-side code) for payment verification |
| Order Tracking Page for customers | Customers can check their own order status on the website | After 3-6 months when there are enough orders |
| SMS Notifications | Auto SMS when order is dispatched | When there is budget for an SMS service. Will need Cloud Functions |
| Wishlist | Customers can save products they like | After getting feedback from users post launch |
| Reviews and Ratings | Customers leave reviews on products | After 6 months when there are enough orders |
| Discount Coupons | Promo code system for festivals and sales | During festival season or special sales events |
| Multi-language (full Hindi/Marathi) | Complete website translation | Based on what the audience prefers |
| PWA (Progressive Web App) | Customers can install it like a mobile app | For repeat customers who visit frequently |
| WhatsApp Business API | Auto-replies, order confirmations, bulk messages | When revenue can support the cost. This needs a backend server |
| Google Analytics | Track visitor behavior, popular products, conversion | Should be added at launch or shortly after |

---

## 16. Build Phases

| Phase | What gets done | Status |
|---|---|---|
| Phase 1 | This documentation | Done |
| Phase 2 | Project setup, install dependencies, Firebase config | Pending |
| Phase 3 | Shared components - navbar, footer, product card, WhatsApp button | Pending |
| Phase 4 | Customer pages - home, shop, product detail | Pending |
| Phase 5 | Cart, checkout, WhatsApp order integration | Pending |
| Phase 6 | Admin panel - login, dashboard, manage orders, products, categories | Pending |
| Phase 7 | Testing on different devices, mobile optimization, bug fixes | Pending |
| Phase 8 | Deploy to Firebase Hosting and go live | Pending |

---

## 17. Links and Resources

| What | Where |
|---|---|
| Instagram | @striratna_poweredby_maaax (17.8K+ followers) |
| Parent Brand Instagram | @maaax_wholesaler |
| WhatsApp Business Number | 9579 39 3985 (already active for customer inquiries) |
| Phone | 9579 39 3985 |
| Physical Shop | Shop No. 1/1, Sai Sharan Complex, Pune-Solapur Road, Hadapsar, Pune - 411028 |
| Google Maps | maps.app.goo.gl/JuVUzSqivruwccq7A |
| Live Website | Will be on Firebase Hosting after deployment |
| Firebase Console | console.firebase.google.com |
| Angular Docs | angular.dev |
| Firebase Docs | firebase.google.com/docs |
| Angular Material | material.angular.io |

---

*Document created: April 16, 2026*
*Last updated: April 16, 2026*
*Project: स्त्रीरत्न (StriRatna) - Powered by Maaax*
*Stack: Angular + Firebase (No Backend Server)*
*Brand: 1gm Art Jewellery - साज महाराष्ट्राचा*
