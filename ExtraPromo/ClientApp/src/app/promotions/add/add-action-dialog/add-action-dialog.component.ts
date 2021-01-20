import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Action } from '../../../_DTOs/actionDto';

@Component({
  selector: 'app-add-action-dialog',
  templateUrl: './add-action-dialog.component.html',
  styleUrls: ['./add-action-dialog.component.css']
})
export class AddActionDialogComponent implements OnInit {

  actionTypes: string[];

  action: Action;
  actionForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddActionDialogComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initializeActionForm();

    this.actionTypes = [];
    this.fillActionTypes();
  }

  get actionItems() {
    return this.actionForm.get('items') as FormArray;
  }

  private fillActionTypes(): void {
    this.actionTypes.push("Item Discount");
    this.actionTypes.push("Upsale");
    this.actionTypes.push("Cart Discount");
  }

  private initializeActionForm(): void {
    if (this.data?.action) {
      const actionData: Action = this.data.action;
      this.actionForm = this._formBuilder.group({
        type: [actionData.type, Validators.required],
        flat: [actionData.flat, Validators.required],
        percentage: [actionData.percentage, Validators.required],
        freeShip: [actionData.freeShip],
        items: this._formBuilder.array(actionData.items)
      });
    } else {
      this.actionForm = this._formBuilder.group({
        type: ['', Validators.required],
        flat: [0.0, Validators.required],
        percentage: [0.0, Validators.required],
        freeShip: [false],
        items: this._formBuilder.array([])
      });
    }

  }

  addActionItem(): void {
    this.actionItems.push(this._formBuilder.control('', Validators.required));
  }

  removeActionItem(index?: number): void {
    if (index !== null && index !== undefined)
      this.actionItems.removeAt(index);
    else
      this.actionItems.removeAt(this.actionItems.length - 1);
  }

  addAction(): void {
    this.action = Object.assign({}, this.actionForm.value);
    this.dialogRef.close(this.action);
  }

  isInvalid(): boolean {
    const flat: number = this.actionForm.get('flat').value;
    const percentage: number = this.actionForm.get('percentage').value;
    const freeShip: boolean = this.actionForm.get('freeShip').value;

    let result: boolean = this.actionForm.get('flat').value === ''
      && this.actionForm.get('percentage').value === ''
      || flat === 0 && percentage === 0 && freeShip === false;

    if (this.actionForm.get('type').value !== 'Cart Discount' && this.actionItems.controls.length === 0)
      result = true;

    return result;
  }

  validateFormFields(): void {
    if (this.actionForm.get('type').value === 'Cart Discount') {
      this.actionItems.controls = [];
      this.actionForm.value.items = [];
    }
  }
}
