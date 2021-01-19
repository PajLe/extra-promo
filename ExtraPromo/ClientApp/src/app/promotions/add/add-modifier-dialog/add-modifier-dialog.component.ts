import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Modifier } from 'typescript';

@Component({
  selector: 'app-add-modifier-dialog',
  templateUrl: './add-modifier-dialog.component.html',
  styleUrls: ['./add-modifier-dialog.component.css']
})
export class AddModifierDialogComponent implements OnInit {
  modifierTypes: string[];

  modifier: Modifier;
  modifierForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddModifierDialogComponent>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeModifierForm();

    this.modifierTypes = [];
    this.fillModifierTypes();
  }

  get modifierValues() {
    return this.modifierForm.get('values') as FormArray;
  }

  private fillModifierTypes(): void {
    this.modifierTypes.push("Start Date");
    this.modifierTypes.push("End Date");
    this.modifierTypes.push("BODO/BOGO");
    this.modifierTypes.push("Promo Code");
    this.modifierTypes.push("Cart min value");
    this.modifierTypes.push("Car max value");
  }

  private initializeModifierForm(): void {
    this.modifierForm = this._formBuilder.group({
      type: ['', Validators.required],
      values: this._formBuilder.array([
        this._formBuilder.control('', Validators.required)
      ])
    })
  }

  addModifierValue(): void {
    this.modifierValues.push(this._formBuilder.control('', Validators.required));
  }

  removeModifierValue(index?: number): void {
    if (index !== null && index !== undefined)
      this.modifierValues.removeAt(index);
    else
      this.modifierValues.removeAt(this.modifierValues.length - 1);
  }

  addModifier(): void {
    this.modifier = Object.assign({}, this.modifierForm.value);
    this.dialogRef.close(this.modifier);
  }

}
