// tslint:disable-next-line:import-name
import Redis from 'ioredis-mock';
const redis = new Redis();

interface MemoizeOptions {
  prefix?: string;
  expire?: number;
}

export function flushall() {
  redis.flushall();
}

export function memoize<T>(fn, o?: MemoizeOptions) {
  return async function(...params: any): Promise<T> {
    const args = JSON.stringify(params);
    const cacheKey = `${o ? o.prefix : ''}:${args}`;
    const cacheEntry = await redis.get(cacheKey);
    if (cacheEntry !== null) {
      return JSON.parse(cacheEntry);
    }
    const result = await fn(...params);
    if (result !== undefined) {
      o && o.expire
        ? await redis.set(cacheKey, JSON.stringify(result), 'EX', o.expire)
        : await redis.set(cacheKey, JSON.stringify(result));
    }
    return result;
  };
}
