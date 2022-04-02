export interface Rule {
  id: string
  domain: string
  from: string
  to: string
  resourceTypes: string[]
  describe: string
}

export type Domain = string[]
