import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchBecService {

  private autoCompleteUrl = 'https://www.bec.sp.gov.br/BEC_Catalogo_ui/WebService/AutoComplete.asmx/GetItensList';

  constructor(private http: HttpClient) {}

  getProducts(prefixText: string, count: number = 20): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ prefixText, count });
    return this.http.post(this.autoCompleteUrl, body, { headers });
  }

  searchProduct(description: string): Observable<string> {
    const url = `https://www.bec.sp.gov.br/BEC_Catalogo_ui/CatalogoPesquisa3.aspx?chave=&pesquisa=Y&cod_id=&ds_item=${encodeURIComponent(description)}`;
    return this.http.get(url, { responseType: 'text' });
  }

  getProductDetails(cod_id: string): Observable<string> {
    const url = `https://www.bec.sp.gov.br/BEC_Catalogo_ui/CatalogDetalheNovo.aspx?chave=&cod_id=${encodeURIComponent(cod_id)}&selo=&origem=CatalogoPesquisa3`;
    return this.http.get(url, { responseType: 'text' });
  }
}
