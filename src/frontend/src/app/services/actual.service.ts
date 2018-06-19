import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/';

@Injectable({providedIn:'root'})
    
export class ActualService {
    public url: string;
    
    constructor( private _http: HttpClient) {
        this.url = "http://localhost:8011/api/";
    }

    getRow():Observable <any> {
     return this._http.get(this.url + 'actual');
    }
}