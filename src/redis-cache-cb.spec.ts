import { memoize } from './redis-cache-cb';

export async function serviceA({ a }, cb) {
  setTimeout(() => {
    return cb(null, { a, now: Date.now() });
  }, 0);
}

describe('When calling api', () => {
  it('Should be able to memoize results', done => {
    // this can be changed to take in params such as to expire etc.
    const memoizedApi: any = memoize(serviceA);

    memoizedApi({ a: 1 }, (err, result1) => {
      memoizedApi({ a: 1 }, (err, result2) => {
        memoizedApi({ a: 2 }, (err, result3) => {
          expect(result1).toEqual(result2);
          expect(result2).not.toEqual(result3);
          done();
        });
      });
    });
  });
});
