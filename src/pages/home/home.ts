import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController, private alertCtrl: AlertController, private storage: Storage) {

    }

    newInventory() {
        this.storage.get('localInventory').then(data => {
            let localInventory = data;

            if (!localInventory) {
                this.navCtrl.push('SaisieInventairePage');
            }
            else {
                let alert = this.alertCtrl.create({
                    title: 'Inventaire',
                    message: 'Un inventaire est déjà présent en mémoire, voullez vous le reprendre ou créer un nouveau ?',
                    buttons: [
                        {
                            text: "Reprendre l'inventaire",
                            handler: () => {
                                this.navCtrl.push('SaisieInventairePage');

                            }
                        },
                        {
                            text: 'Créer un nouvel inventaire',
                            handler: () => {
                                this.storage.remove('localInventory').then(() => {
                                    this.navCtrl.push('SaisieInventairePage');
                                });

                            }
                        }
                    ]
                });
                alert.present();
            }
        });

    }

}

