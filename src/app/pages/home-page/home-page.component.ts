import { ChangeDetectionStrategy, Component } from "@angular/core"
import { BoundsLiteral, CRS, LayerGroup, MapOptions, Polygon, SVGOverlay } from "leaflet"
import { BehaviorSubject, firstValueFrom, map, Observable, shareReplay, switchMap, take, tap } from "rxjs"
import { BusinessCenter, BusinessCenterStorey, BusinessCenterStoreyMap, LeafletMap, Room } from "./models"
import { HomeApiService } from "./services/home-api.service"

type UrbBusinessCenterTreeNode = {
  id: number
  type: "CENTER"
  name: string
  isSelected: Observable<boolean>
  children: UrbStoreyTreeNode[]
}

type UrbStoreyTreeNode = {
  id: number
  type: "STOREY"
  parentBusinessCenterId: number
  name: string
  isSelected: Observable<boolean>
  children: UrbRoomTreeNode[]
}

type UrbRoomTreeNode = {
  id: number
  type: "ROOM"
  parentBusinessCenterId: number
  parentStoreyId: number
  name: string
  isSelected: Observable<boolean>
  children: never[]
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
              parentBusinessCenterId: center.id,
              children: storey.rooms.map((room) => {
                return {
                  id: room.id,
                  type: "ROOM",
                  name: room.name,
                  isSelected: createIsSelected("ROOM", room.id),
                  parentBusinessCenterId: center.id,
                  parentStoreyId: storey.id,
                  children: []
                }
              })
            }
          })
        } as UrbBusinessCenterTreeNode
      })
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  )

  constructor(private homeApiService: HomeApiService) {
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
              break;
            case "STOREY": {
              const businessCenter = businessCentersById.get(result.parentBusinessCenterId)

              if (businessCenter) {
                const storeyController = businessCenter.get(result.id)

                storeyController?.show(leafletMap)
              }

              break
            }
            case "ROOM": {
              const businessCenter = businessCentersById.get(result.parentBusinessCenterId)

              if (businessCenter) {
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
    this.selectedTreeNode.next(`${ treeNode.type }:${ treeNode.id }`)
  }

  protected childrenHandler(node: any): any[] {
    return node.children ?? []
  }
}
