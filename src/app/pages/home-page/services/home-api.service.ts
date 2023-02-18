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
            "map": JSON.stringify({
              svgContainer: {
                attributes: {
                  viewBox: "0 0 190 728",
                  fill: "transparent"
                },
                bounding: [ [ 0, 0 ], [ 728, 190 ] ],
                innerHtml: `<path stroke="#000" stroke-width="2" d="M2 664h125"/>
                  <path stroke="#B0B0B0" stroke-width="2" d="M16 665v63M46 665v63M76 665v63M61 665v63M31 665v63M16 2v63M46 2v63M76 2v63M61 2v63M31 2v63"/>
                  <path stroke="#000" stroke-width="2" d="M2 64h125M1 0v728M189 2v726M2 727h186M2 1h188M116 369h74M0 369h74M128 609v56M126 63v56M127 610H60M56 555H0M56 183H0M56 493H0M56 305H0M56 431H0M56 243H0M132 493h56M132 305h56M132 431h56M132 243h56M132 555h56M132 181h56M55 383v-13M55 195v-13M133 443v-13M133 255v-13M133 507v-13M133 319v-13M55 507v-13M55 319v-13M55 445v-13M55 257v-13M133 417v13M133 229v13M55 430v-13M55 242v-13M133 492v-13M133 304v-13M133 554v-13M133 368v-13M55 554v-13M55 368v-13M55 492v-13M55 304v-13M133 370v13M133 182v13M127 119H60M20 610H0M21 119H1"/>`
              }
            }),
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
