import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { ReactiveFormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import {
  TUI_SANITIZER,
  TuiAlertModule,
  TuiButtonModule,
  TuiDialogModule,
  TuiGroupModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiRootModule,
  TuiScrollbarModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core"
import { TuiAvatarModule, TuiInputModule, TuiIslandModule, TuiRadioBlockModule, TuiTreeModule } from "@taiga-ui/kit"
import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { ConfigService } from "./global/services/config/config.service"
import { AnalyticsModule } from "./pages/analytics-page/analytics.module"
import { InteractiveMapComponent } from "./pages/home-page/components/interactive-map/interactive-map.component"
import { HomePageComponent } from "./pages/home-page/home-page.component"

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    InteractiveMapComponent,
    AnalyticsModule,
    TuiGroupModule,
    TuiRadioBlockModule,
    ReactiveFormsModule,
    HttpClientModule,
    TuiIslandModule,
    TuiTreeModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiScrollbarModule,
    TuiAvatarModule,
    TuiLinkModule,
    TuiButtonModule,
    TuiLoaderModule
  ],
  providers: [ { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }, ConfigService ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
