import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaisieInventairePage } from './saisie-inventaire';

@NgModule({
  declarations: [
    SaisieInventairePage,
  ],
  imports: [
    IonicPageModule.forChild(SaisieInventairePage),
  ],
})
export class SaisieInventairePageModule {}
