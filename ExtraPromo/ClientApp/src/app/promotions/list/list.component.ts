import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Promotion } from '../../_DTOs/promotionDto';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-list-component',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  promotions: Promotion[];
  colCount: number;
  basePromoInfoColCount: number = 3;

  constructor(
    private _http: HttpClient,
    private _alertifyService: AlertifyService
  ) { }

  ngOnInit(): void {
    this.fetchPromotions();
    
  }

  fetchPromotions(): void {
    this._http.get(environment.apiUrl + 'promotion/all').pipe(
      tap((response: Promotion[]) => {
        if (response) {
          this.promotions = response
        } else {
          this.promotions = [];
          this._alertifyService.error("Error while fetching promotions");
        }
      },
        error => {
          this._alertifyService.error("Unknown error.");
          console.log(error.message);
        })
    ).subscribe();
  }
}
