import { memoize } from './memory-cache';

export async function serviceA({ a }) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ a, now: Date.now() });
    }, 0);
  });
}

describe('When calling api', () => {
  it('Should be able to memoize results', async () => {
    const memoizedApi: any = memoize(serviceA);

    const result1 = await memoizedApi({ a: 1 });
    const result2 = await memoizedApi({ a: 1 });
    const result3 = await memoizedApi({ a: 2 });
    expect(result1).toEqual(result2);
    expect(result2).not.toEqual(result3);
  });
  it('Should be able to memoize results using prefix', async () => {
    const memoizedApi: any = memoize(serviceA, { prefix: 'foo' });

    const result1 = await memoizedApi({ a: 1 });
    const result2 = await memoizedApi({ a: 1 });
    const result3 = await memoizedApi({ a: 2 });
    expect(result1).toEqual(result2);
    expect(result2).not.toEqual(result3);
  });
});
