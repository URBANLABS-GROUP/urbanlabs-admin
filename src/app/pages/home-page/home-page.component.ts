import { ChangeDetectionStrategy, Component } from "@angular/core"
import { CRS, MapOptions, SVGOverlay } from "leaflet"
import { LeafletMap } from "./models"
/*

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
*/

/*function getsdsd(): Record<string, any> {
  return {
    "floor1":
  }
}*/

type Floor = {
  level: number
  svgElement: any
  bounding: any
}

function getSvgs(): { "floor1": Floor, "floor2": Floor } {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  el.setAttribute("viewBox", "0 0 190 728")
  el.setAttribute("fill", "transparent")
  el.innerHTML = `<path stroke="#000" stroke-width="2" d="M2 664h150"/>
  <path stroke="#B0B0B0" stroke-width="2" d="M68 665v63M98 665v63M128 665v63M113 665v63M83 665v63M66 2v63M96 2v63M126 2v63M111 2v63M81 2v63"/>
  <path stroke="#000" stroke-width="2" d="M2 64h151M1 0v728M189 49v631M2 727h186M2 1h188M0 369h190"/>`

  const el2 = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  el2.setAttribute("viewBox", "0 0 190 728")
  el2.setAttribute("fill", "transparent")
  el2.innerHTML = `<path stroke="#000" stroke-width="2" d="M2 664h125"/>
  <path stroke="#B0B0B0" stroke-width="2" d="M16 665v63M46 665v63M76 665v63M61 665v63M31 665v63M16 2v63M46 2v63M76 2v63M61 2v63M31 2v63"/>
  <path stroke="#000" stroke-width="2" d="M2 64h125M1 0v728M189 2v726M2 727h186M2 1h188M116 369h74M0 369h74M128 609v56M126 63v56M127 610H60M56 555H0M56 183H0M56 493H0M56 305H0M56 431H0M56 243H0M132 493h56M132 305h56M132 431h56M132 243h56M132 555h56M132 181h56M55 383v-13M55 195v-13M133 443v-13M133 255v-13M133 507v-13M133 319v-13M55 507v-13M55 319v-13M55 445v-13M55 257v-13M133 417v13M133 229v13M55 430v-13M55 242v-13M133 492v-13M133 304v-13M133 554v-13M133 368v-13M55 554v-13M55 368v-13M55 492v-13M55 304v-13M133 370v13M133 182v13M127 119H60M20 610H0M21 119H1"/>`

  return {
    floor1: {
      level: 1,
      svgElement: el,
      bounding: [ [ 0, 0 ], [ 728, 190 ] ]
    },
    floor2: {
      level: 2,
      svgElement: el2,
      bounding: [ [ 0, 0 ], [ 728, 190 ] ]
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
    minZoom: -5
  }

  constructor() {
  }

  protected onMapInstance(mapInstance: LeafletMap) {

    const floor = getSvgs().floor2

    mapInstance.addLayer(new SVGOverlay(floor.svgElement, floor.bounding))
    mapInstance.fitBounds(floor.bounding)

    // const line = new Polyline([ [50, 0], [50, 400] ], { color: "red", lineCap: "butt" })
    // line.addTo(mapInstance)
    // const bounds: any = [ [ 0, 0 ], [ 400, 200 ] ]
    // const overlay = new ImageOverlay("/assets/rect.png", bounds)
    // overlay.addTo(mapInstance)
    // mapInstance.fitBounds(bounds)
  }
}
