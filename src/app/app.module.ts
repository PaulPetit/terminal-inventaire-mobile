
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { ApiProvider } from '../providers/api/api';

import { AngularFireModule } from "angularfire2";
import { FIREBASE_CREDENTIALS } from "./firebase.credentials";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { IonicStorageModule } from '@ionic/storage';

import { Network } from '@ionic-native/network';
import { ParametersProvider } from '../providers/parameters/parameters';

@NgModule({
    declarations: [
        MyApp,
        HomePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(FIREBASE_CREDENTIALS),
        AngularFireDatabaseModule,
        IonicStorageModule.forRoot({
            name: '__mydb',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        }),


    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        BarcodeScanner,
        ApiProvider,
        Network,
    ParametersProvider
    ]
})
export class AppModule {
}
