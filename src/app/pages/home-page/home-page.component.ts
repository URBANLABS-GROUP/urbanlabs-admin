import { ChangeDetectionStrategy, Component } from "@angular/core"
import { CRS, MapOptions, Polyline, SVGOverlay } from "leaflet"
import { LeafletMap } from "./models"

type Wall = {
  type: "WALL" | "ARC"
  points: [ number, number ][]
}

type Room = {
  id: string
  name: string
  perimeter: [ number, number ][]
  walls: readonly Wall[]
}

type Floor = {
  name: string
  level: number
  rooms: readonly Room[]
}

const build: Floor[] = [
  {
    name: "1",
    level: 1,
    rooms: [
      {
        id: "1",
        name: "Cab1",
        perimeter: [
          [ 0, 0 ],
          [ 0, 50 ],
          [ 50, 0 ]
        ],
        walls: [
          {
            type: "WALL",
            points: []
          }
        ]
      }
    ]
  }
]

const sdsd = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 400">
  <path stroke="#000" stroke-width="2" d="M1 1h198v398H1z"/>
</svg>`

@Component({
  selector: "urb-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: [ "./home-page.component.css" ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  public options: MapOptions = {
    // zoom: 4,
    // center: [ 25.25, 9 ],
    attributionControl: false,
    crs: CRS.Simple
    /*minZoom: 0,
    maxBounds: [
      [ 0, 0 ],
      [ 1000, 1000 ]
    ]*/
    // renderer: new Canvas()
  }

  constructor() {
    /*(CRS.Simple as any).projection = {
      ...Projection.LonLat,
      bounds: new Bounds([ 0, 0 ], [ 500, 500 ])
    }*/
  }

  protected onMapInstance(mapInstance: LeafletMap) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    el.setAttribute("viewBox", "0 0 200 400")
    el.setAttribute("fill", "transparent")
    el.innerHTML = "<path stroke=\"#000\" stroke-width=\"2\" d=\"M1 1h198v398H1z\"/>"
    mapInstance.addLayer(new SVGOverlay(el, [ [ 0, 0 ], [ 400, 200 ] ]))
    mapInstance.fitBounds([ [ 0, 0 ], [ 400, 200 ] ])

    const line = new Polyline([ [50, 0], [50, 400] ], { color: "red", lineCap: "butt" })
    line.addTo(mapInstance)
    // const bounds: any = [ [ 0, 0 ], [ 400, 200 ] ]
    // const overlay = new ImageOverlay("/assets/rect.png", bounds)
    // overlay.addTo(mapInstance)
    // mapInstance.fitBounds(bounds)
  }
}
