import { environment } from 'src/environments/environment';

export function sender(data: any[]): Promise<any> {
  if (environment.production) {
    // @ts-ignore
    return chrome.runtime.sendMessage(data);
  } else {
    console.log(data);
    return Promise.resolve(data);
  }
}
