declare module "big.js" {
  export default class Big {
    constructor(value: number | string);
    plus(value: number | string): Big;
    minus(value: number | string): Big;
    times(value: number | string): Big;
    div(value: number | string): Big;
    toString(): string;
    toNumber(): number;
  }
}
