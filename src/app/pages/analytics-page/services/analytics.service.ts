import { Injectable } from '@angular/core';
import { EMPTY, map, Observable, shareReplay } from "rxjs";
import { ConfigService } from "../../../global/services/config/config.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Rent } from "../models/rent";

@Injectable()
export class AnalyticsService {
  private analyticsUrl: string = ''

  constructor(private configService: ConfigService, private httpClient: HttpClient) {
    this.analyticsUrl = `${ this.configService.baseApiUrl }analytics/`
  }

  public loadLeaks() {
    return EMPTY
  }

  public loadMonthRent(id: number, from: string, to: string): Observable<Rent> {
    const params = new HttpParams({
      fromObject: {
        from,
        to
      }
    })

    return this.httpClient.get<Rent[]>(`${ this.analyticsUrl }analyze/${ id }`, { params }).pipe(
      map((rents) => rents[ 0 ]),
      shareReplay(1)
    )
  }
}
