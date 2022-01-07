/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
export default {
  preset: "ts-jest",

  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // 测试文件中引入的文件类型推断
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json"
  ],

  transform: {
    // 将.js后缀的文件使用babel-jest处理
    "^.+\\.js$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  // 测试环境
  testEnvironment: "jsdom",

  // 转换忽略
  transformIgnorePatterns: [
    '/node_modules/'
  ],

  // 特殊符号映射， eg：@ ~等vue特殊路径的 映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // 测试命令执行时查找匹配的测试文件正则匹配
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],

  // jest测试模拟环境的地址
  testURL: 'http://localhost/',

  // jest测试监听提示插件
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};
