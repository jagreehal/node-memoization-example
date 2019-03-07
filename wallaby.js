module.exports = function(wallaby) {
  return {
    debug: false,
    files: [
      'package.json',
      'tsconfig.json',
      '!src/**/*.spec.ts',
      'src/**/*.ts'
    ],
    tests: ['src/**/*.spec.ts'],
    env: {
      type: 'node',
      runner: 'node'
    },
    compilers: {
      '**/*.ts*': wallaby.compilers.typeScript({
        typescript: require('typescript')
      })
    },
    testFramework: 'jest',
    setup: function() {
      wallaby.testFramework.configure(require('./package.json').jest);
    }
  };
};
