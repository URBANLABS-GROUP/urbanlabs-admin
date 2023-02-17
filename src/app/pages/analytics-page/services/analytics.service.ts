import { Injectable } from '@angular/core';
import {EMPTY} from "rxjs";

@Injectable()
export class AnalyticsService {

  constructor() { }

  public loadLeaks() {
    return EMPTY
  }

  public loadRentDebt() {
    return EMPTY
  }
}
