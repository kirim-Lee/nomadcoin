declare global {
  interface Array<T> {
    flat(this: T[]): T;
    sum(this: T[]): T;
    group(this: T[], acc?: (value: T) => string): T;
  }
}

interface IGroup {
  [key: string]: number;
}

const extension = (() => {
  Array.prototype.flat = function<T>(this: T[][]): T[] {
    return this.reduce((a, b) => a.concat(b), []);
  };

  Array.prototype.sum = function<T>(this: T[]): any {
    return this.reduce((a: any, b: any): any => a + b, 0);
  };

  Array.prototype.group = function<T>(this: T[], acc?: (value: T) => string): IGroup {
    return this.reduce((a: IGroup, b: T) => {
      const key = '' + (typeof acc === 'function' ? acc(b) : b);
      if (a[key] === undefined) {
        a[key] = 0;
      }
      a[key]++;
      return a;
    }, {});
  };
})();

export default extension;
