import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from '../components/product/product.component';

import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule, PaginatorModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private productsService: ProductsService) {}

  products: Product[] = [];
  totalRecords: number = 0;
  rows: number = 5;
  first: number = 0;

  onPageChange(event: any) {
    this.fetchProducts(event.page, event.rows);
  }

  fetchProducts(page: number, perPage: number) {
    this.productsService
      .getProducts('http://localhost:3000/clothes', { page, perPage })
      .subscribe((products: Products) => {
        console.log(products.items);
        this.products = products.items;
        this.totalRecords = products.total;
      });
  }

  editProduct(product: Product, id: number) {
    this.productsService
      .editProduct(`http://localhost:3000/clothes/${id}`, product)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
          // this.resetPaginator();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  addProduct(product: Product) {
    this.productsService
      .addProduct(`http://localhost:3000/clothes`, product)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
          // this.resetPaginator();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  deleteProduct(id: number) {
    this.productsService
      .deleteProduct(`http://localhost:3000/clothes/${id}`)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
          // this.resetPaginator();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnInit(): void {
    this.fetchProducts(this.first, this.rows);
  }
}
