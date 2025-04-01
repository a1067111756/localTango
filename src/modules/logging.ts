/* 日志打印模块 */
import type StorageDriver from './StorageDriver'

class Logging {
  // 属性 - 存储实例，在StorageDriver中初始化
  public storageDriverInstance: StorageDriver | null = null

  // 方法 - 设置存储实例
  setStorageDriver (instance: StorageDriver) {
    this.storageDriverInstance = instance
  }

  // 方法 - 打印
  log (options: any) {
    // 如果key不存在，忽略
    if (!options?.key) {
      return
    }

    // 获取全局配置
    const config = this.storageDriverInstance?.getConfig()

    // 打印模式
    const logMode = config?.logging === false
      ? false
      : (config?.logging === 'full' || (config?.logging as any)?.level === 'full')
        ? 'full'
        : 'simple'

    // 打印过滤器
    const logFilter = Array.isArray((config?.logging as any)?.filter) ? (config?.logging as any).filter : []

    // 过滤掉不需要的打印
    const originKey = options.key.split(`${config?.prefixOfKey}_`)[1]
    if (logFilter.length > 0 && !logFilter.includes(originKey)) {
      return
    }

    // 执行配置：logging配置为'full'时进行打印
    if (logMode === 'full') {
      console.log('local-tango执行配置:')
      console.log(config)
    }

    // 执行操作: logging配置不为false时进行打印
    if (config?.logging !== false) {
      console.log('local-tango执行操作:')
      console.log(options)
      console.log('\n')
    }
  }
}

// 属性 - logging实例
const logging = new Logging()

// 导出实例
export default logging

