import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Action } from '../../../_DTOs/actionDto';

@Component({
  selector: 'app-view-action-dialog',
  templateUrl: './view-action-dialog.component.html',
  styleUrls: ['./view-action-dialog.component.css']
})
export class ViewActionDialogComponent implements OnInit {

  action: any = new BehaviorSubject(null);
  act = this.action.asObservable();

  constructor(
    private _http: HttpClient,
    public dialogRef: MatDialogRef<ViewActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data.action) {
      this.action.next(this.data.action);
    } else {
      this._http.get<Action>(environment.apiUrl + "promotion/action/" + this.data.actionId).subscribe(
        response => {
          this.action.next(response);
        }
      );
    }
  }

  close(): void {
    this.dialogRef.close(this.action.value);
  }
}
