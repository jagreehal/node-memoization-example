import { promisify } from 'util';

import redisMock from 'redis-mock';
const client = redisMock.createClient();

export const getAsync = promisify(client.get).bind(client);
export const setAsync = promisify(client.set).bind(client);


export function memoize(method) {
  const cache = {};

  return async function(params: any) {
    const args = JSON.stringify(params);
    cache[args] = cache[args] || (await method(...params));
    return cache[args];
  };
}
