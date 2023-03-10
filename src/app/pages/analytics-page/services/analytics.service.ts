import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from "rxjs";
import { ConfigService } from "../../../global/services/config/config.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Rent } from "../models/rent";
import { TempChart } from "../models/temp";
import { PowerChart } from "../models/power";

@Injectable()
export class AnalyticsService {
  private analyticsUrl: string = ''

  constructor(private configService: ConfigService, private httpClient: HttpClient) {
    this.analyticsUrl = `${ this.configService.baseApiUrl }/analytics`
  }

  public loadTempChart(id: number, from: string, to: string) {
    const params = new HttpParams({
      fromObject: {
        from,
        to
      }
    })

    return this.httpClient.get<TempChart[]>(`${ this.analyticsUrl }/plot/temp/${ id }`, { params }).pipe(
      shareReplay(1)
    )
  }

  public loadPowerChart(id: number, from: string, to: string) {
    const params = new HttpParams({
      fromObject: {
        from,
        to
      }
    })

    return this.httpClient.get<PowerChart[]>(`${ this.analyticsUrl }/plot/power/${ id }`, { params }).pipe(
      shareReplay(1)
    )
  }

  public loadMonthRent(id: number, from: string, to: string): Observable<Rent> {
    const params = new HttpParams({
      fromObject: {
        from,
        to
      }
    })

    // return of({
    //   date: "2023-02-01T00:00:00.000+00:00",
    //   expectedIncome: 100000,
    //   realIncome: 35000,
    //   rentCount: 2,
    //   roomCount: 3
    // })

    return this.httpClient.get<Rent[]>(`${ this.analyticsUrl }/analyze/${ id }`, { params }).pipe(
      map((rents) => rents[ 0 ]),
      shareReplay(1)
    )
  }

  public loadPeriodRents(id: number, from: string, to: string): Observable<Rent[]> {
    const params = new HttpParams({
      fromObject: {
        from,
        to
      }
    })

    // return of([
    //   {
    //     date: "2023-01-01T00:00:00.000+00:00",
    //     expectedIncome: 100000,
    //     realIncome: 35000,
    //     rentCount: 2,
    //     roomCount: 10
    //   },
    //   {
    //     date: "2023-02-01T00:00:00.000+00:00",
    //     expectedIncome: 100000,
    //     realIncome: 75000,
    //     rentCount: 6,
    //     roomCount: 10
    //   },
    //   {
    //     date: "2023-03-01T00:00:00.000+00:00",
    //     expectedIncome: 150000,
    //     realIncome: 120000,
    //     rentCount: 9,
    //     roomCount: 10
    //   }
    // ])

    return this.httpClient.get<Rent[]>(`${ this.analyticsUrl }/analyze/${ id }`, { params }).pipe(
      shareReplay(1)
    )
  }
}
