import { Component, OnInit } from '@angular/core';
import { SearchBecService } from './../../service/search-bec.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-requisitions',
  templateUrl: './requisitions.component.html',
  styleUrl: './requisitions.component.css'
})
export class RequisitionsComponent  implements OnInit {
  produtos: string[] = [];
  sugestoes: string[] = [];
  informacoes: any = null;
  private searchTerms = new Subject<string>();

  constructor(private searchBecService: SearchBecService) {}

  ngOnInit(): void {
    this.searchTerms.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((term: string) => this.searchBecService.getProducts(term))
    ).subscribe(
      data => this.sugestoes = data.d,
      error => console.error('Erro ao buscar produtos:', error)
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  selectSuggestion(sugestao: string): void {
    this.produtos.push(sugestao);
    this.sugestoes = [];
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerms.next(input.value);
  }

  pesquisarProduto(): void {
    const descricao = this.produtos[this.produtos.length - 1];

    this.searchBecService.searchProduct(descricao).subscribe(
      (      html: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const conteudoPesquisa = doc.getElementById('ContentPlaceHolder1_gvResultadoPesquisa_lbTituloItem_0');

        if (conteudoPesquisa) {
          const descricaoInput2 = conteudoPesquisa.innerHTML.split(' ')[0];
          this.searchBecService.getProductDetails(descricaoInput2).subscribe(
            (            html2: string) => {
              const doc2 = parser.parseFromString(html2, 'text/html');
              const codigoMaterial = doc2.getElementById('ContentPlaceHolder1_lbNElementoDespesaInfo');
              const material = doc2.getElementById('ContentPlaceHolder1_lbMaterialInfo');

              if (codigoMaterial && material) {
                this.informacoes = {
                  material: material.innerHTML,
                  codigoMaterial: codigoMaterial.innerHTML
                };
              }
            },
            (            error: any) => console.error('Erro ao obter detalhes do produto:', error)
          );
        }
      },
      (      error: any) => console.error('Erro ao buscar produto:', error)
    );
  }
  mostrarPesquisaBec = false;

  onTipoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.mostrarPesquisaBec = selectElement.value === 'nao-sei';
  }
}
