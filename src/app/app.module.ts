import { BrowserModule } from '@angular/platform-browser'
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n'
import { CommonModule, registerLocaleData } from '@angular/common'
import en from '@angular/common/locales/en'

import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzGridModule } from 'ng-zorro-antd/grid'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { SetupComponent } from './setup/setup.component'
import { DomainComponent } from './domain/domain.component'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { StartService } from './service/start.service'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { icons } from './icon.service'
const ModuleNZ = [
  NzSwitchModule,
  NzModalModule,
  NzSelectModule,
  NzTableModule,
  NzInputModule,
  NzGridModule,
  NzCardModule,
  NzButtonModule,
  NzFormModule,
  NzIconModule.forRoot(icons),
]

registerLocaleData(en)

export function loadFactory(loadService: StartService): Function {
  return () => loadService.load()
}

@NgModule({
  declarations: [AppComponent, SetupComponent, DomainComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    ...ModuleNZ,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: APP_INITIALIZER,
      useFactory: loadFactory,
      deps: [StartService, Injector],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
