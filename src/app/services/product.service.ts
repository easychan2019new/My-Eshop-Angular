import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../common/category';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = `http://localhost:8082/product-query-service/products`;

  private categoryUrl = `http://localhost:8082/product-query-service/category/findAllCategory`;

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: string): Observable<Product> {
    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);

  }

  getProductListPaginate(thePage: number, 
                         thePageSize: number, 
                         theCategoryName: string): Observable<GetProductResponse> {

    // need to build URL based on category name, page and size
    const searchUrl = `${this.baseUrl}/search/findAllByProductCategoryName?name=${theCategoryName}`
                      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetProductResponse>(searchUrl);
  }


  getProductList(theCategoryName: string): Observable<Product[]> {

    // need to build URL based on category name
    const searchUrl = `${this.baseUrl}/search/findAllByProductCategoryName?name=${theCategoryName}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    // need to build URL based on keyword name
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetProductResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.categoryUrl);
  }

}

interface GetProductResponse {

    _embedded: {
    products: Product[];
    }

    page: {
      size: number,
      totalElements: number;
      totalPages: number;
      number: number;
    }
}
