// import { memoize } from './lib/memory-cache';
import { memoize } from './lib/redis-cache';

export async function serviceA(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ now: Date.now() });
    }, 0);
  });
}

describe('When calling api', () => {
  it('Should be able to memoize results', async () => {
    // this can be changed to take in params such as to expire etc.
    const memoizedApi: any = memoize(serviceA);

    const result1 = await memoizedApi('xxx');
    const result2 = await memoizedApi('xxx');
    const result3 = await memoizedApi('zzz');
    expect(result1).toEqual(result2);
    expect(result2).not.toEqual(result3);
  });
});
