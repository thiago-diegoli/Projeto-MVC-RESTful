import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchBecService } from './../../service/search-bec.service';
import { ProductsService } from './../../service/products.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-requisitions',
  templateUrl: './requisitions.component.html',
  styleUrls: ['./requisitions.component.css']
})
export class RequisitionsComponent implements OnInit {
  produtos: string[] = [];
  sugestoes: string[] = [];
  informacoes: { material: string; codigoMaterial: string } | null = null;
  private searchTerms = new Subject<string>();

  @ViewChild('requisicaoForm') requisicaoForm!: NgForm; // Referência ao formulário

  constructor(private searchBecService: SearchBecService, public productsService: ProductsService) {}

  ngOnInit(): void {
    this.searchTerms.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((term: string) => this.searchBecService.getProducts(term))
    ).subscribe(
      data => this.sugestoes = data.d.slice(0, 5),  // Limitar para as primeiras 5 sugestões
      error => console.error('Erro ao buscar produtos:', error)
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  selectSuggestion(sugestao: string): void {
    const inputElement = document.getElementById('produtoDesejadoInput') as HTMLInputElement;
    inputElement.value = sugestao;  // Atualizar o input com a sugestão selecionada
    this.produtos.push(sugestao);
    this.sugestoes = [];
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerms.next(input.value);
  }

  pesquisarProduto(): void {
    const descricaoBec = this.produtos[this.produtos.length - 1];
    this.searchBecService.searchProduct(descricaoBec).subscribe(
      html => this.handleProductSearch(html),
      error => console.error('Erro ao buscar produto:', error)
    );
  }

  handleProductSearch(html: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const conteudoPesquisa = doc.getElementById('ContentPlaceHolder1_gvResultadoPesquisa_lbTituloItem_0');

    if (conteudoPesquisa) {
      const descricaoInput2 = conteudoPesquisa.innerHTML.split(' ')[0];
      this.searchBecService.getProductDetails(descricaoInput2).subscribe(
        html2 => this.handleProductDetails(html2),
        error => console.error('Erro ao obter detalhes do produto:', error)
      );
    }
  }

  handleProductDetails(html2: string): void {
    const parser = new DOMParser();
    const doc2 = parser.parseFromString(html2, 'text/html');
    const codigoMaterial = doc2.getElementById('ContentPlaceHolder1_lbNElementoDespesaInfo');
    const material = doc2.getElementById('ContentPlaceHolder1_lbMaterialInfo');

    if (codigoMaterial && material) {
      this.informacoes = {
        material: material.innerHTML,
        codigoMaterial: codigoMaterial.innerHTML
      };
    }
  }

  mostrarPesquisaBec = false;

  onTipoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.mostrarPesquisaBec = selectElement.value === 'nao-sei';
  }

  onSubmit(): void {
    const form = document.getElementById('requisicao') as HTMLFormElement;
    const formData = new FormData(form);

    const productData = {
      nome: formData.get('nome') as string,
      tipo: formData.get('tipo') as string,
      quantidade: formData.get('quantidade') as string,
      categoria: formData.get('categoria') as string,
      descricao: formData.get('descricao') as string
    };

    if (productData.tipo === 'nao-sei') {
      const codDespesaElement = document.getElementById('p2') as HTMLInputElement;
      const codDespesaFullText = codDespesaElement.innerText;

      const codDespesa = codDespesaFullText.split(' - ')[0];
      if (codDespesa === '339030') {
        productData.tipo = 'material-de-consumo';
      } else if (codDespesa === '449052') {
        productData.tipo = 'material-permanente';
      } else {
        productData.tipo = 'outro';
      }
    }
    this.productsService.insertProduct(productData).subscribe(
      response => {
        this.resetForm();  // Resetar o formulário após uma submissão bem-sucedida
      },
      error => {
        console.error('Erro ao cadastrar o produto:', error);
      }
    );
  }

  resetForm(): void {
    this.requisicaoForm.resetForm();  // Método para resetar o formulário
    this.produtos = [];  // Limpar a lista de produtos selecionados
    this.informacoes = null;  // Limpar as informações
    this.mostrarPesquisaBec = false;  // Resetar o estado de exibição da pesquisa
  }
}
