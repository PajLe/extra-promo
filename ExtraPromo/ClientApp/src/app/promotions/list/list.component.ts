import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Promotion } from '../../_DTOs/promotionDto';
import { DeletePromotionResponse } from '../../_DTOs/responses/deletePromotionResponse';
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
    private _matDialog: MatDialog,
    private _router: Router
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
    this._router.navigate(['/promotions/edit', promotion.id], { state: { promotion: promotion } });
  }

  private deletePromotion(promotion: Promotion) {
    this._http.delete(environment.apiUrl + 'promotion/delete/' + promotion.id).pipe(
      tap((response: DeletePromotionResponse) => {
        if (!response.status) {
          this._alertifyService.error(response.message ?? "Couldn't delete the promotion.");
        } else {
          this._alertifyService.success(response.message ?? "Successfully deleted the promotion.");
          this.promotions = this.promotions.filter(promo => promo.id !== promotion.id);
          this._router.navigate(["/promotions"]);
        }
      },
        error => {
          this._alertifyService.error("Unknown error.");
          console.log(error.message);
        })
    ).subscribe();
  }
}
