import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  genre: string = "";
  private URL: string = "http://skunkworks.ignitesol.com:8000/books";

  constructor(private http: HttpClient, private router: Router) { }

  getAllGenre(): Observable<any> {
    if (this.genre.length > 0) {
      let params = new HttpParams();
      params = params.append('topic', this.genre);
      params = params.append('mime_type', 'image');
      return this.http.get<any>(this.URL, { params: params });
    }
  }

  getNextPage(url): Observable<any> {
    return this.http.get<any>(url);
  }

  searchByTerm(terms) {
    return terms.pipe(debounceTime(400), distinctUntilChanged(), switchMap(term => this.searchEntries(term)));
  }

  searchEntries(term): Observable<any> {
    if (this.genre.length > 0) {
      let params = new HttpParams();
      params = params.append('topic', this.genre);
      params = params.append('mime_type', 'image');
      params = params.append('search', term);
      return this.http.get<any>(this.URL, { params: params });
    }
  }

}
