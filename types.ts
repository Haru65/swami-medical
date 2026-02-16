
export interface Medicine {
  id: string;
  name: string;
  category: string; 
  condition?: string; 
  isWellness?: boolean;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  description: string;
  usage: string;
  sideEffects: string;
  imageUrl?: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  prescriptionAttached?: string;
}

export type OrderStatus = 'Pending Payment' | 'Verification Required' | 'Confirmed' | 'Dispatched' | 'Delivered';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  customerName: string;
  paymentMethod: 'Cash on Delivery' | 'Online Payment';
  status: OrderStatus;
  deliveryAddress?: string;
  prescriptionImage?: string;
}

export interface User {
  username: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
}

export enum View {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  CHECKOUT = 'CHECKOUT',
  SUCCESS = 'SUCCESS',
  ADMIN = 'ADMIN',
  ACCOUNT = 'ACCOUNT'
}
