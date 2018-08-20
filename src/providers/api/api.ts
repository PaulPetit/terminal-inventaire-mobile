
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { Inventory } from '../../models/inventory.model';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'


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

    public getInventories() {
        return this.db.list<Inventory>('inventories', ref => ref.orderByChild('date')).snapshotChanges()
            .map((changes => {
                return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
            })).take(1);
    }

    public deleteItem(key) {
        return this.db.list('inventories').remove(key);
    }


    public updateInventory(inventory: Inventory) {

        let key = inventory.key;
        delete inventory.key;
        // On retire l'attribut status
        inventory.entries.forEach((i) => {
            delete i['status'];
        });

        inventory.date = firebase.database.ServerValue.TIMESTAMP
        return this.db.list('inventories').update(key, inventory);
    }
}
