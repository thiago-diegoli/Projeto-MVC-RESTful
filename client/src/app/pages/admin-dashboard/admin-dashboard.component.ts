import { Component, HostListener, OnInit } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  paginatedProducts: any[] = [];
  pages: number[] = [];

  popoverTitle: string = '';
  popoverContent: string = '';
  popoverNameVisible: boolean[] = [];
  popoverDescriptionVisible: boolean[] = [];
  isDetailsModalOpen: boolean = false;
  isAproveModalOpen: boolean = false;
  isDisaproveModalOpen: boolean = false;
  isJustificativaModalOpen: boolean = false;

  constructor(private productService: ProductsService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getProducts();
    this.products.forEach(() => {
      this.popoverNameVisible.push(false);
      this.popoverDescriptionVisible.push(false);
    });
  }

  getProducts(): void {
    this.productService.getProductsAll().subscribe(
      (data) => {
        this.products = data;
        this.sortProductsByDate();
        this.paginate();
      },
      (error) => {
        console.error('Erro ao obter os produtos:', error);
      }
    );
  }

  sortProductsByDate() {
    this.products.sort((a, b) => {
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();
      return dateB - dateA;
    });
    this.products.forEach(product => {
      product.data = this.formatDate(product.data);
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  paginate() {
    if (this.products.length > 0) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedProducts = this.products.slice(startIndex, endIndex);
      this.generatePages();
    } else {
      this.paginatedProducts = [];
    }
  }

  generatePages() {
    if (this.products && this.products.length > 0) {
      const totalPages = this.totalPages();
      this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      this.pages = [];
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
      this.paginate();
    }
  }

  totalPages(): number {
    if (this.products && this.products.length > 0) {
      return Math.ceil(this.products.length / this.itemsPerPage);
    }
    return 0;
  }

  onNavigate(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.changePage(page);
    }
  }

  isTextTooLong(text: string): boolean {
    const maxLength = 20;
    return text.length > maxLength;
  }

  togglePopoverName(product: any): void {
    const index = this.products.indexOf(product);
    this.popoverTitle = "Nome";
    this.popoverContent = product.nome;
    this.popoverNameVisible.fill(false);
    this.popoverNameVisible[index] = true;
    this.popoverDescriptionVisible.fill(false);
  }

  togglePopoverDescription(product: any): void {
    const index = this.products.indexOf(product);
    this.popoverTitle = "Descrição";
    this.popoverContent = product.descricao;
    this.popoverDescriptionVisible.fill(false);
    this.popoverDescriptionVisible[index] = true;
    this.popoverNameVisible.fill(false);
  }

  handlePopoverVisibilityChange(isVisible: boolean): void {
    if (!isVisible) {
      this.popoverNameVisible.fill(false);
      this.popoverDescriptionVisible.fill(false);
    }
  }

  filtroVisivel = false;

  toggleFiltro() {
    this.filtroVisivel = !this.filtroVisivel;
  }

  selectedProduct: any = null;
  isMenuOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isCancelModalOpen: boolean = false;

  // Funções para abrir/fechar menus e modais
  toggleMenu(event: MouseEvent, product: any) {
    event.stopPropagation();
    if (this.selectedProduct === product) {
      this.isMenuOpen = !this.isMenuOpen;
    } else {
      this.selectedProduct = product;
      this.isMenuOpen = true;
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.selectedProduct = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#dropdownButton') && !targetElement.closest('#dropdown')) {
      this.closeMenu();
    }
  }

  openJustificativaModal() {
    this.isJustificativaModalOpen = true;
    const modal = document.getElementById('justificativaModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeJustificativaModal() {
    this.isJustificativaModalOpen = false;
    const modal = document.getElementById('justificativaModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  fillJustificativaForm(product: any) {
    const form = document.getElementById('justificativaForm') as HTMLFormElement;
    if (form) {
      const justificativaElement = form.elements.namedItem('justificativa') as HTMLTextAreaElement;
      justificativaElement.value = product.justificativa && product.justificativa.trim() !== ''
        ? product.justificativa
        : 'Nenhuma justificativa fornecida.';
    }
  }

  verJustificativa(product: any) {
    this.selectedProduct = product;
    this.openJustificativaModal();
    this.fillJustificativaForm(product);
  }

  openDetailsModal() {
    this.isDetailsModalOpen = true;
    const modal = document.getElementById('detailsModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
    const modal = document.getElementById('detailsModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  fillDetailsForm(product: any) {
    const form = document.getElementById('detailsForm') as HTMLFormElement;
    if (form) {
      (form.elements.namedItem('detailsNome') as HTMLInputElement).value = product.nome;
      (form.elements.namedItem('detailsQuantidade') as HTMLInputElement).value = product.quantidade;
      (form.elements.namedItem('detailsDescricao') as HTMLTextAreaElement).value = product.descricao;
      (form.elements.namedItem('detailsTipo') as HTMLInputElement).value = product.tipo;
      (form.elements.namedItem('detailsCategoria') as HTMLInputElement).value = product.categoria;
    }
  }

  verDetalhes(product: any) {
    this.selectedProduct = product;
    this.openDetailsModal();
    this.fillDetailsForm(product);
  }

  aprovar(product: any) {
    this.selectedProduct = product;
    if(product){
      this.openAproveModal();
    }
  }

  openAproveModal() {
    this.isAproveModalOpen = true;
    const modal = document.getElementById('popup-modal-aprove');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeAproveModal() {
    this.isAproveModalOpen = false;
    const modal = document.getElementById('popup-modal-aprove');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
  confirmarAprovamento(){
    const product = this.selectedProduct;
    const productData = {
      _id: product._id,
      status: 'Aprovado'
    };

    this.productService.updateStatusProduct(productData).subscribe(
      response => {
        this.getProducts();
        this.closeAproveModal();
      },
      error => {
        console.error('Erro ao deletar o produto:', error);
        this.closeAproveModal();
      }
    );
  }

  negar(product: any) {
    this.selectedProduct = product;
    if(product){
      this.openDisaproveModal();
    }
  }

  openDisaproveModal() {
    this.isDisaproveModalOpen = true;
    const modal = document.getElementById('popup-modal-disaprove');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeDisaproveModal() {
    this.isDisaproveModalOpen = false;
    const modal = document.getElementById('popup-modal-disaprove');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
  confirmarDesaprovamento(){
    const product = this.selectedProduct;
    const productData = {
      _id: product._id,
      status: 'Negado',
      justificativa: (document.getElementById('inputJustificativa') as HTMLTextAreaElement).value || ''
    };

    this.productService.updateStatusProduct(productData).subscribe(
      response => {
        this.getProducts();
        this.closeDisaproveModal();
      },
      error => {
        console.error('Erro ao deletar o produto:', error);
        this.closeDisaproveModal();
      }
    );
  }
}
