import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListeInventairesPage } from './liste-inventaires';

@NgModule({
  declarations: [
    ListeInventairesPage,
  ],
  imports: [
    IonicPageModule.forChild(ListeInventairesPage),
  ],
})
export class ListeInventairesPageModule {}
