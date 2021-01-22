import { HttpClient } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Action } from '../../_DTOs/actionDto';
import { Modifier } from '../../_DTOs/modifierDto';
import { Promotion } from '../../_DTOs/promotionDto';
import { EditPromotionResponse } from '../../_DTOs/responses/editPromotionResponse';
import { AlertifyService } from '../../_services/alertify.service';
import { AddActionDialogComponent } from '../add/add-action-dialog/add-action-dialog.component';
import { AddModifierDialogComponent } from '../add/add-modifier-dialog/add-modifier-dialog.component';
import { ViewActionDialogComponent } from './view-action-dialog/view-action-dialog.component';
import { ViewModifierDialogComponent } from './view-modifier-dialog/view-modifier-dialog.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  existingModifierIds: string[] = [];
  existingActionIds: string[] = [];
  existingDescription: string;
  existingType: string;
  editedPromotion: Promotion; // mutable
  editPromotionForm: FormGroup;
  promotionTypes: string[];

  initPromo: Promotion;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private _alertifyService: AlertifyService,
    private _http: HttpClient,
    private _route: ActivatedRoute
  ) {
    this.initPromo = this._router.getCurrentNavigation().extras.state?.promotion;
  }

  ngOnInit(): void {
    debugger;
    if (this.initPromo) {
      this.init(this.initPromo);
    }
    else {
      this._http.get(environment.apiUrl + 'promotion/' + this._route.snapshot.paramMap.get('id'))
        .subscribe((response: Promotion) => {
          debugger;
          this.init(response);
        });
    }
  }

  private init(promo: Promotion) {
    this.editedPromotion = promo;
    this.existingModifierIds = promo.modifiers.map(mod => mod.id);
    this.existingActionIds = promo.actions.map(action => action.id);
    this.existingDescription = promo.description;
    this.existingType = promo.type;
    this.editPromotionForm = this._formBuilder.group({
      type: [this.editedPromotion.type, Validators.required],
      description: [this.editedPromotion.description, Validators.required]
    });

    this.promotionTypes = [];
    this.fillPromotionTypes();
  }

  private fillPromotionTypes(): void {
    this.promotionTypes.push("Cart Promotion");
    this.promotionTypes.push("Promo Code");
  }

  cancel(): void {
    this._router.navigate(["/promotions"]);
  }

  addModifierDialog(modifier: Modifier): void {
    let dialogRef;
    if (modifier)
      dialogRef = this._matDialog.open(AddModifierDialogComponent, {
        maxHeight: '650px',
        width: '600px',
        data: {
          modifier: modifier
        }
      });
    else
      dialogRef = this._matDialog.open(AddModifierDialogComponent, {
        maxHeight: '650px',
        width: '600px'
      });
    dialogRef.afterClosed().subscribe((modifier: Modifier) => {
      if (modifier) {
        if (this.editedPromotion.modifiers.filter(mod => mod.type === modifier.type).length === 0)
          this.editedPromotion.modifiers.push(modifier);
        else {
          this._alertifyService.error("Cannot add two modifiers with the same type.");
          this.addModifierDialog(modifier);
        }
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
        this.editedPromotion.actions.push(action);
      }
    });
  }

  removeAction(index: number): void {
    this.editedPromotion.actions = this.editedPromotion.actions.filter((action, i) => i != index);
  }

  editAction(index: number): void {
    const actionToEdit: Action = this.editedPromotion.actions[index];
    const dialogRef = this._matDialog.open(AddActionDialogComponent, {
      maxHeight: '650px',
      width: '600px',
      data: {
        action: actionToEdit
      }
    });
    dialogRef.afterClosed().subscribe((action: Action) => {
      if (action) {
        this.editedPromotion.actions[index] = action;
      }
    });
  }

  removeModifier(index: number): void {
    this.editedPromotion.modifiers = this.editedPromotion.modifiers.filter((modifier, i) => i != index);
  }

  editModifier(index: number): void {
    const modifierToEdit: Modifier = this.editedPromotion.modifiers[index];
    const dialogRef = this._matDialog.open(AddModifierDialogComponent, {
      maxHeight: '650px',
      width: '600px',
      data: {
        modifier: modifierToEdit
      }
    });
    dialogRef.afterClosed().subscribe((modifier: Modifier) => {
      if (modifier) {
        this.editedPromotion.modifiers[index] = modifier;
      }
    });
  }

  cachedActions: Action[] = [];
  viewAction(actionId: string): void {
    const cachedAction: Action[] = this.cachedActions.filter(cachedAction => cachedAction.id === actionId);
    if (cachedAction.length === 1) {
      this._matDialog.open(ViewActionDialogComponent, {
        maxHeight: '650px',
        width: '600px',
        data: {
          action: cachedAction[0],
          actionId: cachedAction[0].id
        }
      });
    } else {
      const dialogRef = this._matDialog.open(ViewActionDialogComponent, {
        maxHeight: '650px',
        width: '600px',
        data: {
          action: undefined,
          actionId: actionId
        }
      });
      dialogRef.afterClosed().subscribe((action: Action) => {
        if (action) {
          this.cachedActions.push(action);
        }
      });
    }
  }

  cachedModifiers: Modifier[] = [];
  viewModifier(modifierId: string): void {
    const cachedModifier: Modifier[] = this.cachedModifiers.filter(cachedModifier => cachedModifier.id === modifierId);
    if (cachedModifier.length === 1) {
      this._matDialog.open(ViewModifierDialogComponent, {
        maxHeight: '650px',
        width: '600px',
        data: {
          modifier: cachedModifier[0],
          modifierId: cachedModifier[0].id
        }
      });
    } else {
      const dialogRef = this._matDialog.open(ViewModifierDialogComponent, {
        maxHeight: '650px',
        width: '600px',
        data: {
          modifier: undefined,
          modifierId: modifierId
        }
      });
      dialogRef.afterClosed().subscribe((modifier: Modifier) => {
        if (modifier) {
          this.cachedModifiers.push(modifier);
        }
      });
    }
  }

  save(): void {
    this.editedPromotion.type = this.editPromotionForm.get('type').value;
    this.editedPromotion.description = this.editPromotionForm.get('description').value;
    const promotionWithEditedFields: Promotion = {
      type: (this.existingType !== this.editedPromotion.type) ? this.editedPromotion.type : null,
      description: (this.existingDescription !== this.editedPromotion.description) ? this.editedPromotion.description : null,
      actions: this.editedPromotion.actions.filter(action => !this.existingActionIds.includes(action.id)),
      modifiers: this.editedPromotion.modifiers.filter(mod => !this.existingModifierIds.includes(mod.id)),
      id: this.editedPromotion.id
    };

    this._http.put(environment.apiUrl + 'promotion/edit/' + promotionWithEditedFields.id, promotionWithEditedFields).pipe(
      tap((response: EditPromotionResponse) => {
        if (!response.status) {
          this._alertifyService.error(response.message ?? "Couldn't insert the promotion.");
        } else {
          this._alertifyService.success(response.message ?? "Successfully added the promotion.");
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
