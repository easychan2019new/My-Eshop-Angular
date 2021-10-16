import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  previousCategoryName: string = "Books";
  currentCategoryName: string = "Books";
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  constructor(private productService: ProductService,
              private cartService: CartService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
    this.listProducts();
    });
  }

  listProducts() {
    // check if "keyword" parameter is available
    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
    
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get("keyword");

    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleListProducts() {

    // check if "name" parameter is available
    const hasCategroyName: boolean = this.route.snapshot.paramMap.has("name");

    if (hasCategroyName) {
      this.currentCategoryName = this.route.snapshot.paramMap.get("name");
    } else {
      this.currentCategoryName = "Coffee Mugs";
    }
    
    // check if we have a different category than previous
    if (this.previousCategoryName != this.currentCategoryName) {
      this.thePageNumber = 1;
    }

    this.previousCategoryName = this.currentCategoryName;
    console.log(`currentCategoryName=${this.currentCategoryName}, thePageNumber=${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber - 1, 
                                               this.thePageSize,
                                               this.currentCategoryName)
                                               .subscribe(this.processResult());
  }

  processResult() {
    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem); 
  }

}
