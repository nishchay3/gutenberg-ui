import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CatalogueService } from './catalogue.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {

  genre: string = '';
  nextPage: string = '';
  bookList = [];
  showError: boolean = false;
  errorMessage: string = '';
  searchTerm$ = new Subject<string>();

  constructor(private route: ActivatedRoute, private catalogueService: CatalogueService, private router: Router) {
    this.catalogueService.searchByTerm(this.searchTerm$).subscribe(data => {
      this.bookList = data.results;
      this.nextPage = data.next;
    }, (error) => {
      console.log(error);
      this.errorMessage = "Server Unreachable!";
      this.showError = true;
    });
  }

  ngOnInit(): void {
    this.genre = this.route.snapshot.paramMap.get('genre');
    this.genre = this.genre.charAt(0).toUpperCase() + this.genre.slice(1);
    this.catalogueService.genre = this.genre;
    this.getAllByGenre();
  }

  getAllByGenre() {
    this.catalogueService.getAllGenre().subscribe((data) => {
      if (data) {
        this.bookList = data.results;
        this.nextPage = data.next;
      }
    }, (error) => {
      console.log(error);
      this.errorMessage = "Server Unreachable!";
      this.showError = true;
    })
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (this.nextPage) {
        this.catalogueService.getNextPage(this.nextPage).subscribe((data) => {
          this.bookList.push(...data.results);
          this.nextPage = data.next;
        }, (error) => {
          console.log(error);
          this.errorMessage = "Server Unreachable!";
          this.showError = true;
        });
      }
    }
  }

  trackByBookId(index: number, bookList: any) {
    return bookList.id;
  }

  openBook(book: any) {
    let formats = book.formats;
    let availableFormats = {
      html: null,
      pdf: null,
      text: null
    };
    for (let index in formats) {
      if (formats[index].endsWith(".html") || formats[index].endsWith(".htm")) {
        availableFormats.html = formats[index];
      }
      if (formats[index].endsWith(".pdf")) {
        availableFormats.pdf = formats[index];
      }
      if (formats[index].endsWith(".txt")) {
        availableFormats.text = formats[index];
      }
    }
    if (availableFormats.html) {
      window.location.href = availableFormats.html;
    } else if (availableFormats.pdf) {
      window.location.href = availableFormats.pdf;
    } else if (availableFormats.text) {
      window.location.href = availableFormats.text;
    } else {
      this.errorMessage = "No viewable version available.";
      this.showError = true;
    }
  }

}
