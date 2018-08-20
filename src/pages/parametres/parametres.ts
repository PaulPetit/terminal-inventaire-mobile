import { ParametersProvider } from './../../providers/parameters/parameters';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DEFAULT_PARAMS } from '../../app/default.params';

/**
 * Generated class for the ParametresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parametres',
  templateUrl: 'parametres.html',
})
export class ParametresPage {


  public parameters = DEFAULT_PARAMS;


  constructor(public navCtrl: NavController, public navParams: NavParams, private parametersProvider: ParametersProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParametresPage');
  }

  ionViewWillEnter() {
    this.loadParameters();
  }

  public saveParameters() {
    this.parametersProvider.saveParameters(this.parameters);
  }

  private loadParameters() {
    this.parametersProvider.loadParameters().then(value => {
      // On charge les paramètres seulement si ils existent !
      if (value != null) {
        this.parameters = value;
      }
    });
  }

}
