export enum activeType {
  inject,
  forward,
}

export interface Rule {
  id: string;
  domain: string;
  from?: string;
  to: string;
  type: activeType;
  run: string[];
  resourceType?: string[];
  describe: string;
}

export type Domain = string[];
