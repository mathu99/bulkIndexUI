import { Component } from '@angular/core';
import { BulkIndexService } from './bulkIndex.service';
import { Observable } from 'rxjs/Rx';
import { get, set } from 'lodash';
import { environment } from '../environments/environment';

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
  }
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
  }
  getEnvironments() {
    this.bulkIndexService.getEnvironments().subscribe(
      data => {
        this.environments = get(data, 'value', '').split(',');
        this.data.selectedEnviornment = get(this, 'environments[0]', null);
      },
      err => console.error(err),
    );
  }

  initiateBulkIndexing = () => {
    this.bulkIndexService.initiateBulkIndexing(this.data.selectedCountry.name, this.data.selectedEnviornment).subscribe(
      data => {
        switch (get(data, 'headerResponse.status')) {
          case '200': {
            set(this.data, 'logs', 'Bulk Indexing process initiated...\n');
          } break;
          case '400': {
            set(this.data, 'logs', 'Could not initiate Bulk Indexing. Reason:\n' + get(data, 'headerResponse.statusMessage'));
          }break;
        }
      },
      err => console.error(err),
    );
  }

  ngOnInit() {
    this.getCountries();
    this.getEnvironments();
  }
}
