import { ChangeDetectionStrategy, Component } from "@angular/core"
import { FormControl } from "@angular/forms"
import { CRS, LayerGroup, MapOptions, SVGOverlay } from "leaflet"
import { BehaviorSubject, filter, firstValueFrom, map, Observable, take, tap } from "rxjs"
import { BusinessCenter, BusinessCenterStoreyMap, LeafletMap } from "./models"
import { HomeApiService } from "./services/home-api.service"

type SelectedData = {
  room: number | null
  storey: number | null
  businessCenter: BusinessCenter | null
}

@Component({
  selector: "urb-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: [ "./home-page.component.css" ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  public options: MapOptions = {
    attributionControl: false,
    crs: CRS.Simple,
    minZoom: -5
  }

  protected selectedLevel = new FormControl<number>(1, { nonNullable: true })

  protected search = new FormControl()

  protected selectedData = new BehaviorSubject({
    room: null,
    storey: null,
    businessCenter: null
  })

  protected levels: Observable<number[]> = this.selectedData.pipe(
    filter((data) => data.businessCenter !== null),
    map((data) => {
      return (data.businessCenter as any).storeys.map((s: any) => s.level)
    })
  )

  protected trees = this.homeApiService.getBusinessCenters().pipe(
    map((businessCenters: readonly BusinessCenter[]) => {
      return businessCenters.map((businessCenter) => {
        return {
          id: businessCenter.id,
          type: "BUSINESS_CENTER",
          name: businessCenter.name,
          __origin: businessCenter,
          children: businessCenter.storeys.map((storey) => {
            return {
              id: storey.id,
              type: "STOREY",
              name: storey.name,
              parentBusinessCenter: businessCenter,
              __origin: storey,
              children: storey.rooms.map((room) => {
                return {
                  id: room.id,
                  type: "ROOM",
                  name: room.name,
                  parentBusinessCenter: businessCenter,
                  parentStorey: storey,
                  __origin: room,
                  children: []
                }
              })
            }
          })
        }
      })
    })
  )

  constructor(private homeApiService: HomeApiService) {
    this.homeApiService.getBusinessCenters().subscribe(console.debug)
  }

  protected childrenHandler(node: any): any[] {
    return node.children ?? []
  }

  protected async onMapInstance(mapInstance: LeafletMap) {
    const businessCenters: readonly BusinessCenter[] = await firstValueFrom(this.homeApiService.getBusinessCenters().pipe(take(1)))

    const businessCentersById = new Map()
    const masterLayerGroup = new LayerGroup()
    mapInstance.addLayer(masterLayerGroup)

    for (const businessCenter of businessCenters) {
      const storeysById = new Map()

      for (const storey of businessCenter.storeys) {
        if (storey.map === null) {
          continue
        }

        const layerGroup = new LayerGroup()
        const map: BusinessCenterStoreyMap = JSON.parse(storey.map)
        const element = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        for (const [ key, value ] of Object.entries(map.svgContainer.attributes)) {
          element.setAttribute(key, value)
        }
        element.innerHTML = map.svgContainer.innerHtml
        layerGroup.addLayer(new SVGOverlay(element, map.svgContainer.bounding))
        storeysById.set(storey.id, {
          layer: layerGroup,
          bounding: map.svgContainer.bounding
        })
      }

      businessCentersById.set(businessCenter.id, storeysById)
    }

    this.selectedData.pipe(
      filter((data) => data.businessCenter !== null),
      tap((data) => {
        masterLayerGroup.eachLayer(s => s.remove())
        const businessCenter = businessCentersById.get((data.businessCenter as any).id)
        const storey = businessCenter.get((data.storey as any).id)
        masterLayerGroup.addLayer(storey.layer)
        mapInstance.fitBounds(storey.bounding)
      })
    ).subscribe()

    /*const floors = getSvgs()
    const levelsLayerGroup = new LayerGroup()
    mapInstance.addLayer(levelsLayerGroup)
    let isini = false
    this.selectedLevel.valueChanges
      .pipe(
        startWith(this.selectedLevel.value)
      )
      .subscribe((level) => {
        levelsLayerGroup.eachLayer(l => l.remove())
        const floor = Reflect.get(floors, String(level))
        const layer = new SVGOverlay(floor.svgElement, floor.bounding)
        layer.bringToBack()
        levelsLayerGroup.addLayer(layer)
        if (!isini) {
          mapInstance.fitBounds(floor.bounding)
          isini = true
        }
      })

    const room = new Polygon([
      [ 65, 0 ],
      [ 65, 190 ],
      [ 365, 190 ],
      [ 365, 0 ]
    ], {
      fillColor: "transparent",
      stroke: false
    })

    room.addEventListener("mouseover", () => {
      room.setStyle({ fillColor: "red" })
    })

    room.addEventListener("mouseout", () => {
      room.setStyle({ fillColor: "transparent" })
    })

    room.bindTooltip("room 1", { className: "urb-tooltip", permanent: true, direction: "center" })

    const room2 = new Polygon([
      [ 365, 0 ],
      [ 365, 190 ],
      [ 663, 190 ],
      [ 663, 0 ]
    ], {
      fillColor: "transparent",
      stroke: false
    })

    room2.addEventListener("mouseover", () => {
      room2.setStyle({ fillColor: "red" })
    })

    room2.bindTooltip("room 2", { className: "urb-tooltip", permanent: true, direction: "center" })

    room2.addEventListener("mouseout", () => {
      room2.setStyle({ fillColor: "transparent" })
    })

    room.bringToFront()

    mapInstance.addLayer(room)
    mapInstance.addLayer(room2)*/
  }

  protected onClickTreeNode(event: any) {
    switch (event.type) {
      case "BUSINESS_CENTER": {
        this.selectedData.next({
          ...this.selectedData.value,
          businessCenter: event.__origin
        } as any)
        break
      }

      case "STOREY": {
        this.selectedData.next({
          ...this.selectedData.value,
          storey: event.__origin,
          businessCenter: event.parentBusinessCenter,
        } as any)
        this.selectedLevel.setValue(event.__origin.level)
        break
      }

      case "ROOM": {
        this.selectedData.next({
          room: event.__origin,
          storey: event.parentStorey,
          businessCenter: event.parentBusinessCenter,
        } as any)
        this.selectedLevel.setValue(event.parentStorey.level)
        break
      }
    }
  }
}
