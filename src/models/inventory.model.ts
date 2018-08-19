import { Entry } from "./entry.model";

export interface Inventory {
    name?: string;
    date?: object;
    entries?: Entry[];
}