import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { NavController } from 'ionic-angular';
import { enableProdMode } from '@angular/core';

enableProdMode();

/*
  Generated class for the PeopleService provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ApiCallService {

  constructor(private http: Http) {
    
   }

  data;
  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
  getAll(url) {
    try{
      return new Promise(resolve => {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            //http://192.168.16.93/DailyItems/Api/items
            this.http.get(url)
              .map(res => res.json())
              .subscribe(data => {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                this.data = data;
                resolve(this.data);
              });
          });
    }
    catch (ex){
      alert(ex);
    }
  } 
  
  post(url,body) {
    try {
      return new Promise(resolve => {
      this.http.post(url,body)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
    }
    catch(ex){
     alert (ex);
    } 
  } 
}
