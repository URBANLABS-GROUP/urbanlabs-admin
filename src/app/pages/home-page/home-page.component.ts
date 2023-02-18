import { ChangeDetectionStrategy, Component } from "@angular/core"
import { CRS, LayerGroup, MapOptions, Polygon, SVGOverlay } from "leaflet"
import { BehaviorSubject, firstValueFrom, map, Observable, shareReplay, take } from "rxjs"
import { BusinessCenter, BusinessCenterStoreyMap, LeafletMap } from "./models"
import { HomeApiService } from "./services/home-api.service"

type UrbTreeNode = {
  id: number
  type: "CENTER" | "STOREY" | "ROOM"
  name: string
  isSelected: Observable<boolean>
  children: UrbTreeNode[]
}

type UrbTreeNodeSymbol = string

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
    minZoom: -2
  }

  private businessCenters: Observable<readonly BusinessCenter[]> = this.homeApiService.getBusinessCenters().pipe(
    shareReplay({ refCount: true, bufferSize: 1 })
  )

  private selectedTreeNode: BehaviorSubject<UrbTreeNodeSymbol | null> = new BehaviorSubject<UrbTreeNodeSymbol | null>(null)

  protected businessCenterTrees: Observable<UrbTreeNode[]> = this.businessCenters.pipe(
    map((centers: readonly BusinessCenter[]) => {
      return centers.map((center) => {
        const createIsSelected = (currentType: UrbTreeNode["type"], currentId: number) => {
          return this.selectedTreeNode.pipe(
            map((t: UrbTreeNodeSymbol | null) => {
              if (t === null) {
                return false
              }

              const [ type, id ] = t.split(":")

              return currentType === type && currentId === parseFloat(id)
            })
          )
        }

        return {
          id: center.id,
          type: "CENTER",
          name: center.name,
          isSelected: createIsSelected("CENTER", center.id),
          children: center.storeys.map((storey) => {
            return {
              id: storey.id,
              type: "STOREY",
              name: storey.name,
              isSelected: createIsSelected("STOREY", storey.id),
              children: storey.rooms.map((room) => {
                return {
                  id: room.id,
                  type: "ROOM",
                  name: room.name,
                  isSelected: createIsSelected("ROOM", room.id),
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
  }

  public async onCreateMap(leafletMap: LeafletMap): Promise<void> {
    const businessCenters: readonly BusinessCenter[] = await firstValueFrom(this.businessCenters.pipe(take(1)))

    const businessCentersById = new Map<number, Map<number, { layer: LayerGroup, bounding: [ number, number ][] }>>()
    const masterLayerGroup = new LayerGroup()
    leafletMap.addLayer(masterLayerGroup)

    for (const businessCenter of businessCenters) {
      const storeysById = new Map<number, { layer: LayerGroup, bounding: [ number, number ][] }>()

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

        for (const room of storey.rooms) {
          if (room.position === null) {
            continue
          }

          const polygon = new Polygon(JSON.parse(room.position).coords, {
            fillColor: "transparent",
            stroke: false
          })

          polygon.addEventListener("mouseover", () => {
            polygon.setStyle({ fillColor: "red" })
          })

          polygon.addEventListener("mouseout", () => {
            polygon.setStyle({ fillColor: "transparent" })
          })

          polygon.addEventListener("click", () => {
            this.onClickRoomPolygon("ROOM", room.id)
          })

          polygon.bindTooltip(room.name, { className: "urb-tooltip", permanent: true, direction: "center" })

          layerGroup.addLayer(polygon)
        }

        storeysById.set(storey.id, {
          layer: layerGroup,
          bounding: map.svgContainer.bounding
        })
      }

      businessCentersById.set(businessCenter.id, storeysById)
    }

    leafletMap.addLayer(businessCentersById.get(1)!.get(1)!.layer)
    leafletMap.fitBounds(businessCentersById.get(1)!.get(1)!.bounding)
  }

  protected onClickRoomPolygon(type: UrbTreeNode["type"], id: number): void {
    this.selectedTreeNode.next(`${ type }:${ id }`)
  }

  protected onClickTreeNode(treeNode: UrbTreeNode): void {
    this.selectedTreeNode.next(`${ treeNode.type }:${ treeNode.id }`)
  }

  protected childrenHandler(node: any): any[] {
    return node.children ?? []
  }

  /*protected isSelectedTreeNode(node: UrbTreeNode): Observable<boolean> {
    const selectedTreeNode: UrbTreeNode | null = this.selectedTreeNode.value

    if (selectedTreeNode === null) {
      return false
    }

    return selectedTreeNode.type === node.type && selectedTreeNode.id === node.id
  }*/
  /*
    protected selectedLevel = new FormControl<number>(1, { nonNullable: true })

    protected search = new FormControl()

    protected selectedData = new BehaviorSubject<{ room: Room | null, storey: BusinessCenterStorey | null, businessCenter: BusinessCenter | null }>({
      room: null,
      storey: null,
      businessCenter: null
    })

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

      /!*const floors = getSvgs()
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
      mapInstance.addLayer(room2)*!/
    }

    protected isSelectedTreeNode(node: any): boolean {
      const selectedData = this.selectedData.value

      if (selectedData.room !== null) {
        return node.type === "ROOM" && node.id === selectedData.room.id
      }

      if (selectedData.storey !== null) {
        return node.type === "STOREY" && node.id === selectedData.storey.id
      }

      if (selectedData.businessCenter !== null) {
        return node.type === "BUSINESS_CENTER" && node.id === selectedData.businessCenter.id
      }

      return false
    }

    protected onClickTreeNode(event: any) {
      switch (event.type) {
        case "BUSINESS_CENTER": {
          this.selectedData.next({
            businessCenter: event.__origin,
            room: null,
            storey: null
          })
          break
        }

        case "STOREY": {
          this.selectedData.next({
            storey: event.__origin,
            businessCenter: event.parentBusinessCenter,
            room: null
          })
          break
        }

        case "ROOM": {
          this.selectedData.next({
            room: event.__origin,
            storey: event.parentStorey,
            businessCenter: event.parentBusinessCenter
          })
          break
        }
      }
    }*/
}
