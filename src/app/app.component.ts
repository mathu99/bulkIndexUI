import { Component } from '@angular/core';
import { BulkIndexService } from './bulkIndex.service';
import { Observable } from 'rxjs/Rx';
import { get, set } from 'lodash';
import { environment } from '../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  countries: any;
  data: any = {
    logs: "Choose country / environment and click 'Run' to begin Bulk Indexing...",
    selectedCountry: null,
    selectedEnviornment: null,
  };
  properties: any = {
    bulkIndexingRunning: false,
  };
  environments: any;

  constructor(private bulkIndexService: BulkIndexService) { }

  getCountries() {
    this.bulkIndexService.getCountries().subscribe(
      data => {
        this.countries = data;
        this.data.selectedCountry = this.countries[0];
      },
      err => console.error(err),
    );
  };

  getEnvironments() {
    this.bulkIndexService.getEnvironments().subscribe(
      data => {
        this.environments = get(data, 'value', '').split(',');
        this.data.selectedEnviornment = get(this, 'environments[0]', null);
      },
      err => console.error(err),
    );
  };

  initiateBulkIndexing = () => {
    set(this, 'properties.bulkIndexingRunning', true);
    this.bulkIndexService.initiateBulkIndexing(this.data.selectedCountry.name, this.data.selectedEnviornment).subscribe(
      data => {
        switch (get(data, 'headerResponse.status')) {
          case '200': {
            this.logText('Bulk Indexing process initiated...\n', false);
          } break;
          case '400': {
            this.logText('Could not initiate Bulk Indexing. Reason:\n' + get(data, 'headerResponse.statusMessage'), false);
            set(this, 'properties.bulkIndexingRunning', false);
          }break;
        }
      },
      err => {
        this.logText('Could not initiate Bulk Indexing. Reason:\n' + err, false)
        set(this, 'properties.bulkIndexingRunning', true);
      },
    );
  };

  logText(text: String, append: boolean) {
    let entry = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${text}`;
    set(this.data, 'logs', append == true ? this.data.logs + '\n' + entry : entry);
  };

  ngOnInit() {
    this.getCountries();
    this.getEnvironments();
  };
}
