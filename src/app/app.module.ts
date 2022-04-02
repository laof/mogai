import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations'
import { NZ_I18N } from 'ng-zorro-antd/i18n'
import { zh_CN } from 'ng-zorro-antd/i18n'
import {
  APP_BASE_HREF,
  CommonModule,
  registerLocaleData,
} from '@angular/common'
import zh from '@angular/common/locales/zh'

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
]

registerLocaleData(zh)

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
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent],
})
export class AppModule {}
