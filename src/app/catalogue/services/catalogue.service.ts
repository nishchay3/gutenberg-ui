import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BookData } from '../models/book-data';
@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  genre: string = "";
  private URL: string = "https://gutendex.com/books";

  constructor(private http: HttpClient, private router: Router) { }

  getAllGenre(): Observable<BookData> {
    if (this.genre.length > 0) {
      let params = new HttpParams();
      params = params.append('topic', this.genre);
      params = params.append('mime_type', 'image');
      return this.http.get<BookData>(this.URL, { params: params });
    }
  }

  getNextPage(url): Observable<BookData> {
    return this.http.get<BookData>(url);
  }

  searchByTerm(terms): Observable<BookData> {
    return terms.pipe(debounceTime(400), distinctUntilChanged(), switchMap((term: string) => this.searchEntries(term)));
  }

  private searchEntries(term: string): Observable<BookData> {
    if (this.genre.length > 0) {
      let params = new HttpParams();
      params = params.append('topic', this.genre);
      params = params.append('mime_type', 'image');
      params = params.append('search', term);
      return this.http.get<BookData>(this.URL, { params: params });
    }
  }

}
