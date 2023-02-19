import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { ConfigService } from "../../../global/services/config/config.service"
import { BusinessCenter, RoomTelemetryInfo, StoreyTelemetryInfo } from "../models"

@Injectable({
  providedIn: "root"
})
export class HomeApiService {
  constructor(private configService: ConfigService,
              private httpClient: HttpClient) {
  }

  public getBusinessCenters(): Observable<readonly BusinessCenter[]> {
    return this.httpClient.get<readonly BusinessCenter[]>(`${ this.configService.baseApiUrl }/business-center/all`)
  }

  public getRoomTelemetryInfo(id: number): Observable<RoomTelemetryInfo> {
    return this.httpClient.get<RoomTelemetryInfo>(`${ this.configService.baseApiUrl }/room/info/${ id }`)
  }

  public getStoreyTelemetryInfo(id: number): Observable<StoreyTelemetryInfo> {
    return this.httpClient.get<StoreyTelemetryInfo>(`${ this.configService.baseApiUrl }/business-center-storey/info/${ id }`)
  }
}
