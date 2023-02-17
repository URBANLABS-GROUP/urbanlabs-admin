import { ChangeDetectionStrategy, Component } from "@angular/core"

@Component({
  selector: 'urb-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {

}
