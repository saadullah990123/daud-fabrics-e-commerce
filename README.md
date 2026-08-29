<div align="center">

# 🧵 Daud Fabrics — E-Commerce Platform

**A full-stack e-commerce web platform for Daud Fabrics — a Pakistani clothing brand.**

Public storefront with product catalogs, cart & checkout, order tracking, and a secure admin dashboard for managing products, orders, and store settings.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-black?style=for-the-badge&logo=vercel)](https://daud-fabrics-e-commerce.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

🔗 **[daud-fabrics-e-commerce.vercel.app](https://daud-fabrics-e-commerce.vercel.app)**

</div>

---

## 📖 Overview

**Daud Fabrics** is a modern, full-stack online store built with **Next.js 16 (App Router)** and **TypeScript**. It combines a fast, responsive storefront — product browsing, cart, checkout, and order tracking — with a secure, database-backed **admin dashboard** for managing the entire catalog, orders, and store configuration.

---

## ✨ Features

### 🛍️ Storefront
- **Product Catalog** — Browse by category (Men, Women, Kids) with subcategories, featured items, and bestsellers
- **Search** — Quick product search via modal
- **Cart & Checkout** — Persistent cart context, checkout with delivery details, and multiple payment methods (Cash on Delivery, EasyPaisa, Meezan Bank)
- **Order Tracking** — Customers can track orders and view an order confirmation page after checkout
- **Customer Reviews** — Verified customer reviews displayed on the storefront
- **WhatsApp Integration** — Floating WhatsApp button for quick customer contact
- **Responsive Design** — Built with Tailwind CSS for a smooth experience across devices

### 🔐 Admin Dashboard
- **Secure Authentication** — Signed session tokens (HMAC), hashed passwords (bcrypt), and a forgot/reset password flow
- **Dashboard Stats** — At-a-glance store performance overview
- **Order Management** — View, update status, and manage orders (payment status, tracking number, courier info)
- **Product Management** — Full CRUD for products, including images, pricing, stock, and featured/bestseller flags
- **Store Settings** — Manage configurable store settings directly from the dashboard

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL ([Neon](https://neon.tech/)) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Styling | Tailwind CSS 4 |
| Auth | Custom HMAC-signed sessions + bcrypt password hashing |
| Icons | Lucide React |
| Deployment | Vercel |

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

Built with **Drizzle ORM** against **PostgreSQL**:

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

Visit **`http://localhost:3000`** for the storefront, and **`http://localhost:3000/admin/login`** for the admin dashboard.

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

## 📸 Preview

<div align="center">

### 🏠 Homepage
<img width="1907" height="900" alt="image" src="https://github.com/user-attachments/assets/0c96024e-d0a8-4ec0-9b17-f0d0f8777ec1" />
<img width="1785" height="902" alt="image" src="https://github.com/user-attachments/assets/871dedda-14cb-4e90-8da3-c6542e9b18c8" />

### 📦 Product Page
<img width="1782" height="887" alt="image" src="https://github.com/user-attachments/assets/e80b25d6-0f0c-4ca1-8c5b-86a5c5c1e1ec" />


### 🛒 Cart & Checkout
<img width="1845" height="897" alt="image" src="https://github.com/user-attachments/assets/e34f0f80-7372-4310-8007-d25370382d87" />
<img width="1816" height="910" alt="image" src="https://github.com/user-attachments/assets/7a9f773a-e428-4944-a611-a55b992ec1ed" />

### 🔐 Admin Dashboard
<img width="1902" height="920" alt="image" src="https://github.com/user-attachments/assets/9584f2ab-eaa0-49ee-be16-c2f3eecd896d" />

</div>

---

## 📄 License

This project is privately owned by **Daud Fabrics**. All rights reserved © 2026.

---

<div align="center">

Made with ❤️ for **Daud Fabrics**

</div>
