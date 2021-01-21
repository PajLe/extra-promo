import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Promotion } from '../../_DTOs/promotionDto';
import { AlertifyService } from '../../_services/alertify.service';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';

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
    private _alertifyService: AlertifyService,
    private _matDialog: MatDialog
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

  removePromo(promotion: Promotion): void {
    let dialogRef;
    dialogRef = this._matDialog.open(DeleteConfirmDialogComponent, {
      data: promotion.id
    });
    dialogRef.afterClosed().subscribe((answer: boolean) => {
      if (answer) {
        this.deletePromotion(promotion);
      }
    });
  }

  editPromo(promotion: Promotion): void {

  }

  private deletePromotion(promotion: Promotion) {
    console.log("ASDSADASD");
  }
}
