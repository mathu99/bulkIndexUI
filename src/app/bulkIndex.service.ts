import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class BulkIndexService {

    constructor(private http: HttpClient) {
    }

    getCountries() {
        return this.http.get('/api/countries');
    }

    getEnvironments() {
        return this.http.get('/api/config/MC.Synapse.BulkIndexer.environments');
    }
    
}