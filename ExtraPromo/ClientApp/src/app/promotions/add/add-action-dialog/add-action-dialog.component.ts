import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
    private _formBuilder: FormBuilder
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
    this.actionForm = this._formBuilder.group({
      type: ['', Validators.required],
      flatDiscount: [0.0, Validators.required],
      percentageDiscount: [0.0, Validators.required],
      freeShip: [false],
      items: this._formBuilder.array([])
    })
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
    const flat: number = this.actionForm.get('flatDiscount').value;
    const percentage: number = this.actionForm.get('percentageDiscount').value;
    const freeShip: boolean = this.actionForm.get('freeShip').value;

    let result: boolean = this.actionForm.get('flatDiscount').value === ''
      && this.actionForm.get('percentageDiscount').value === ''
      || flat === 0 && percentage === 0 && freeShip === false;

    if (this.actionForm.get('type').value !== 'Cart Discount' && this.actionItems.controls.length === 0)
      result = true;

    return result;
  }

  validateFormFields(): void {
    if (this.actionForm.get('type').value === 'Cart Discount')
      this.actionItems.controls = [];
  }
}
