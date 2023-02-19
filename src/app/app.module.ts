import { HttpClientModule } from "@angular/common/http"
import { Injectable, NgModule } from "@angular/core"
import { ReactiveFormsModule } from "@angular/forms"
import { BrowserModule, Title } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { RouterStateSnapshot, TitleStrategy } from "@angular/router"
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

@Injectable()
export class UrbTitleStrategy extends TitleStrategy {
  constructor(private title: Title) {
    super()
  }

  public override updateTitle(snapshot: RouterStateSnapshot): void {
    const title: string | undefined = this.buildTitle(snapshot)

    if (title === null || typeof title === "undefined") {
      return
    }

    this.title.setTitle(`${ title } – UrbanLabs Admin`)
  }
}

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
  providers: [
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    ConfigService,
    {
      provide: TitleStrategy,
      useClass: UrbTitleStrategy
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
