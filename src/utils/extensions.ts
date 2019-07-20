declare global {
  interface Array<T> {
    flat(this: T[]): T;
    sum(this: T[]): T;
  }
}
const extension = (() => {
  Array.prototype.flat = function<T>(this: T[][]): T[] {
    return this.reduce((a, b) => a.concat(b), []);
  };

  Array.prototype.sum = function<T>(this: T[]): any {
    return this.reduce((a: any, b: any): any => a + b, 0);
  };
})();

export default extension;
