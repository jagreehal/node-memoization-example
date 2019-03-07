import { memoize } from './redis-cache';

export async function serviceA({ a }) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ a, now: Date.now() });
    }, 0);
  });
}

describe('When calling api', () => {
  it('Should be able to memoize results', async () => {
    // this can be changed to take in params such as to expire etc.
    const memoizedApi: any = memoize(serviceA);

    const result1 = await memoizedApi({ a: 1 });
    const result2 = await memoizedApi({ a: 1 });
    const result3 = await memoizedApi({ a: 2 });
    expect(result1).toEqual(result2);
    expect(result2).not.toEqual(result3);
  });
});
