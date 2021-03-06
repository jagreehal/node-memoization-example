import { promisify } from 'util';

import redisMock from 'redis-mock';
const client = redisMock.createClient();

export const getAsync: (key: string) => Promise<string> = promisify(
  client.get
).bind(client);
export const setAsync = promisify(client.set).bind(client);

interface MemoizeOptions {
  prefix?: string;
  expire?: number;
}

export function flushall() {
  client.flushall();
}

export function memoize<T>(fn, o?: MemoizeOptions) {
  return async function(...params: any): Promise<T> {
    const args = JSON.stringify(params);
    const cacheKey = `${o ? o.prefix : ''}:${args}`;
    const cacheEntry = await getAsync(cacheKey);
    if (cacheEntry !== null) {
      return JSON.parse(cacheEntry);
    }

    const result = await fn(...params);
    if (result !== undefined) {
      o && o.expire
        ? await setAsync(cacheKey, JSON.stringify(result), 'EX', o.expire)
        : await setAsync(cacheKey, JSON.stringify(result));
    }

    return result;
  };
}
