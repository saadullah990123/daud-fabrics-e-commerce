# 🧵 Daud Fabrics — E-Commerce Platform

A full-stack e-commerce web platform for **Daud Fabrics**, a Pakistani clothing brand — featuring a public storefront with product catalogs, a shopping cart and checkout flow, order tracking, and a secure admin dashboard for managing products, orders, and store settings.

**Live:** [daud-fabrics-e-commerce.vercel.app](https://daud-fabrics-e-commerce.vercel.app)

---

## ✨ Features

### Storefront
- 🛍️ **Product Catalog** — Browse by category (Men, Women, Kids) with subcategories, featured items, and bestsellers.
- 🔍 **Search** — Quick product search via modal.
- 🛒 **Cart & Checkout** — Persistent cart context, checkout with delivery details, and multiple payment methods (Cash on Delivery, EasyPaisa, Meezan Bank).
- 📦 **Order Tracking** — Customers can track orders and view an order confirmation page after checkout.
- ⭐ **Customer Reviews** — Verified customer reviews displayed on the storefront.
- 💬 **WhatsApp Integration** — Floating WhatsApp button for quick customer contact.
- 📱 **Responsive Design** — Built with Tailwind CSS for a smooth experience across devices.

### Admin Dashboard
- 🔐 **Secure Authentication** — Signed session tokens (HMAC), hashed passwords (bcrypt), and forgot/reset password flow.
- 📊 **Dashboard Stats** — At-a-glance store performance overview.
- 🧾 **Order Management** — View, update status, and manage orders (payment status, tracking number, courier info).
- 👕 **Product Management** — Full CRUD for products, including images, pricing, stock, and featured/bestseller flags.
- ⚙️ **Store Settings** — Manage configurable store settings from the dashboard.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL ([Neon](https://neon.tech/))
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Styling:** Tailwind CSS 4
- **Auth:** Custom HMAC-signed sessions + bcrypt password hashing
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── admin/              # Admin dashboard (login, products, orders, settings)
│   ├── api/
│   │   ├── admin/          # Admin-only API routes (auth, products, orders, stats, settings)
│   │   ├── orders/         # Public order APIs
│   │   ├── products/       # Public product APIs
│   │   └── upload/         # Image upload handling
│   ├── cart/                # Cart page
│   ├── checkout/            # Checkout flow
│   ├── men/ women/ kids/    # Category pages
│   ├── order-confirmation/  # Post-checkout confirmation
│   ├── products/            # Product listing & detail pages
│   ├── track-order/         # Order tracking
│   └── contact/, shipping-returns/
├── components/               # Navbar, footer, product cards, cart drawer, reviews, etc.
├── db/                       # Drizzle schema, seed script, DB client
└── lib/                      # Auth helpers, cart context, formatting utilities
scripts/
└── seed-run.ts               # Standalone DB seed runner
```

---

## 🗄️ Database Schema

Built with Drizzle ORM against PostgreSQL:

| Table | Purpose |
|---|---|
| `products` | Product catalog — name, category/subcategory, pricing (PKR), stock, images, featured/bestseller flags |
| `orders` | Customer orders — items, delivery info, payment method/status, order status, tracking |
| `admins` | Admin accounts — hashed passwords, roles, password reset tokens |
| `store_settings` | Key-value store for configurable site settings |
| `reviews` | Customer reviews with rating and verification status |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/saadullah990123/daud-fabrics-e-commerce.git
cd daud-fabrics-e-commerce
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root:
```env
DATABASE_URL=your_postgresql_connection_string
ADMIN_SESSION_SECRET=your_random_secret_key
```

### 4. Push the database schema
```bash
npx drizzle-kit push
```

### 5. Seed the database (optional)
```bash
npx tsx scripts/seed-run.ts
```

### 6. Run the development server
```bash
npm run dev
```
Visit `http://localhost:3000` for the storefront, and `http://localhost:3000/admin/login` for the admin dashboard.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

---

## 📄 License

This project is privately owned by Daud Fabrics. All rights reserved.
