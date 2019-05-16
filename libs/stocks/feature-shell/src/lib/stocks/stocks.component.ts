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
  max: Date = new Date();

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
      period: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.stockPickerForm.valueChanges.subscribe(() => this.fetchQuote());

    this.stockPickerForm.get('to').valueChanges
      .subscribe((date?: Date) => {

        const fromDate = this.stockPickerForm.controls['from'].value;

        if (date && fromDate && date < new Date(fromDate)){
            this.stockPickerForm.controls['to'].setValue(fromDate);
        }
      });

      this.stockPickerForm.get('from').valueChanges
      .subscribe((date?: Date) => {

        const toDate = this.stockPickerForm.controls['to'].value;
        if (date && toDate && date > new Date(toDate)) {
            this.stockPickerForm.controls['from'].setValue(toDate);
        }
      });
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, from, to } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, from, to);
    }
  }
}
