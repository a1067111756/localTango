/* 库内部的声明文件 */

// 全局配置声明
interface LocalTangoOptions {
  encrypt: boolean,
  encryptKey: string,
  driver: 'localStorage' | 'sessionStorage' | 'session' | 'storage',
  prefixOfKey: string,
}
