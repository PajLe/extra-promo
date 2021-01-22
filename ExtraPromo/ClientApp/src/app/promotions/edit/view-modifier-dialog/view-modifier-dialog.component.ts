import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Modifier } from '../../../_DTOs/modifierDto';

@Component({
  selector: 'app-view-modifier-dialog',
  templateUrl: './view-modifier-dialog.component.html',
  styleUrls: ['./view-modifier-dialog.component.css']
})
export class ViewModifierDialogComponent implements OnInit {

  modifier: any = new BehaviorSubject(null);
  mod = this.modifier.asObservable();

  constructor(
    private _http: HttpClient,
    public dialogRef: MatDialogRef<ViewModifierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data.modifier) {
      this.modifier.next(this.data.modifier);
    } else {
      this._http.get<Modifier>(environment.apiUrl + "promotion/modifier/" + this.data.modifierId).subscribe(
        response => {
          this.modifier.next(response);
        }
      );
    }
  }

  close(): void {
    this.dialogRef.close(this.modifier.value);
  }
}
