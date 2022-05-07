import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { save, files, server } from './remote';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.scss'],
})
export class CloudComponent implements OnInit {
  data: any[] = [];
  loading = true;
  constructor(private http: HttpClient, private modal: NzModalRef) {}

  ngOnInit(): void {
    this.http.get(server).subscribe((res: any) => {
      this.data = files(undefined, res.files);
      this.loading = false;
    });
  }

  download(obj: any) {
    this.loading = true;
    this.http
      .get(obj.link, {
        responseType: 'text',
      })
      .subscribe((res: any) => {
        save(res, obj.name);
        this.loading = false;
      });
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  ok() {
    this.modal.destroy();
  }

  submitForm() {}
}
