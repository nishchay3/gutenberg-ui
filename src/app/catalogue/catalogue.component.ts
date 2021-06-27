import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { BookData } from './models/book-data';
import { CatalogueService } from './services/catalogue.service';

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

  @ViewChild('search') searchBox;

  constructor(private route: ActivatedRoute, private catalogueService: CatalogueService) { }

  ngOnInit(): void {
    this.genre = this.route.snapshot.paramMap.get('genre');
    this.genre = this.genre.charAt(0).toUpperCase() + this.genre.slice(1);
    this.catalogueService.genre = this.genre;
    this.getAllByGenre();
    this.catalogueService.searchByTerm(this.searchTerm$).subscribe((data: BookData) => {
      this.bookList = data.results;
      this.nextPage = data.next;
    }, (error) => {
      console.log(error);
      this.errorMessage = "Server Unreachable!";
      this.showError = true;
    });
  }

  getAllByGenre(): void {
    this.catalogueService.getAllGenre().subscribe((data: BookData) => {
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
        this.catalogueService.getNextPage(this.nextPage).subscribe((data: BookData) => {
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

  trackByBookId(index: number, bookList: any): number {
    return bookList.id;
  }

  openBook(book: any): void {
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
      window.open(availableFormats.html, "_blank");
    } else if (availableFormats.pdf) {
      window.open(availableFormats.pdf, "_blank");
    } else if (availableFormats.text) {
      window.open(availableFormats.text, "_blank");
    } else {
      this.errorMessage = "No viewable version available.";
      this.showError = true;
    }
  }

  clearSearch(): void {
    this.searchBox.nativeElement.value = '';
    this.searchTerm$.next('');
  }

}
