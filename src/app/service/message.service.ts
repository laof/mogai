import { environment } from 'src/environments/environment'
import { Rule } from '../data.types'

export function sender(data: any[]): Promise<any> {
  const list: Rule[] = JSON.parse(JSON.stringify(data))
  const arr = list.filter((item) => item.use)

  if (environment.production) {
    // @ts-ignore
    return chrome.runtime.sendMessage(arr)
  } else {
    console.log(arr)
    return Promise.resolve(arr)
  }
}
