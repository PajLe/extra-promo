export interface Action {
  type: string;
  items?: string[];
  flat?: number;
  percentage?: number,
  freeShip?: boolean
}
