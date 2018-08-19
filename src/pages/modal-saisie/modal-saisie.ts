import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, AlertController } from 'ionic-angular';
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { BARCODESCANNER_OPTIONS } from '../../app/barcodeScanner.options';

/**
 * Generated class for the ModalSaisiePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-modal-saisie',
    templateUrl: 'modal-saisie.html',
})
export class ModalSaisiePage {

    public data = { qty: 1, code: undefined };
    public type;
    private wasScanning: boolean;
    public entry;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private viewCtrl: ViewController,
        private barcodeScanner: BarcodeScanner,
        private platform: Platform,
        private alertCtrl: AlertController
    ) {

        /**
         * Quand on appuie sur le bouton retour du telephone et pas sur "annuler"
         */
        this.platform.registerBackButtonAction(() => {
            if (!this.wasScanning) {
                this.cancel();
            }
        }, 2);

        // on récupère le type : scan / manual / modify pour afficher la bonne vue
        this.type = navParams.get('type');
        console.log(this.type);



        // Si type est modify, on récupère les données
        if (this.type == "modify") {
            this.entry = navParams.get('entry');
            console.log("entry");
            console.log(this.entry);

            this.data.code = this.entry.code;
            this.data.qty = this.entry.qty;
        }

        // Si on veut utliser le lecteur de codes barre, on l'affiche
        if (this.type === 'scan') {
            this.scan();
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ModalSaisiePage');
    }

    confirm() {
        console.log('Confirm');
        let returnData = { status: 'confirmed', ...this.data }
        console.log(returnData);
        this.viewCtrl.dismiss(returnData);
    }

    confirmAndContinue() {
        console.log('Confirm and continue');
        let returnData = { status: 'continue', ...this.data }
        console.log(returnData);
        this.viewCtrl.dismiss(returnData);
    }

    cancel() {
        let returnData = { status: 'cancelled', ...this.data }
        console.log(returnData);
        this.viewCtrl.dismiss(returnData);
    }

    scan() {

        this.barcodeScanner.scan(BARCODESCANNER_OPTIONS).then(barcodeData => {
            console.log('Barcode data', barcodeData);
            if (!barcodeData.cancelled) {
                this.wasScanning = false;
                // Si pas annulé, on continue
                // On retire le premier caratère de barcodeData.text si il est de format DATA_MATRIX
                if (barcodeData.format === 'DATA_MATRIX') {
                    this.data.code = barcodeData.text.slice(1, barcodeData.text.length);
                }
                else {
                    this.data.code = barcodeData.text;
                }
            } else {
                // Si annulé, on ferme la page
                this.wasScanning = true;
                console.log('Scan annulé');
            }
        }).catch(err => {
            this.wasScanning = false;
            console.log('Error', err);
        });
    }

    changeQty(x: number) {
        console.log("changesty");
        console.log(x);
        this.data.qty += x;
        if (this.data.qty <= 0) {
            this.data.qty = 1;
        }
    }

    delete() {
        let alert = this.alertCtrl.create({
            title: 'Supprimer',
            message: 'Êtes vous sûr ?',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel'
                },
                {
                    text: 'Supprimer',
                    handler: () => {
                        console.log('Delete !');
                        let returnData = { status: 'delete' }
                        console.log(returnData);
                        this.viewCtrl.dismiss(returnData);
                    }
                }
            ]
        });
        alert.present();
    }
}
