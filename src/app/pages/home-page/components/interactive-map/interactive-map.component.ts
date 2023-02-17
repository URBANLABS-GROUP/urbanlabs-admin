import { CommonModule } from "@angular/common"
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, Output, SimpleChange } from "@angular/core"
import { Map as LeafletMap, MapOptions } from "leaflet"

type InteractiveMapSimpleChanges = {
  options: SimpleChange
}

@Component({
  selector: "urb-interactive-map",
  standalone: true,
  imports: [ CommonModule ],
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `:host { display: block }`
  ]
})
export class InteractiveMapComponent implements OnChanges, OnDestroy {
  @Input()
  public options!: MapOptions

  @Output()
  public mapInstanceChanges: EventEmitter<LeafletMap> = new EventEmitter<LeafletMap>()

  private mapInstance: LeafletMap | null = null

  constructor(private elementRef: ElementRef<HTMLElement>,
              private ngZone: NgZone) {
  }

  public ngOnChanges(changes: InteractiveMapSimpleChanges): void {
    if (Reflect.has(changes, "options") && this.mapInstance === null) {
      const options: MapOptions = changes.options.currentValue
      this.ngZone.runOutsideAngular(() => {
        this.mapInstance = new LeafletMap(this.elementRef.nativeElement, options)
        this.mapInstanceChanges.emit(this.mapInstance)
      })
    }
  }

  public ngOnDestroy(): void {
    if (this.mapInstance === null) {
      return
    }

    this.mapInstance.remove()
    this.mapInstance = null
  }
}
