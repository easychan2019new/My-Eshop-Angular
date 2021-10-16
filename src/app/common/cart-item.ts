import { Product } from "./product";

export class CartItem {
    imageUrl: string;
    name: string;
    unitPrice: number;
    quantity: number;
    productId: string;

    constructor(product: Product) {
        this.imageUrl = product.imageUrl;
        this.name = product.name;
        this.unitPrice = product.unitPrice;
        this.quantity = 1;
        this.productId = product.id;
    }
}
