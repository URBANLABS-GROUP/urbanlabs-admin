import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { ConfigService } from "../../../global/services/config/config.service"
import { BusinessCenter } from "../models"

@Injectable({
  providedIn: "root"
})
export class HomeApiService {
  constructor(private configService: ConfigService,
              private httpClient: HttpClient) {
  }

  public getBusinessCenters(): Observable<readonly BusinessCenter[]> {
    // return this.httpClient.get<readonly BusinessCenter[]>(`${ this.configService.baseApiUrl }/business-center/all`)
    return of([
      {
        "id": 1,
        "name": "Тестовые бизнец центр 1",
        "lessorId": 1,
        "storeys": [
          {
            "id": 1,
            "businessCenterId": 1,
            "map": JSON.stringify({
              svgContainer: {
                attributes: {
                  viewBox: "0 0 190 728",
                  fill: "transparent"
                },
                bounding: [ [ 0, 0 ], [ 728, 190 ] ],
                innerHtml: `<path stroke="#000" stroke-width="2" d="M2 664h150"/>
                  <path stroke="#B0B0B0" stroke-width="2" d="M68 665v63M98 665v63M128 665v63M113 665v63M83 665v63M66 2v63M96 2v63M126 2v63M111 2v63M81 2v63"/>
                  <path stroke="#000" stroke-width="2" d="M2 64h151M1 0v728M189 49v631M2 727h186M2 1h188M0 364h190"/>`
              }
            }),
            "name": "1 этаж",
            "level": 1,
            "rooms": [
              {
                "id": 1,
                "businessCenterStoreyId": 1,
                "position": JSON.stringify({
                  coords: [
                    [ 65, 0 ],
                    [ 65, 190 ],
                    [ 365, 190 ],
                    [ 365, 0 ]
                  ]
                }),
                "name": "Комната 1",
                "leaseContractId": null
              }
            ]
          },
          {
            "id": 2,
            "businessCenterId": 1,
            "map": null,
            "name": "2 этаж",
            "level": 2,
            "rooms": [
              {
                "id": 2,
                "businessCenterStoreyId": 2,
                "position": null,
                "name": "Комната 2",
                "leaseContractId": null
              }
            ]
          },
          {
            "id": 3,
            "businessCenterId": 1,
            "map": null,
            "name": "3 этаж",
            "level": 3,
            "rooms": [
              {
                "id": 3,
                "businessCenterStoreyId": 3,
                "position": null,
                "name": "Комната 3",
                "leaseContractId": null
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "name": "Тестовые бизнец центр 2",
        "lessorId": 1,
        "storeys": [
          {
            "id": 4,
            "businessCenterId": 2,
            "map": null,
            "name": "подвал",
            "level": 0,
            "rooms": [
              {
                "id": 4,
                "businessCenterStoreyId": 4,
                "position": null,
                "name": "Комната 4",
                "leaseContractId": null
              }
            ]
          },
          {
            "id": 5,
            "businessCenterId": 2,
            "map": null,
            "name": "1 этаж",
            "level": 1,
            "rooms": [
              {
                "id": 5,
                "businessCenterStoreyId": 5,
                "position": null,
                "name": "Комната 5",
                "leaseContractId": null
              }
            ]
          },
          {
            "id": 6,
            "businessCenterId": 2,
            "map": null,
            "name": "2 этаж",
            "level": 2,
            "rooms": [
              {
                "id": 6,
                "businessCenterStoreyId": 6,
                "position": null,
                "name": "Комната 6",
                "leaseContractId": null
              }
            ]
          },
          {
            "id": 7,
            "businessCenterId": 2,
            "map": null,
            "name": "3 этаж",
            "level": 3,
            "rooms": [
              {
                "id": 7,
                "businessCenterStoreyId": 7,
                "position": null,
                "name": "Комната 7",
                "leaseContractId": null
              }
            ]
          },
          {
            "id": 8,
            "businessCenterId": 2,
            "map": null,
            "name": "4 этаж",
            "level": 4,
            "rooms": [
              {
                "id": 8,
                "businessCenterStoreyId": 8,
                "position": null,
                "name": "Комната 8",
                "leaseContractId": null
              }
            ]
          }
        ]
      }
    ] as any)
  }
}
