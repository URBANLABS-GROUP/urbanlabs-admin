import { ChangeDetectionStrategy, Component } from "@angular/core"
import { BoundsLiteral, CRS, LayerGroup, MapOptions, Polygon, SVGOverlay } from "leaflet"
import { BehaviorSubject, catchError, firstValueFrom, map, Observable, of, shareReplay, switchMap, take, tap, timer, withLatestFrom } from "rxjs"
import { BusinessCenter, BusinessCenterStorey, BusinessCenterStoreyMap, LeafletMap, Room, RoomTelemetryInfo, StoreyTelemetryInfo } from "./models"
import { HomeApiService } from "./services/home-api.service"

type UrbBusinessCenterTreeNode = {
  id: number
  type: "CENTER"
  name: string
  isSelected: Observable<boolean>
  children: UrbStoreyTreeNode[]
  original: BusinessCenter
}

type UrbStoreyTreeNode = {
  id: number
  type: "STOREY"
  parentBusinessCenterId: number
  name: string
  isSelected: Observable<boolean>
  children: UrbRoomTreeNode[]
  origin: BusinessCenterStorey
}

type UrbRoomTreeNode = {
  id: number
  type: "ROOM"
  parentBusinessCenterId: number
  parentStoreyId: number
  name: string
  isSelected: Observable<boolean>
  children: never[]
  origin: Room
}

type UrbTreeNode = UrbBusinessCenterTreeNode | UrbStoreyTreeNode | UrbRoomTreeNode

type UrbTreeNodeSymbol = string

function searchTreeNode(symbol: string, treeNode: UrbTreeNode): UrbTreeNode | null {
  const [ type, id ] = symbol.split(":")

  if (treeNode.type === type && treeNode.id === parseFloat(id)) {
    return treeNode
  }

  for (const child of treeNode.children) {
    const founded = searchTreeNode(symbol, child)

    if (founded !== null) {
      return founded
    }
  }

  return null
}

function searchTreeNodeSeveral(symbol: string, treeNodes: UrbTreeNode[]): UrbTreeNode | null {
  let result: UrbTreeNode | null = null

  for (const treeNode of treeNodes) {
    const searchResult = searchTreeNode(symbol, treeNode)

    if (searchResult === null) {
      continue
    }

    result = searchResult
    break
  }

  return result
}

// --------------

type StoreyController = {
  show(target: LeafletMap | LayerGroup): void
  hide(): void
  getBounds(): BoundsLiteral
  unselectAllRooms(): void
  getRoomController(id: number): RoomController | null
}

type RoomController = {
  id: number
  addTo(target: LeafletMap | LayerGroup): void
  select(): void
  unselect(): void

  onClick(listener: () => void): () => void
}

function createRoomController(room: Room): RoomController {
  const polygon: Polygon = new Polygon(JSON.parse(room.position).coords, {
    fillColor: "transparent",
    stroke: false
  })

  let isSelected: boolean = false

  const select = () => {
    polygon.setStyle({
      fillColor: "red"
    })
    isSelected = true
  }

  const unselect = () => {
    polygon.setStyle({
      fillColor: "transparent"
    })
    isSelected = false
  }

  polygon.addEventListener("mouseover", () => {
    if (isSelected) {
      return
    }

    polygon.setStyle({
      fillColor: "red"
    })
  })

  polygon.addEventListener("mouseout", () => {
    if (isSelected) {
      return
    }

    polygon.setStyle({
      fillColor: "transparent"
    })
  })

  polygon.bindTooltip(room.name, { className: "urb-tooltip", permanent: true, direction: "center" })

  return {
    id: room.id,
    select: select,
    unselect: unselect,
    addTo: (target: LeafletMap | LayerGroup) => {
      polygon.addTo(target)
    },
    onClick: (listener) => {
      polygon.addEventListener("click", listener)
      return () => polygon.removeEventListener("click", listener)
    }
  }
}

function createStoreyController(storey: BusinessCenterStorey,
                                roomControllers: readonly RoomController[]): StoreyController {
  const layerGroup = new LayerGroup()
  const map: BusinessCenterStoreyMap = JSON.parse(storey.map)
  const element = document.createElementNS("http://www.w3.org/2000/svg", "svg")

  for (const [ key, value ] of Object.entries(map.svgContainer.attributes)) {
    element.setAttribute(key, value)
  }

  element.innerHTML = map.svgContainer.innerHtml
  const storeyMap = new SVGOverlay(element, map.svgContainer.bounding)
  layerGroup.addLayer(storeyMap)

  for (const roomController of roomControllers) {
    roomController.addTo(layerGroup)
  }

  return {
    show: (target: LeafletMap | LayerGroup) => {
      if (target.hasLayer(layerGroup)) {
        return
      }

      target.addLayer(layerGroup)

      if (target instanceof LeafletMap) {
        target.fitBounds(map.svgContainer.bounding)
      }
    },
    hide: () => {
      layerGroup.remove()
    },
    unselectAllRooms: () => {
      for (const roomController of roomControllers) {
        roomController.unselect()
      }
    },
    getBounds: () => {
      return map.svgContainer.bounding
    },
    getRoomController: (id: number) => {
      return roomControllers.find(r => r.id === id) ?? null
    }
  }
}

function isMobile(): boolean {
  return window.matchMedia("screen and (max-width: 47.9625em)").matches
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
    minZoom: -2,
    zoomDelta: 0.5
  }

  protected isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  protected isTreeOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  protected isPortalOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  private businessCenters: Observable<readonly BusinessCenter[]> = this.homeApiService.getBusinessCenters().pipe(
    shareReplay(1)
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
          original: center,
          children: center.storeys.map((storey) => {
            return {
              id: storey.id,
              type: "STOREY",
              name: storey.name,
              isSelected: createIsSelected("STOREY", storey.id),
              parentBusinessCenterId: center.id,
              origin: storey,
              children: storey.rooms.map((room) => {
                return {
                  id: room.id,
                  type: "ROOM",
                  name: room.name,
                  isSelected: createIsSelected("ROOM", room.id),
                  parentBusinessCenterId: center.id,
                  parentStoreyId: storey.id,
                  origin: room,
                  children: []
                }
              })
            }
          })
        } as UrbBusinessCenterTreeNode
      })
    }),
    tap(() => this.isLoading.next(false)),
    shareReplay(1)
  )

  protected selectedRoomTelemetryInfo: Observable<{ roomName: string, properties: Map<string, string> } | null> = this.selectedTreeNode.pipe(
    withLatestFrom(this.businessCenterTrees),
    switchMap(([ symbol, businessCenterTrees ]: [ UrbTreeNodeSymbol | null, UrbTreeNode[] ]) => {
      if (symbol === null) {
        return of(null)
      }

      const [ type, id ] = symbol.split(":") as [ UrbTreeNode["type"], string ]

      if (type === "CENTER" || type === "STOREY") {
        return of(null)
      }

      const treeNode: UrbRoomTreeNode | null = searchTreeNodeSeveral(symbol, businessCenterTrees) as UrbRoomTreeNode | null

      if (treeNode === null) {
        throw new Error(`TreeNode with symbol="${ symbol }" not found`)
      }

      return timer(0, 15_000).pipe(
        switchMap(() => this.homeApiService.getRoomTelemetryInfo(parseFloat(id)).pipe(
          map((telemetryInfo: RoomTelemetryInfo) => {
            const result: Map<string, string> = new Map()

            result.set("rent", telemetryInfo.rent === null
              ? "Не известно"
              : telemetryInfo.rent.toLocaleString("ru-RU") + " ₽")

            result.set("area", treeNode.origin.area === null
              ? "Не известно"
              : treeNode.origin.area.toLocaleString("ru-RU") + " м2")

            result.set("requiredTemp", treeNode.origin.requiredTemp === null
              ? "Не известно"
              : (treeNode.origin.requiredTemp / 10).toLocaleString("ru-RU") + " °С")

            result.set("curTemp", telemetryInfo.curTemp === null
              ? "Не известно"
              : (telemetryInfo.curTemp / 10).toLocaleString("ru-RU") + " °С")

            result.set("averageCurTemp", telemetryInfo.averageCurTemp === null
              ? "Не известно"
              : (telemetryInfo.averageCurTemp / 10).toLocaleString("ru-RU") + " °С")

            result.set("allowablePowerConsumption", treeNode.origin.allowablePowerConsumption === null
              ? "Не известно"
              : treeNode.origin.allowablePowerConsumption.toLocaleString("ru-RU") + " кВт*ч")

            result.set("curDayPowerConsumption", telemetryInfo.curDayPowerConsumption === null
              ? "Не известно"
              : telemetryInfo.curDayPowerConsumption.toLocaleString("ru-RU") + " кВт*ч")

            result.set("averagePowerConsumption", telemetryInfo.averagePowerConsumption === null
              ? "Не известно"
              : telemetryInfo.averagePowerConsumption.toLocaleString("ru-RU") + " кВт*ч")

            result.set("curDayWaterConsumption", telemetryInfo.curDayWaterConsumption === null
              ? "Не известно"
              : telemetryInfo.curDayWaterConsumption.toLocaleString("ru-RU") + " м3")

            result.set("averageWaterConsumption", telemetryInfo.averageWaterConsumption === null
              ? "Не известно"
              : telemetryInfo.averageWaterConsumption.toLocaleString("ru-RU") + " м3")

            result.set("expenses", telemetryInfo.expenses === null
              ? "Не известно"
              : telemetryInfo.expenses.toLocaleString("ru-RU") + " ₽")

            result.set("move", telemetryInfo.move === null
              ? "Не известно"
              : telemetryInfo.move ? "Да" : "Нет")

            return {
              roomName: treeNode.name,
              properties: result
            }
          }),
          catchError(() => of(null))
        ))
      )
    })
  )

  protected selectedStoreyTelemetryInfo: Observable<{ name: string, properties: Map<string, string> } | null> = this.selectedTreeNode.pipe(
    withLatestFrom(this.businessCenterTrees),
    switchMap(([ symbol, businessCenterTrees ]: [ UrbTreeNodeSymbol | null, UrbTreeNode[] ]) => {
      if (symbol === null) {
        return of(null)
      }

      const [ type, id ] = symbol.split(":") as [ UrbTreeNode["type"], string ]

      if (type === "CENTER") {
        return of(null)
      }

      const treeNode: UrbStoreyTreeNode | null = searchTreeNodeSeveral(symbol, businessCenterTrees) as UrbStoreyTreeNode | null

      if (treeNode === null) {
        throw new Error(`TreeNode with symbol="${ symbol }" not found`)
      }

      return timer(0, 15_000).pipe(
        switchMap(() => this.homeApiService.getStoreyTelemetryInfo(parseFloat(id)).pipe(
          map((telemetryInfo: StoreyTelemetryInfo) => {
            const result: Map<string, string> = new Map()

            result.set("rent", telemetryInfo.rent === null
              ? "Не известно"
              : telemetryInfo.rent.toLocaleString("ru-RU") + " ₽")

            result.set("curTemp", telemetryInfo.curTemp === null
              ? "Не известно"
              : (telemetryInfo.curTemp / 10).toLocaleString("ru-RU") + " °С")

            result.set("averageCurTemp", telemetryInfo.averageCurTemp === null
              ? "Не известно"
              : (telemetryInfo.averageCurTemp / 10).toLocaleString("ru-RU") + " °С")

            result.set("curDayPowerConsumption", telemetryInfo.curDayPowerConsumption === null
              ? "Не известно"
              : telemetryInfo.curDayPowerConsumption.toLocaleString("ru-RU") + " кВт*ч")

            result.set("averagePowerConsumption", telemetryInfo.averagePowerConsumption === null
              ? "Не известно"
              : telemetryInfo.averagePowerConsumption.toLocaleString("ru-RU") + " кВт*ч")

            result.set("curDayWaterConsumption", telemetryInfo.curDayWaterConsumption === null
              ? "Не известно"
              : telemetryInfo.curDayWaterConsumption.toLocaleString("ru-RU") + " м3")

            result.set("averageWaterConsumption", telemetryInfo.averageWaterConsumption === null
              ? "Не известно"
              : telemetryInfo.averageWaterConsumption.toLocaleString("ru-RU") + " м3")

            result.set("expenses", telemetryInfo.expenses === null
              ? "Не известно"
              : telemetryInfo.expenses.toLocaleString("ru-RU") + " ₽")

            return {
              name: treeNode.name,
              properties: result
            }
          }),
          catchError(() => of(null))
        ))
      )
    })
  )

  constructor(private homeApiService: HomeApiService) {
    this.selectedRoomTelemetryInfo.subscribe(console.debug)
    this.businessCenterTrees.subscribe()
  }

  public async onCreateMap(leafletMap: LeafletMap): Promise<void> {
    const businessCenters: readonly BusinessCenter[] = await firstValueFrom(this.businessCenters.pipe(take(1)))

    const businessCentersById = new Map<number, Map<number, StoreyController>>()
    const masterLayerGroup = new LayerGroup()
    leafletMap.addLayer(masterLayerGroup)

    for (const businessCenter of businessCenters) {
      const storeysById = new Map<number, StoreyController>()

      for (const storey of businessCenter.storeys) {
        if (storey.map === null) {
          continue
        }

        const roomControllers: RoomController[] = []

        for (const room of storey.rooms) {
          if (room.position === null) {
            continue
          }

          const roomController = createRoomController(room)

          roomController.onClick(() => {
            this.onClickRoomPolygon("ROOM", room.id)
          })

          roomControllers.push(roomController)
        }

        const storeyController = createStoreyController(storey, roomControllers)

        storeysById.set(storey.id, storeyController)
      }

      businessCentersById.set(businessCenter.id, storeysById)
    }

    this.selectedTreeNode.pipe(
      switchMap((selectedTreeNodeSymbol: string | null) => this.businessCenterTrees.pipe(
        tap((treeNodes) => {
          if (selectedTreeNodeSymbol === null) {
            return
          }

          const result = searchTreeNodeSeveral(selectedTreeNodeSymbol, treeNodes)

          if (result === null) {
            throw new Error(`TreeNode with symbol="${ selectedTreeNodeSymbol }" not found`)
          }

          switch (result.type) {
            case "CENTER":
              break
            case "STOREY": {
              const businessCenter = businessCentersById.get(result.parentBusinessCenterId)

              if (businessCenter) {
                const storeyController = businessCenter.get(result.id)
                businessCenter.forEach((storeyController) => storeyController.hide())

                storeyController?.show(leafletMap)
              }

              break
            }
            case "ROOM": {
              const businessCenter = businessCentersById.get(result.parentBusinessCenterId)

              if (businessCenter) {
                businessCenter.forEach((storeyController) => storeyController.hide())
                const storeyController = businessCenter.get(result.parentStoreyId)

                if (storeyController) {
                  storeyController.show(leafletMap)

                  const room = storeyController.getRoomController(result.id)

                  if (room) {
                    storeyController.unselectAllRooms()
                    room.select()
                  }
                }
              }
            }
          }
        })
      ))
    ).subscribe()
  }

  protected onClickRoomPolygon(type: UrbTreeNode["type"], id: number): void {
    this.selectedTreeNode.next(`${ type }:${ id }`)
  }

  protected onClickTreeNode(treeNode: UrbTreeNode): void {
    if (isMobile()) {
      this.isTreeOpen.next(false)
    }

    this.selectedTreeNode.next(`${ treeNode.type }:${ treeNode.id }`)
  }

  protected childrenHandler(node: any): any[] {
    return node.children ?? []
  }

  protected onClickTreeHeader(): void {
    if (!isMobile()) {
      return
    }

    this.isTreeOpen.next(!this.isTreeOpen.value)
  }

  public onClickPortal() {
    if (!isMobile()) {
      return
    }

    this.isPortalOpen.next(!this.isPortalOpen.value)
  }
}
