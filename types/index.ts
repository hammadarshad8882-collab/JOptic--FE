export type Page = 'home' | 'product' | 'cart' | 'wishlist' | 'admin';

export interface Product {
  variants: any;
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  frameShape: string;
  frameMaterial: string;
  lensWidth: string;
  bridgeWidth: string;
  templeLength: string;
  isNew?: boolean;
  isBestseller?: boolean;
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  product: Product;
  quantity: number;
  color: string;
}

export interface Order {
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;

  items: {
    productId: string;
    quantity: number;
    color: string;
  }[];

  totalAmount: number;
  createdAt: string;
}