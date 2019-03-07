import { promisify } from 'util';

import redisMock from 'redis-mock';
const client = redisMock.createClient();

export const getAsync = promisify(client.get).bind(client);
export const setAsync = promisify(client.set).bind(client);

export function memoize(method: Function) {
  return async function(params: any) {
    const args = JSON.stringify(params);
    const cacheEntry = await getAsync(args);
    if (cacheEntry !== null) { 
      return JSON.parse(cacheEntry);
    }
    const result = await method(...params);
    await setAsync(args, JSON.stringify(result));
    return result;
  };
}
