import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  genre: string = "";
  private URL: string = "http://skunkworks.ignitesol.com:8000/books";

  constructor(private http: HttpClient, private router: Router) { }

  getAllGenre(): Observable<any> {
    let params = new HttpParams();
    params = params.append('topic', this.genre);
    params = params.append('mime_type', 'image');
    if (this.genre.length > 0) {
      return this.http.get<any>(this.URL, { params: params });
    }
  }

  getNextPage(url): Observable<any> {
    return this.http.get<any>(url);
  }

}
