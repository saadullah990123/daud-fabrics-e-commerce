export interface ProductItem {
  id: number;
  name: string;
  slug: string;
  category: "men" | "women" | "kids";
  subcategory?: string | null;
  price: number;
  salePrice?: number | null;
  description: string;
  details?: string | null;
  stock: number;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CartItem {
  productId: number;
  name: string;
  slug: string;
  category: "men" | "women" | "kids";
  subcategory?: string;
  price: number; // Regular price
  effectivePrice: number; // Sale price if exists, else regular
  image: string;
  quantity: number;
  stock: number;
}

export interface CustomerOrderDetails {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  city: string;
  postalCode?: string;
  orderNotes?: string;
  paymentMethod: "cod" | "easypaisa" | "meezan_bank";
  paymentScreenshot?: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

export interface OrderRecord {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  city: string;
  postalCode?: string | null;
  orderNotes?: string | null;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: "cod" | "easypaisa" | "meezan_bank";
  paymentStatus: "Pending" | "Paid" | "Cancelled" | "Refunded";
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentScreenshot?: string | null;
  trackingNumber?: string | null;
  courierName?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface StoreSettingsMap {
  easypaisa_title?: string;
  easypaisa_number?: string;
  easypaisa_instructions?: string;
  meezan_bank_title?: string;
  meezan_bank_account?: string;
  meezan_bank_iban?: string;
  meezan_bank_branch?: string;
  meezan_bank_instructions?: string;
  store_phone?: string;
  store_whatsapp?: string;
  store_email?: string;
  store_address?: string;
  free_shipping_threshold?: string;
  standard_shipping_fee?: string;
  announcement_messages?: string[];
  [key: string]: unknown;
}
