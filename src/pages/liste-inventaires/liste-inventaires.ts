
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';




@IonicPage()
@Component({
  selector: 'page-liste-inventaires',
  templateUrl: 'liste-inventaires.html',
})
export class ListeInventairesPage {

  public inventories;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider, private alertCtrl: AlertController) {
    //this.inventories = this.db.list('inventories').valueChanges()
  }

  ionViewWillEnter() {
    this.getInventories();
  }

  getInventories() {
    this.inventories = [];
    this.api.getInventories().subscribe(data => {
      data.reverse();
      this.inventories = data;
    });
  }

  public showOptions(item) {
    let alert = this.alertCtrl.create({
      title: 'Inventaire',
      message: 'Que souhaitez-vous faire ?',
      buttons: [
        {
          cssClass: 'alertSuppBtn',
          text: 'Supprimer',
          handler: () => {
            this.confirmSupp(item);
          }
        },
        {
          text: 'Modifier',
          handler: () => {
            this.modifyInventory(item);
          }
        }
      ]
    });
    alert.present();
  }

  private confirmSupp(item) {
    let alert = this.alertCtrl.create({
      title: 'Suppression',
      message: 'Êtes vous sur ?',
      buttons: [
        {
          cssClass: 'alertSuppBtn',
          text: 'Supprimer',
          handler: () => {
            this.deleteInventoryItem(item)
          }
        },
        {
          text: 'Annuler'
        }
      ]
    });
    alert.present();
  }

  private deleteInventoryItem(item) {
    console.log("Supression de l'item " + item.key);
    this.api.deleteItem(item.key).then(() => {
      this.getInventories();
    });

  }

  private modifyInventory(item) {
    console.log("Modification de l'inventaire");
    console.log(item);
    this.navCtrl.push('SaisieInventairePage', { type: "modification", data: item });
  }

}
