import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { TimePeriod } from './time-period'

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;

  quotes$ = this.priceQuery.priceQueries$;

  timePeriods: TimePeriod[] = [
    { viewValue: 'All available data', value: 'max' } as TimePeriod,
    { viewValue: 'Five years', value: '5y' } as TimePeriod,
    { viewValue: 'Two years', value: '2y' } as TimePeriod,
    { viewValue: 'One year', value: '1y' } as TimePeriod,
    { viewValue: 'Year-to-date', value: 'ytd' } as TimePeriod,
    { viewValue: 'Six months', value: '6m' } as TimePeriod,
    { viewValue: 'Three months', value: '3m' } as TimePeriod,
    { viewValue: 'One month', value: '1m' } as TimePeriod
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required]
    });
  }

  ngOnInit() {}

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, period } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, period);
    }
  }
}
