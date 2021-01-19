import { Action } from "./actionDto";
import { Modifier } from "./modifierDto";

export interface Promotion {
  id: number,
  type: string,
  description: string,
  actions: Action[];
  modifiers: Modifier[];
}
