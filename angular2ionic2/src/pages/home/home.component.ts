import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { sqlLiteService } from '../../Services/sqlLite.service';
import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import { DatePicker } from 'ionic-native';
import { ApiCallService } from '../../Services/ApiCall.service';
import { DefaultDateDirective } from './default-date-directive';
import {Network} from "ionic-native";
import { ItemsDTO } from './Items.dto';

//declare var navigator: any;
declare var Connection;

@Injectable()
@Component({
    selector: 'item',
    template: `      
    <ion-label color="primary">Please Select Date</ion-label>
    <input type="date" [(ngModel)]="today"/>
    <button (click)="saveItems()" ion-button>Save</button>
    <button (click)="refresh()" ion-button>Refresh</button>
    
    <br>
    <br>

    <table class="" cellspacing="5" width="100%">
            <thead>
                <tr>
                    <th><b>S.NO</b></th>
                    <th><b>Item</b></th>
                    <th><b>Qty</b></th>
                    <th><b>Cost</b></th>
                    <th><b>Total</b></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let item of invoice.items; let i = index; ">
                    <td>{{i + 1}}</td>
                    <td><ion-input type="text" placeholder="Item" [(ngModel)]="item.description"> </ion-input></td>
                    <td><ion-input type="number" placeholder="0" [(ngModel)]="item.qty" ng-required> </ion-input></td>
                    <td><ion-input type="number" placeholder="0"  [(ngModel)]="item.cost" ng-required> </ion-input></td>
                    <td><ion-label color="primary">{{item.qty * item.cost | currency : "PKR"}}</ion-label></td>
                    <td><button (click)="removeItem(i)" color="danger" ion-fab mini>X</button></td>
                </tr>
                <tr>
                    <td><button (click)="AddItem()" ion-fab mini>Add</button></td>
                    <td></td>
                    <td><ion-label color=""><b>Total:</b></ion-label></td>
                    <td><ion-label color="primary"><b>{{ gettotal() | currency : "PKR" }}</b></ion-label></td>
                    <td></td>
                    <td><ion-icon (click)="sync()" ion-fab mini name="sync" style="font-size: 30px"></ion-icon></td>
                </tr>
            </tbody>
        </table>
        <ion-list>
    <!-- <ion-item *ngFor="let item of Items">
      <h2>{{item.Id}}---{{item.Description}}---{{item.Qty}}---{{item.Cost}}---{{item.Total}}---{{item.Date | date}}</h2>
    </ion-item>
  </ion-list> -->
    `,
    providers: [sqlLiteService,LoadingController,ApiCallService,Network,ItemsDTO]
})

export class homeComponent implements OnInit {
    public Items: any;
    public loadings;
    public AllItems;
    public status;
    

    date = new Date();
    today = this.date.toISOString().substring(0, 10);
   
    ngOnInit() {
    // ...
    }
    presentLoadingDefault() {
        this.loadings = this.loading.create({
        content: 'Please wait...'
        });
    }


    constructor( public navController: NavController,public loading:LoadingController,
                 public ApiCallService: ApiCallService, public sqlLite:sqlLiteService,
                 public itemsDTO : ItemsDTO ){
        this.loadItems();
    }
    isOnline(): boolean {
        if(Network.connection){
            return Network.connection != "none";
        }
    }
    loadItems(){
        this.presentLoadingDefault();
        this.loadings.present();
        if(this.isOnline()){
            this.ApiCallService.getAll('http://www.utechtest.somee.com/api/items').then(data => {
                this.Items = data;
                this.loadings.dismiss();
            },
            (error) => {
                alert("ERROR: " + JSON.stringify(error));
                this.loadings.dismiss();
            });
        }
        else{
            alert("ERROR: Please check your internet connection");
            this.loadings.dismiss();
        }
        
    }
  
    invoice = {
              items: [{
                    qty: 1,
                    description: '',
                    cost: 0
              }]
            };
    AddItem(){
            this.invoice.items.push({
                    qty: 1,
                    description: '',
                    cost: 0
                });
                event.preventDefault();
            } 

    removeItem(index) {
                this.invoice.items.splice(index, 1);
                event.preventDefault();
            }

    gettotal() : number{
                var total = 0;
                this.invoice.items.forEach(element => {
                  total += element.qty * element.cost;
                });
                return total;
            } 
    saveItems() {
        this.presentLoadingDefault();
                this.loadings.present().then((e)=>{
                    this.invoice.items.forEach(e => {
                    //this.sqlLite.add(e.description,e.qty,e.cost,this.today);
                    this.itemsDTO.add(e.description,e.qty,e.cost,this.today);
                })
                }).then(()=>{
                    this.loadings.dismiss();
                    alert("Successfully Saved");
                });
            }
    postItems() {
        this.presentLoadingDefault();
        this.loadings.present();
        
        var body = [];
                this.Items.forEach(e => {
                body.push({"Id":e.Id,"Description":e.Description,"Qty":e.Qty,"Cost":e.Cost,"Total":e.Total,"Date":this.today});
                });
                this.invoice.items.forEach(e => {
                body.push({"Id":0,"Description":""+e.description+"","Qty":""+e.qty+"","Cost":""+e.cost+"","Total":""+e.cost * e.qty+"","Date":""+this.today+""});
                });
                this.ApiCallService.post('http://www.utechtest.somee.com/api/items',body).then((data)=>{
                    console.log(JSON.stringify(data));
                    this.loadings.dismiss();
                    alert("Successfully Saved");
                });
    }

    public refresh() {
        this.presentLoadingDefault();
        this.loadings.present();
        this.invoice.items = [];
        //this.invoice = (this.sqlLite.refresh(this.today));
        this.invoice = (this.itemsDTO.refresh(this.today));
        this.loadings.dismiss();
    }

    public sync(){
        if(this.isOnline()){
        this.presentLoadingDefault();
        this.loadings.present();
        this.sqlLite.sync(this.Items);
        this.loadings.dismiss();
        }
        else{
            alert("ERROR: Please check your internet connection");
            this.loadings.dismiss();
        }
    }
/*

<ion-list>
        <ion-item>
             <ion-icon name="add-circle" item-left (click)="AddItem()">Add</ion-icon>
             <ion-icon name="cart" item-right>{{ gettotal() | currency : "PKR" }}</ion-icon>
        </ion-item>
    </ion-list>
    <ion-list *ngFor="let item of invoice.items; let i = index;">
        <ion-list-header>
            <ion-input type="text" placeholder="Item" [(ngModel)]="item.description"></ion-input>
        </ion-list-header>
        <ion-item-sliding>
            <ion-item>
                <ion-avatar item-left>
                    <ion-icon name="cart" style="font-size: 40px">{{i + 1}}</ion-icon>
                </ion-avatar>
                <ion-input type="number" placeholder="Qty"  [(ngModel)]="item.qty"></ion-input>
                <ion-input type="number" placeholder="Cost" [(ngModel)]="item.cost"></ion-input>
                <ion-label color="primary">{{item.qty * item.cost | currency : "PKR"}}</ion-label>
            </ion-item>
            <ion-item-options side="right">
                <button ion-button color="danger" (click)="removeItem(i)">
                    <ion-icon name="trash" style="font-size: 40px"></ion-icon>
                </button>
            </ion-item-options>
        </ion-item-sliding>
    </ion-list><br><br><br>

    <table class="" cellspacing="5" width="100%">
            <thead>
                <tr>
                    <th><b>S.NO</b></th>
                    <th><b>Item</b></th>
                    <th><b>Qty</b></th>
                    <th><b>Cost</b></th>
                    <th><b>Total</b></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let item of invoice.items; let i = index; ">
                    <td>{{i + 1}}</td>
                    <td><ion-input type="text" placeholder="Item" [(ngModel)]="item.description"> </ion-input></td>
                    <td><ion-input type="number" placeholder="0" [(ngModel)]="item.qty" ng-required> </ion-input></td>
                    <td><ion-input type="number" placeholder="0"  [(ngModel)]="item.cost" ng-required> </ion-input></td>
                    <td><ion-label color="primary">{{item.qty * item.cost | currency : "PKR"}}</ion-label></td>
                    <td><button (click)="removeItem(i)" color="danger" ion-fab mini>X</button></td>
                </tr>
                <tr>
                    <td><button (click)="AddItem()" ion-fab mini>Add</button></td>
                    <td></td>
                    <td></td>
                    <td><ion-label color=""><b>Total:</b></ion-label></td>
                    <td><ion-label color="primary"><b>{{ gettotal() | currency : "PKR" }}</b></ion-label></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
*/



}