type AnyFunction = (...args: any[]) => any;

interface EventHandler<T = any[]> {
  (...args: T extends Array<any> ? T : [T]): any;
}
