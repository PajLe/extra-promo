import { Action } from "./actionDto";
import { Modifier } from "./modifierDto";

export interface Promotion {
  id: string, // uuid
  type: string,
  description: string,
  actions: Action[];
  modifiers: Modifier[];
  isArchived?: boolean;
}
