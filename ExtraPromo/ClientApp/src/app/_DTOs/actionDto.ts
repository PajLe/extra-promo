export interface Action {
  id: string; // uuid
  type: string;
  items?: string[];
  flat?: number;
  percentage?: number,
  freeShip?: boolean
}
