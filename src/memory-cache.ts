export function memoize(fn) {
  const cache = {};

  return async function(...params: any) {
    const args = JSON.stringify(params);
    cache[args] = cache[args] || (await fn(params));
    return cache[args];
  };
}
