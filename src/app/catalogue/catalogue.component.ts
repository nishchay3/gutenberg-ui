import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogueService } from './catalogue.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {

  genre: string = '';
  nextPage:string = '';
  bookList = [];

  constructor(private route: ActivatedRoute, private catalogueService: CatalogueService) { }

  ngOnInit(): void {
    this.genre = this.route.snapshot.paramMap.get('genre');
    this.genre = this.genre.charAt(0).toUpperCase() + this.genre.slice(1);
    this.catalogueService.genre = this.genre;
    this.getAllByGenre();
  }

  getAllByGenre() {
    this.catalogueService.getAllGenre().subscribe((data) => {
      if (data) {
        console.log(data);
        this.bookList = data.results;
        this.nextPage = data.next;
      }
    }, (error) => {
      console.log(error);
    })
  }

}
