export const getDebug = (currentWindowName: string) => (
  windowName: string,
  ...args: any[]
) => console.log(`【${currentWindowName}.${windowName}】`, ...args);
