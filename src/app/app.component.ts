import { Component } from '@angular/core';
import { BulkIndexService } from './bulkIndex.service';
import { Observable } from 'rxjs/Rx';
import { get } from 'lodash';

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
    console.log('init')
  }

  ngOnInit() {
    this.getCountries();
    this.getEnvironments();
  }
}
