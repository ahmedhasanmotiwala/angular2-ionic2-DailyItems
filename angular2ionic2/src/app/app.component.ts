import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { SQLite } from 'ionic-native';
import { HomePage } from '../pages/home/home';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      let db = new SQLite();
            db.openDatabase({
                name: "data.db",
                location: "default"
            }).then(() => {
                db.executeSql("CREATE TABLE IF NOT EXISTS tblItems (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, qty TEXT, cost TEXT, total TEXT, date TEXT)", {}).then((data) => {
                    //alert("TABLE CREATED: " + data);
                }, (error) => {
                    alert("Unable to execute sql" + error);
                })
            }, (error) => {
                alert("Unable to open database" + error);
            });

    });
  }
}
