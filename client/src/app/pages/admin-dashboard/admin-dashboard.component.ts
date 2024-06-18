import { Component, HostListener, OnInit } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { MatDialog } from '@angular/material/dialog';
import {Title} from "@angular/platform-browser";

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
  filteredProducts: any[] = [];

  filters = {
    solicitante: '',
    nome: '',
    status: '',
    categoria: '',
    tipo: '',
    startDate: '',
    endDate: ''
  };

  popoverTitle: string = '';
  popoverContent: string = '';
  popoverNameVisible: boolean[] = [];
  popoverDescriptionVisible: boolean[] = [];
  isDetailsModalOpen: boolean = false;
  isAproveModalOpen: boolean = false;
  isDisaproveModalOpen: boolean = false;
  isJustificativaModalOpen: boolean = false;

  constructor(private productService: ProductsService, public dialog: MatDialog, private titleService:Title) {
    this.titleService.setTitle("Produtos Solicitados");
  }


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
        this.filteredProducts = this.products.slice();
        this.paginate();;
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
    if (this.filteredProducts.length > 0) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
      this.generatePages();
    } else {
      this.paginatedProducts = [];
    }
  }

  generatePages() {
    if (this.filteredProducts && this.filteredProducts.length > 0) {
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
    if (this.filteredProducts && this.filteredProducts.length > 0) {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
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

  parseDateString(dateString: string): Date | null {
    let dateParts: string[] = [];
    if (dateString.includes('/')) {
        dateParts = dateString.split('/');
    } else if (dateString.includes('-')) {
        dateParts = dateString.split('-');
    } else {
        return null;
    }

    if (dateParts.length === 3) {
        let year: number, month: number, day: number;

        if (dateString.includes('/')) {
            day = parseInt(dateParts[0], 10);
            month = parseInt(dateParts[1], 10) - 1;
            year = parseInt(dateParts[2], 10);
        } else {
            year = parseInt(dateParts[0], 10);
            month = parseInt(dateParts[1], 10) - 1;
            day = parseInt(dateParts[2], 10);
        }

        return new Date(year, month, day);
    } else {
        return null;
    }
}
  onFilterChange(): void {
    const solicitante = (document.getElementById('solicitante') as HTMLInputElement).value;
    const nome = (document.getElementById('nome') as HTMLInputElement).value;
    const status = (document.querySelector('input[name="status"]:checked') as HTMLInputElement)?.value || '';
    const categoria = (document.getElementById('categoria') as HTMLSelectElement).value;
    const tipo = (document.querySelector('input[name="tipo"]:checked') as HTMLInputElement)?.value || '';
    const startDate = (document.getElementById('startDate') as HTMLInputElement).value;
    const endDate = (document.getElementById('endDate') as HTMLInputElement).value;
    this.filters = { solicitante, nome, status, categoria, tipo, startDate, endDate };

    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const productDate = this.parseDateString(product.data);
      if (!productDate) {
        console.warn(`Data inválida no produto: ${product.data}`);
        return false;
      }

      const startDate = this.filters.startDate ? this.parseDateString(this.filters.startDate) : null;
      const endDate = this.filters.endDate ? this.parseDateString(this.filters.endDate) : null;

      const isAfterStartDate = startDate ? productDate >= startDate : true;
      const isBeforeEndDate = endDate ? productDate <= endDate : true;


      return (
        (!this.filters.solicitante || product.userId.nome.toLowerCase().includes(this.filters.solicitante.toLowerCase())) &&
        (!this.filters.nome || product.nome.toLowerCase().includes(this.filters.nome.toLowerCase())) &&
        (!this.filters.status || product.status === this.filters.status) &&
        (!this.filters.categoria || product.categoria === this.filters.categoria) &&
        (!this.filters.tipo || product.tipo === this.filters.tipo) &&
        isAfterStartDate &&
        isBeforeEndDate
      );
    });

    this.currentPage = 1;
    this.paginate();
  }

  resetFilters(): void {
    this.filters = {
      solicitante: '',
      nome: '',
      status: '',
      categoria: '',
      tipo: '',
      startDate: '',
      endDate: ''
    };

    (document.getElementById('solicitante') as HTMLInputElement).value = '';
    (document.getElementById('nome') as HTMLInputElement).value = '';
    (document.getElementById('categoria') as HTMLSelectElement).value = '';
    const statusInput = document.querySelector('input[name="status"]:checked') as HTMLInputElement;
    if (statusInput) statusInput.checked = false;
    const tipoInput = document.querySelector('input[name="tipo"]:checked') as HTMLInputElement;
    if (tipoInput) tipoInput.checked = false;
    (document.getElementById('startDate') as HTMLInputElement).value = '';
    (document.getElementById('endDate') as HTMLInputElement).value = '';

    this.applyFilters();
  }
}
