import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FetchPriceQuery } from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { getSelectedSymbol, getAllPriceQueries } from './price-query.selectors';
import { map, skip } from 'rxjs/operators';
import { PriceQuery } from './price-query.type';

@Injectable()
export class PriceQueryFacade {

  private periodFrom: Date;
  private periodTo: Date;

  selectedSymbol$ = this.store.pipe(select(getSelectedSymbol));
  priceQueries$ = this.store.pipe(
    select(getAllPriceQueries),
    skip(1),
    map(priceQueries => priceQueries.filter((priceQuery: PriceQuery) => 
    new Date(priceQuery.date) >= this.periodFrom && new Date(priceQuery.date) < this.periodTo
      ).map(priceQuery => [priceQuery.date, priceQuery.close]))
  );

  constructor(private store: Store<PriceQueryPartialState>) {}

  fetchQuote(symbol: string, periodFrom: Date, periodTo: Date) {

    this.periodFrom = periodFrom;
    this.periodTo = periodTo;

    this.store.dispatch(new FetchPriceQuery(symbol, this.preparePeriod()));
  }

  preparePeriod(){
    const dateDiffInMonths = this.periodTo.getMonth() - this.periodFrom.getMonth() + 
    (12 * (this.periodTo.getFullYear() - this.periodFrom.getFullYear()));

    let period = "";

    if(dateDiffInMonths >= 12){
      const periodSuffix = "y";
      period = "max";

      if(dateDiffInMonths < 2 * 12) {
        period = `1${periodSuffix}`;
      } else if(dateDiffInMonths < 3 * 12) {
        period = `2${periodSuffix}`;
      }else if(dateDiffInMonths < 6 * 12) {
        period = `5${periodSuffix}`;
      }
    } else {
      const periodSuffix = "m";
      period = "ytd";

      if(dateDiffInMonths < 2) {
        period = `1${periodSuffix}`;
      } else if(dateDiffInMonths < 4) {
        period = `3${periodSuffix}`;
      }else if(dateDiffInMonths < 7) {
        period = `6${periodSuffix}`;
      }
    }

    return period;
  }
}
