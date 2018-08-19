import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSaisiePage } from './modal-saisie';

@NgModule({
  declarations: [
    ModalSaisiePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalSaisiePage),
  ],
})
export class ModalSaisiePageModule {}
