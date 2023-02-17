import { ChangeDetectionStrategy, Component } from "@angular/core"
import { MapOptions, TileLayer } from "leaflet"

@Component({
  selector: "urb-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: [ "./home-page.component.css" ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  public options: MapOptions = {
    zoom: 13,
    center: [ 51.505, -0.09 ],
    layers: [
      new TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      })
    ],
    attributionControl: false
  }
}
