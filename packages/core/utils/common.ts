export function getUUID(number = 32) {
  const numStr = '0123456789';
  const keyStr = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz${numStr}`;
  const keyStrLen = keyStr.length;
  let result = '';

  for (let i = 0; i < number; i++) {
    result += keyStr.charAt(Math.floor(Math.random() * keyStrLen));
  }

  return result;
}
