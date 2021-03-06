import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzModalRef } from 'ng-zorro-antd/modal'
import { activeType, Rule } from '../data.types'
import { resourceTypes } from '../service/default-types.service'
import { DomainStorage } from '../service/storage.service'

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  providers: [FormBuilder],
})
export class SetupComponent implements OnInit, Rule {
  // parmarter start
  domain = ''
  from = ''
  to = ''
  use = false
  type: activeType = activeType.forward
  run = []
  describe = ''
  id = ''

  // end

  typesOfOption: string[] = resourceTypes
  typesOfSelectedValue = [resourceTypes[0]]

  domainOfOption: any[] = []

  validateForm!: FormGroup

  constructor(private fb: FormBuilder, private modal: NzModalRef) {}

  ngOnInit(): void {
    const ds = DomainStorage.get()
    const dlist: Array<{ label: string; value: string }> = []
    for (let i = 0; i < ds.length; i++) {
      const label = ds[i]
      dlist.push({ label, value: label })
    }
    this.domainOfOption = dlist

    this.validateForm = this.fb.group({
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      resourceTypes: [null, [Validators.required]],
      domain: [null, [Validators.required]],
      describe: [null],
    })
  }

  destroyModal(): void {
    this.modal.destroy()
  }

  ok() {
    if (!this.domain || !this.run.length || !this.from || !this.to) {
      return
    }

    const data: Rule = {
      use: true,
      domain: this.domain,
      type: activeType.forward,
      from: this.from,
      to: this.to,
      run: this.run,
      describe: this.describe,
      id: '',
    }

    this.modal.destroy(data)
  }

  submitForm() {}
}
