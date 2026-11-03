module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '\\.(vue)$': 'vue-jest',
    '\\.(js|jsx|mjs)$': [
      'babel-jest',
      { presets: [['@babel/preset-env', { targets: 'defaults' }]] }
    ]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
