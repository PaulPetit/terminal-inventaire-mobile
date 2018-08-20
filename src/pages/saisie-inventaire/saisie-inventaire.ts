import { Network } from '@ionic-native/network';
import { Inventory } from './../../models/inventory.model';
import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
    selector: 'page-saisie-inventaire',
    templateUrl: 'saisie-inventaire.html',
})
export class SaisieInventairePage {

    public inventory: Inventory = { entries: [] };
    private showAlertMessage: boolean;
    public type;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController,
        private api: ApiProvider,
        private storage: Storage,
        private _net: Network
    ) {
        this.showAlertMessage = true;

        // Quand on modifie un inventaire existant
        this.type = this.navParams.get('type');

        if (this.type == "modification") {
            console.log("SaisieInventairePage Modification !");
            this.inventory = this.navParams.get('data');
        } else {
            // On regarde si il y a un inventaire en mémoire, si oui on le charge
            this.storage.get('localInventory').then(data => {
                if (data !== null) {
                    this.inventory = data;

                    // Si on à arrête la modification, on veut la reprendre à partir de la memoire
                    // Donc si il y a key dans data, c'est une modification

                    if (this.inventory.key != undefined || this.inventory.key != null) {
                        // On reprend la modification
                        console.log("SaisieInventairePage reprise Modification ! a partir de la memoire");
                        this.type = "modification";
                    }
                }
            });
        }


    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SaisieInventairePage');
    }

    ionViewCanLeave() {
        if (this.showAlertMessage) {
            let alert = this.alertCtrl.create({
                title: 'Confirmer',
                message: 'Êtes vous sur de vouloir quitter la saisie en cours ? Les données seront sauvegardées !',
                buttons: [
                    {
                        text: 'Annuler',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');

                        }
                    },
                    {
                        text: 'Quitter',
                        handler: () => {
                            this.showAlertMessage = false;
                            this.navCtrl.pop();
                        }
                    }
                ]
            });
            alert.present();
            return false;
        }
    }

    showManualModal() {
        console.log('Saisie Manuelle');
        let modal = this.modalCtrl.create('ModalSaisiePage', { type: 'manual' });
        modal.onDidDismiss(data => {
            console.log(data);
            if (data.code !== undefined && (data.status === 'confirmed' || data.status === 'continue')) {
                this.inventory.entries.push(data);
                this.saveInventoryLocal();
            }
            if (data.status === 'continue') {
                modal.present();
            }
        });
        modal.present();
    }

    showScanModal() {
        console.log('Saisie par scan');
        let modal = this.modalCtrl.create('ModalSaisiePage', { type: 'scan' });
        modal.onDidDismiss(data => {
            console.log(data);
            if (data.code !== undefined && (data.status === 'confirmed' || data.status === 'continue')) {
                this.inventory.entries.push(data);
                this.saveInventoryLocal();
            }
            if (data.status === 'continue') {
                modal.present();
            }
        });
        modal.present();
    }

    validateInventory() {
        console.log(this.inventory);

        // On vérifie que l'inventaire ne soit pas vide ou sans nom
        if (this.inventory.name == undefined || this.inventory.name == "" || this.inventory.entries.length <= 0) {
            // On refuse
            let errorMessage = ""
            if (this.inventory.name == undefined || this.inventory.name == "") {
                errorMessage += "Le nom de l'inventaire ne doit pas être vide !";
            }
            if (this.inventory.entries.length <= 0) {
                if (errorMessage != "") {
                    errorMessage += "<br>";
                }
                errorMessage += "La liste des produits ne doit pas être vide !";
            }


            let alert = this.alertCtrl.create({
                title: "Erreur",
                message: errorMessage,
                buttons: ["OK"]

            });
            alert.present();
        }
        else {
            // On accepte
            let alert = this.alertCtrl.create({
                title: "Valider l'inventaire",
                message: "Êtes vous sûr de vouloir valider l'inventaire ?",
                buttons: [
                    {
                        text: 'Annuler',
                        role: 'cancel',

                    },
                    {
                        text: 'Oui',
                        handler: () => {
                            if (this.isConnectedToInternet()) {

                                // Si c'est une modification d'inventaire, on update avec la key

                                if (this.type == "modification") {
                                    this.api.updateInventory(this.inventory).then(v => {
                                        let alert = this.alertCtrl.create({
                                            title: "Valider l'inventaire",
                                            subTitle: 'Inventaire modifié !',
                                            buttons: [
                                                {
                                                    text: 'OK',
                                                    handler: () => {
                                                        this.storage.remove('localInventory').then(() => {
                                                            this.showAlertMessage = false;
                                                            this.navCtrl.pop();
                                                        })
                                                    }
                                                }
                                            ]
                                        });
                                        alert.present();
                                    }, error => {
                                        this.alertCtrl.create({ title: "erreur" }).present()
                                    });
                                } else {
                                    // Si c'est un nouvel inventaire, on le sauvegarde

                                    this.api.saveInventory(this.inventory).then(v => {
                                        let alert = this.alertCtrl.create({
                                            title: "Valider l'inventaire",
                                            subTitle: 'Inventaire transmis !',
                                            buttons: [
                                                {
                                                    text: 'OK',
                                                    handler: () => {
                                                        this.storage.remove('localInventory').then(() => {
                                                            this.showAlertMessage = false;
                                                            this.navCtrl.pop();
                                                        })
                                                    }
                                                }
                                            ]
                                        });
                                        alert.present();
                                    }, error => {
                                        this.alertCtrl.create({ title: "erreur" }).present()
                                    });
                                }


                            }
                            else {
                                let alert = this.alertCtrl.create({
                                    title: 'Erreur',
                                    subTitle: 'Vous devez être connecté à internet !',
                                    buttons: ['ok']
                                });
                                alert.present();
                            }

                        }
                    }
                ]
            });
            alert.present();
        }

    }

    modifyEntry(index: number) {
        console.log('Modification');
        console.log('index : ' + index);
        let modal = this.modalCtrl.create('ModalSaisiePage', { type: 'modify', entry: this.inventory.entries[index] });
        modal.onDidDismiss(data => {
            console.log(data);
            if (data.code !== undefined && (data.status === 'confirmed' || data.status === 'continue')) {
                // mettre l'index ici
                this.inventory.entries[index] = data;
                this.saveInventoryLocal();
            }
            if (data.status === 'delete') {
                this.inventory.entries.splice(index, 1);
                this.saveInventoryLocal();
            }

        });
        modal.present();
    }

    saveInventoryLocal() {
        this.storage.set('localInventory', this.inventory);
    }

    isConnectedToInternet(): boolean {
        let conntype = this._net.type;
        return conntype && conntype !== 'unknown' && conntype !== 'none';
    }

}
