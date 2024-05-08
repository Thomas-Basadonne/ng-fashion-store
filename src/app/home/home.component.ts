import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from '../components/product/product.component';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';

import { Paginator, PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductComponent,
    CommonModule,
    PaginatorModule,
    EditPopupComponent,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private productsService: ProductsService) {}

  @ViewChild('paginator') paginator: any;

  products: Product[] = [];
  totalRecords: number = 0;

  // Impostazioni Paginator PrimeNg
  rows: number = 5;
  first: number = 0;

  // Flag per mostrare/nascondere il popup
  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;

  selectedProduct: Product = {
    // Prodotto selezionato per la modifica
    id: 0,
    name: '',
    image: '',
    price: '',
    rating: 0,
  };

  // Fetch dei prodotti iniziale
  ngOnInit(): void {
    this.fetchProducts(this.first, this.rows);
  }

  // Metodo per gestire l'edit'
  toggleEditPopup(product: Product) {
    this.selectedProduct = product; // Imposta il prodotto selezionato per la modifica
    this.displayEditPopup = true; // Mostra il popup di modifica
  }

  // Metodo per gestire l'add
  toggleAddPopup() {
    this.displayAddPopup = true; // Mostra il popup di aggiunta
  }

  // Metodo per gestire la delete
  toggleDeletePopup(product: Product) {
    if (!product.id) {
      return; // Se il prodotto non ha un ID, non fare nulla
    }
    this.deleteProduct(product.id); // Chiama il metodo per eliminare il prodotto
  }

  onConfirmEdit(product: Product) {
    if (!this.selectedProduct.id) {
      return; // Se il prodotto selezionato non ha un ID valido, non fare nulla
    }
    this.editProduct(product, this.selectedProduct.id); // Chiama il metodo per effettuare la modifica
    this.displayEditPopup = false; // Nasconde il popup di modifica
  }

  onConfirmAdd(product: Product) {
    this.addProduct(product); // Chiama il metodo per aggiungere il prodotto
    this.displayAddPopup = false; // Nasconde il popup di aggiunta
  }

  // Metodo chiamato quando cambia la pagina nel componente Paginator
  onPageChange(event: any) {
    this.fetchProducts(event.page, event.rows); // Ricarica i prodotti in base alla pagina e al numero di righe per pagina
  }

  // Metodo per resettare il componente Paginator alla prima pagina
  resetPaginator() {
    this.paginator?.changePage(0);
  }

  // Metodo per recuperare i prodotti paginati dal servizio
  fetchProducts(page: number, perPage: number) {
    this.productsService
      .getProducts('http://localhost:3000/clothes', { page, perPage })
      .subscribe((products: Products) => {
        // console.log(products.items);
        this.products = products.items;
        this.totalRecords = products.total;
      });
  }

  // Metodo per effettuare la modifica di un prodotto
  editProduct(product: Product, id: number) {
    this.productsService
      .editProduct(`http://localhost:3000/clothes/${id}`, product)
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  // Metodo per aggiungere un nuovo prodotto
  addProduct(product: Product) {
    this.productsService
      .addProduct(`http://localhost:3000/clothes`, product)
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  // Metodo per eliminare un prodotto
  deleteProduct(id: number) {
    this.productsService
      .deleteProduct(`http://localhost:3000/clothes/${id}`)
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
