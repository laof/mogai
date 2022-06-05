// storage

import { all_urls,blogcsdnnet } from './default-types.service';

class storage {
  constructor(public key = 'storage') {}
  set(list: any[]) {
    if (Array.isArray(list)) {
      localStorage.setItem(this.key, JSON.stringify(list));
    }
  }

  get() {
    let data = [];
    try {
      const str = localStorage.getItem(this.key);
      if (str) {
        data = JSON.parse(str);
      }
    } catch (e) {}

    return data;
  }
}

class domain extends storage {
  constructor(key: string) {
    super(key);
  }
  override get() {
    let data = super.get();

    if (!data.length) {
      data = [all_urls,blogcsdnnet];
    }
    return data;
  }
}

class single {
  constructor(public key: string) {}

  get() {
    if (!localStorage.hasOwnProperty(this.key)) {
      this.set(true);
      return true;
    }

    return !!localStorage.getItem(this.key);
  }

  set(b: boolean) {
    return localStorage.setItem(this.key, b ? '1' : '');
  }
}

export const TableStorage = new storage('list');
export const DomainStorage = new domain('domain');
export const SwitchStorage = new single('switch');
