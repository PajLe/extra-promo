import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Action } from '../../_DTOs/actionDto';
import { Modifier } from '../../_DTOs/modifierDto';
import { Promotion } from '../../_DTOs/promotionDto';
import { AlertifyService } from '../../_services/alertify.service';
import { AddActionDialogComponent } from './add-action-dialog/add-action-dialog.component';
import { AddModifierDialogComponent } from './add-modifier-dialog/add-modifier-dialog.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  addPromotionForm: FormGroup;
  promotionTypes: string[];

  promotion: Promotion;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _alertifyService: AlertifyService,
    private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.promotionTypes = [];
    this.fillPromotionTypes();

    this.createAddPromotionForm();

    this.initializePromotionObject();
  }

  private createAddPromotionForm(): void {
    this.addPromotionForm = this._formBuilder.group({
      type: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  private initializePromotionObject(): void {
    this.promotion = {
      id: -1,
      actions: [],
      modifiers: [],
      description: '',
      type: ''
    };
  }

  private fillPromotionTypes(): void {
    this.promotionTypes.push("Cart Promotion");
    this.promotionTypes.push("Promo Code");
  }

  add(): void {
    
  }

  cancel(): void {
    this._router.navigate(["/promotions"]);
  }

  addModifierDialog(): void {
    const dialogRef = this._matDialog.open(AddModifierDialogComponent, {
      maxHeight: '650px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((modifier: Modifier) => {
      if (modifier) {
        this.promotion.modifiers.push(modifier);
      }
    });
  }

  addActionDialog(): void {
    const dialogRef = this._matDialog.open(AddActionDialogComponent, {
      maxHeight: '650px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((action: Action) => {
      if (action) {
        this.promotion.actions.push(action);
      }
    });
  }

  removeAction(index: number): void {
    this.promotion.actions = this.promotion.actions.filter((action, i) => i != index);
  }

  editAction(index: number): void {
    const actionToEdit: Action = this.promotion.actions[index];
    const dialogRef = this._matDialog.open(AddActionDialogComponent, {
      maxHeight: '650px',
      width: '600px',
      data: {
        action: actionToEdit
      }
    });
    dialogRef.afterClosed().subscribe((action: Action) => {
      if (action) {
        this.promotion.actions[index] = action;
      }
    });
  }

  removeModifier(index: number): void {
    this.promotion.modifiers = this.promotion.modifiers.filter((modifier, i) => i != index);
  }

  editModifier(index: number): void {
    const modifierToEdit: Modifier = this.promotion.modifiers[index];
    const dialogRef = this._matDialog.open(AddModifierDialogComponent, {
      maxHeight: '650px',
      width: '600px',
      data: {
        modifier: modifierToEdit
      }
    });
    dialogRef.afterClosed().subscribe((modifier: Modifier) => {
      if (modifier) {
        this.promotion.modifiers[index] = modifier;
      }
    });
  }
}
