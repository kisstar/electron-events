type AnyFunction = (...args: any[]) => any;

interface EventHandler<T = any[]> {
  (...args: T): any;
}
