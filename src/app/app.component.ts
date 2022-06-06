import { Component, EventEmitter } from '@angular/core'
import { NzModalService } from 'ng-zorro-antd/modal'
import { activeType, Rule } from './data.types'
import { DomainComponent } from './domain/domain.component'
import { sender } from './service/message.service'
import { SwitchStorage, TableStorage } from './service/storage.service'
import { guid } from './service/tools'
import { SetupComponent } from './setup/setup.component'
import { InsertComponent } from './insert/insert.component'
import { NzMessageService } from 'ng-zorro-antd/message'
import { CloudComponent } from './cloud/cloud.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data: Rule[] = TableStorage.get()
  domainOfSelectedValue: string[] = []
  domainOfOption: any[] = []

  domainValue: any = null;
  switchValue = SwitchStorage.get()

  constructor(
    private modalService: NzModalService,
    private message: NzMessageService,
  ) {
    this.update(false)
  }

  ngOnInit(): void {}

  resetart() {
    const id = this.message.loading('service is restarting, please wait ...', {
      nzDuration: 0,
    }).messageId
    setTimeout(() => {
      this.message.remove(id)
    }, 1000)
    sender([]).then(() => sender(this.data))
  }

  download() {
    const eemit = new EventEmitter()
    this.modalService.create({
      nzTitle: 'Download files',
      nzWidth: 700,
      nzAfterClose: eemit,
      nzMaskClosable: true,
      nzContent: CloudComponent,
    })
    eemit.subscribe((res: any) => {
      if (!res) {
        return
      }
    })
  }

  formatterInsert(data: Rule) {
    const txt = []

    data.js && txt.push(data.js)
    data.css && txt.push(data.css)

    return txt.join(' ')
  }

  itemUpdate(i: number) {
    this.data[i].use = !this.data[i].use
    TableStorage.set(this.data)
    this.update()
  }

  insert(loca?: Rule) {
    const eemit = new EventEmitter()

    this.modalService.create({
      nzTitle: loca ? 'Setup inject' : 'New inject',
      nzWidth: 700,
      nzAfterClose: eemit,
      nzComponentParams: loca || (null as any),
      nzMaskClosable: true,
      nzContent: InsertComponent,
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

  pop(data: Rule) {
    if (data.type === activeType.inject) {
      this.insert(data)
    } else {
      this.rmodal(data)
    }
  }

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
