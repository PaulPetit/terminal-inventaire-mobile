import { DEFAULT_PARAMS } from './../../app/default.params';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

/*
  Generated class for the ParametersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ParametersProvider {

  constructor(private storage: Storage) {
    console.log('Hello ParametersProvider Provider');
  }



  public saveParameters(parameters) {
    return this.storage.set('parameters', parameters);
  }

  public loadParameters() {
    return this.storage.get('parameters');
  }

  public getParameter(key) {
    return this.storage.get('parameters').then(value => {
      if (value == null) {
        return DEFAULT_PARAMS[key];
      }
      return value[key];
    });
  }
}
