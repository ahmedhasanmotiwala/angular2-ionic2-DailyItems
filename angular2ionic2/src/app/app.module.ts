import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { sqlLiteService } from '../Services/sqlLite.service';
import { homeComponent} from '../pages/home/home.component';
import { ApiCallService } from '../Services/ApiCall.service';
import { LoadingController } from 'ionic-angular';
import {Network} from "ionic-native";
import { DALService } from '../Services/dal.service';
import { ItemsDTO } from '../pages/home/Items.dto';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    homeComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [DALService,ItemsDTO,sqlLiteService,Network,ApiCallService,LoadingController,
  {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
