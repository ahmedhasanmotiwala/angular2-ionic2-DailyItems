import { Injectable } from '@angular/core';
import { DALService } from '../../Services/dal.service';

@Injectable()
export class ItemsDTO {

    public invoice = {
              items: [{
                    qty: 1,
                    description: '',
                    cost: 0
              }]
            };

    constructor(public dalService : DALService){
        
    }

    public add(description,qty,cost,date) {
        this.dalService.executeSql("Delete from tblItems where date=?",[date]).then((res) =>{
            console.log("DELETED: " + JSON.stringify(res));
            //Sucess Callback Delete
            this.dalService.executeSql("INSERT INTO tblItems (description, qty, cost, total, date) VALUES ('"+description+"','"+qty+"','"+cost+"','"+qty * cost+"','"+date+"')", []).then((res) => {
                console.log("INSERTED: " + JSON.stringify(res));
                //Sucess Callback
            },(error) => {
                alert("Insert ERROR: " + JSON.stringify(error.err));
            });
        },(error) => {
            alert("Delete ERROR: " + JSON.stringify(error.err));
        });
    }
    public refresh(today) : any {
        this.dalService.executeSql("SELECT * FROM tblItems where date =?", [today]).then((data) => {
            this.invoice.items = [];
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                    this.invoice.items.push({description: data.rows.item(i).description, qty: data.rows.item(i).qty, cost: data.rows.item(i).cost});
                //, total: data.rows.item(i).total
                }
            }
        }, (error) => {
            alert("Select ERROR: " + JSON.stringify(error.err));
        })
        return this.invoice;
    }
}