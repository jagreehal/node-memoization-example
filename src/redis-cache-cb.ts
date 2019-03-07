import redisMock from 'redis-mock';
const client = redisMock.createClient();

export function memoize(fn) {
  return async function(params: any, cb) {
    const args = JSON.stringify(params);
    client.get(args, (getError, cacheEntry) => {
      if (getError) {
        return cb(getError);
      }
      if (cacheEntry !== null) {
        return cb(null, JSON.parse(cacheEntry));
      }
      fn(params, (err, result) => {
        if (err) {
          return cb(err);
        }
        client.set(args, JSON.stringify(result), () => {
          cb(null, result);
        });
      });
    });
  };
}
