import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { ApiCallService } from './ApiCall.service';

@Injectable()
export class sqlLiteService {

    public database: SQLite;
    public item : any;
    public Items: any;
    public AllItems;
    public invoice = {
              items: [{
                    qty: 1,
                    description: '',
                    cost: 0
              }]
            };

    constructor(public navController: NavController, public platform: Platform, public ApiCallService : ApiCallService ) {
        this.platform.ready().then(() => {
            this.database = new SQLite();
            this.database.openDatabase({name: "data.db", location: "default"}).then(() => {
                //this.refresh();
            }, (error) => {
                alert("ERROR: "+ error);
            });
            
        });
    } 
 
    // public add(description,qty,cost,date) {
    //     this.database.executeSql("Delete from tblItems where date=?", [date]).then((data) => {
    //         console.log("DELETED: " + JSON.stringify(data));
    //         this.database.executeSql("INSERT INTO tblItems (description, qty, cost, total, date) VALUES ('"+description+"','"+qty+"','"+cost+"','"+qty * cost+"','"+date+"')", []).then((data) => {
    //         console.log("INSERTED: " + JSON.stringify(data));
    //     }, (error) => {
    //         alert("Insert ERROR: " + JSON.stringify(error.err));
    //     });
    //     }, (error) => {
    //         alert("Delete ERROR: " + JSON.stringify(error.err));
    //     }); 
    // }

    // public refresh(today) : any {
    //     this.database.executeSql("SELECT * FROM tblItems where date =?", [today]).then((data) => {
    //         this.invoice.items = [];
    //         if(data.rows.length > 0) {
    //             for(var i = 0; i < data.rows.length; i++) {
    //                 this.invoice.items.push({description: data.rows.item(i).description, qty: data.rows.item(i).qty, cost: data.rows.item(i).cost});
    //             //, total: data.rows.item(i).total
    //             }
    //         }
    //     }, (error) => {
    //         alert("ERROR: " + JSON.stringify(error));
    //     })
    //     return this.invoice;
    // }
    
    public sync(items) : any{
        this.database.executeSql("SELECT * FROM tblItems", []).then((data) => {
            this.AllItems = [];
            var body = [];
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                    this.AllItems.push({description: data.rows.item(i).description, qty: data.rows.item(i).qty, cost: data.rows.item(i).cost,total: data.rows.item(i).cost * data.rows.item(i).qty, date:data.rows.item(i).date});
                    body.push({"Id":data.rows.item(i).id,"Description":data.rows.item(i).description,"Qty":data.rows.item(i).qty,"Cost":data.rows.item(i).cost,"Total":data.rows.item(i).cost * data.rows.item(i).qty,"Date":data.rows.item(i).date});
                   // alert(data.rows.item(i).id);
                }
                this.ApiCallService.post('http://www.utechtest.somee.com/api/items',body).then((data)=>{
                   alert("Synced Successfully")
                });
            }
            else{
                if(items.length > 0) {
                    this.database.executeSql("Delete from tblItems", []).then((data) => {
                    console.log("DELETED: " + JSON.stringify(data));
                    items.forEach(e => {
                        var Newdate = new Date(e.Date);
                        var date = Newdate.toISOString().substring(0, 10);
                        this.database.executeSql("INSERT INTO tblItems (description, qty, cost, total, date) VALUES ('"+e.Description+"','"+parseInt(e.Qty)+"','"+parseInt(e.Cost)+"','"+e.Qty * e.Cost+"','"+date+"')", []).then((data) => {
                            console.log("INSERTED: " + JSON.stringify(data));
                        }, (error) => {
                            alert("Insert ERROR: " + JSON.stringify(error.err));
                        });
                    });
                    }, (error) => {
                        alert("Delete ERROR: " + JSON.stringify(error.err));
                    }).then((e)=>{
                        alert("Successfully Synced");
                    });
                }
            }
        }, (error) => {
            alert("ERROR: " + JSON.stringify(error));
        });
    }

}