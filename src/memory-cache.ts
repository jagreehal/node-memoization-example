interface MemoizeOptions {
  prefix?: string;
}

export function memoize(fn, o?: MemoizeOptions) {
  const cache = {};

  return async function(...params: any) {
    const args = JSON.stringify(params);
    const cacheKey = `${o ? o.prefix : ''}:[${args}]`;
    cache[cacheKey] = cache[cacheKey] || (await fn(...params));
    return cache[cacheKey];
  };
}
