
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { Inventory } from '../../models/inventory.model';


@Injectable()
export class ApiProvider {


    constructor(private db: AngularFireDatabase) {
        console.log('Hello ApiProvider Provider');
    }

    public saveInventory(inventory: Inventory) {
        // On retire l'attribut status
        inventory.entries.forEach((i) => {
            delete i['status'];
        });

        inventory.date = firebase.database.ServerValue.TIMESTAMP
        return this.db.list('inventories').push(inventory);
    }

}
