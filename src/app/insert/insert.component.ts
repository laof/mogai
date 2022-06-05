import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzModalRef } from 'ng-zorro-antd/modal'
import { activeType, Rule } from '../data.types'
import { injectType } from '../service/default-types.service'
import { DomainStorage } from '../service/storage.service'

@Component({
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.scss'],
})
export class InsertComponent implements OnInit, Rule {
  // parmarter start
  domain = ''
  from = ''
  js = ''
  css = ''
  run = []
  describe = ''
  use: boolean = false
  id = ''
  type: activeType = activeType.inject

  // end

  typesOfOption: string[] = injectType
  typesOfSelectedValue = [injectType[0]]

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
      js: [null],
      css: [null],
      resourceTypes: [null, [Validators.required]],
      domain: [null, [Validators.required]],
      describe: [null],
    })
  }

  destroyModal(): void {
    this.modal.destroy()
  }

  ok() {
    if (!this.domain || !this.run.length || (!this.js && !this.css)) {
      return
    }

    const data: Rule = {
      domain: this.domain,
      js: this.js,
      css: this.css,
      from: '',
      use: true,
      type: activeType.inject,
      run: this.run,
      describe: this.describe,
      id: '',
    }

    this.modal.destroy(data)
  }

  submitForm() {}
}
