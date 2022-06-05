export enum activeType {
  inject,
  forward,
}

export interface Rule {
  id: string
  domain: string
  from?: string
  to?: string
  js?: string
  css?: string
  type: activeType
  run: string[]
  use: boolean
  resourceType?: string[]
  describe: string
}

export type Domain = string[]
