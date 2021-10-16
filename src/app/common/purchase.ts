import { CartItem } from "./cart-item";

export class Purchase {
    totalPrice: number;
    totalQuantity: number;
    customerEmail: string;
    addressId: string;
    paymentId: string;
    cartItems: Set<CartItem>;
}
