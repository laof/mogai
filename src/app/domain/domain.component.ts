import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzModalRef } from 'ng-zorro-antd/modal'
import { DomainStorage } from '../service/storage.service'

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss'],
})
export class DomainComponent implements OnInit {
  domainOfOption: any[] = []
  domainOfSelectedValue = []
  _dom_ = []

  validateForm!: FormGroup

  constructor(private fb: FormBuilder, private modal: NzModalRef) {
    this._dom_ = DomainStorage.get()
    this.domainOfSelectedValue = this._dom_
  }

  ngOnInit(): void {
    const children: Array<{ label: string; value: string }> = []
    for (let i = 0; i < this._dom_.length; i++) {
      children.push({ label: this._dom_[i], value: this._dom_[i] })
    }
    this.domainOfOption = children

    this.validateForm = this.fb.group({
      domain: [this._dom_, []],
    })
  }

  destroyModal(): void {
    this.modal.destroy()
  }

  ok() {
    DomainStorage.set(this.domainOfSelectedValue)
    this.modal.destroy()
  }

  submitForm() {}
}
