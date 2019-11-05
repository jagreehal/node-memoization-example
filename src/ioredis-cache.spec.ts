import { memoize, flushall } from './ioredis-cache';

interface ServiceA {
  a: number;
  now: number;
}

export async function serviceA({ a }) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ a, now: Date.now() });
    }, 0);
  });
}

describe('When calling api', () => {
  beforeEach(() => {
    flushall();
  });

  it('Should be able to memoize results', async () => {
    // this can be changed to take in params such as to expire etc.
    const memoizedApi = memoize<ServiceA>(serviceA, { prefix: 'redis' });

    const result1 = await memoizedApi({ a: 1 });
    const result2 = await memoizedApi({ a: 1 });
    const result3 = await memoizedApi({ a: 2 });
    expect(result1).toEqual(result2);
    expect(result2).not.toEqual(result3);
  });

  it('Should be able expire items after one second', async done => {
    const mockService = jest
      .fn()
      .mockResolvedValueOnce({ a: 1, now: 1 })
      .mockResolvedValueOnce({ a: 1, now: 2 });

    const mockedApi = memoize<ServiceA>(mockService, {
      prefix: 'redis',
      expire: 1
    });

    const result1 = await mockedApi({ a: 1 });

    const result2 = await mockedApi({ a: 1 });

    expect(result1).toEqual(result2);

    setTimeout(async () => {
      const result3 = await mockedApi({ a: 1 });

      // this should be the second time the service was called NOT the third
      expect(result3).toEqual({ a: 1, now: 2 });
      expect(result2).not.toEqual(result3);
      done();
    }, 1100);
  });
});
