import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import { Platform } from 'ionic-angular';


@Injectable()
export class DALService {

    public database: SQLite;
    public data : any;
    
    constructor(public platform: Platform) {
        // Constants
        let dbName = "data.db";
        let location = "default";

        this.platform.ready().then(() => {
            this.database = new SQLite();
            this.database.openDatabase({name: dbName, location: location}).then(() => {
            }, (error) => {
                alert("ERROR: "+ error);
            });
        });
    }
    
    public executeSql(command: string, params: any): Promise<any> {
         return new Promise(resolve => {
            this.database.executeSql(command, params).then((data) => {
                console.log("Success: " + JSON.stringify(data));
                this.data = data;
                resolve(this.data);
            },(error) => {
                alert("ERROR: " + JSON.stringify(error.err));
            }); 
            
      });
    } 
    
}