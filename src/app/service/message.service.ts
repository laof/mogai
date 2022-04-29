import { environment } from 'src/environments/environment';

export function sender(data: any[]) {
  if (environment.production) {
    // @ts-ignore
    chrome.runtime.sendMessage(data).then((response) => {});
  } else {
    console.log(data);
  }
}
