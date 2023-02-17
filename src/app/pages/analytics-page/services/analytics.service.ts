import { Injectable } from '@angular/core';
import { EMPTY } from "rxjs";
import { ConfigService } from "../../../global/services/config/config.service";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable()
export class AnalyticsService {
  private analyticsUrl: string = ''

  constructor(private configService: ConfigService, private httpClient: HttpClient) {
    this.analyticsUrl = `${ this.configService.baseApiUrl }/analytics/`
  }

  public loadLeaks() {
    return EMPTY
  }

  public loadRentDebt() {
    return EMPTY
  }

  public loadRent(id: number, from: string, to: string) {
    const params = new HttpParams({
      fromObject: {
        from,
        to
      }
    })

    return this.httpClient.get(`${ this.analyticsUrl }/analyze/${ id }`, { params })
  }
}
