import { Component, EventEmitter } from '@angular/core'
import { NzModalService } from 'ng-zorro-antd/modal'
import { environment } from 'src/environments/environment'
import { Rule } from './data.types'
import { DomainComponent } from './domain/domain.component'
import { sender } from './service/message.service'
import { SwitchStorage, TableStorage } from './service/storage.service'
import { guid } from './service/tools'
import { SetupComponent } from './setup/setup.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data: Rule[] = TableStorage.get()
  domainOfSelectedValue: string[] = []
  domainOfOption: any[] = []

  domainValue = ''
  switchValue = SwitchStorage.get()

  constructor(private modalService: NzModalService) {
    this.update(false)
  }

  ngOnInit(): void {}

  rmodal(loca?: Rule) {
    const eemit = new EventEmitter()

    this.modalService.create({
      nzTitle: loca ? 'Setup rules' : 'New rules',
      nzWidth: 700,
      nzAfterClose: eemit,
      nzComponentParams: loca || (null as any),
      nzMaskClosable: true,
      nzContent: SetupComponent,
    })
    eemit.subscribe((res: any) => {
      if (!res) {
        return
      }
      res.id = loca ? loca.id : guid()

      if (loca) {
        const i = this.data.findIndex((data) => data.id == loca.id)
        if (i >= 0) {
          this.data[i] = res
        }
      } else {
        this.data.push(res)
      }

      this.data = JSON.parse(JSON.stringify(this.data))
      TableStorage.set(this.data)
      this.update()
    })
  }

  update(isEmit: boolean = true) {
    this.domainOfOption = Array.from(
      new Set(this.data.map((data) => data.domain)),
    )
    if (isEmit && this.switchValue) {
      sender(this.data)
    }
  }

  domain() {
    const eemit = new EventEmitter()
    this.modalService.create({
      nzTitle: 'Domain',
      nzWidth: 700,
      nzAfterClose: eemit,
      nzMaskClosable: true,
      nzContent: DomainComponent,
    })
    eemit.subscribe((res: any) => {
      if (!res) {
        return
      }
    })
  }

  del(id: string) {
    this.data = this.data.filter((data) => data.id !== id)
    TableStorage.set(this.data)
    this.update()
  }

  switchChange(data: any) {
    SwitchStorage.set(data)

    if (data) {
      sender(this.data)
    } else {
      sender([])
    }
  }
}
