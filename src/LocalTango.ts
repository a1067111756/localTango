/* LocalTango类 - 对外的导出对象，负责导出功能的形式以及支持功能的配置
*  功能:
*    a. 基本功能, 支持localStorage，sessionStorage
*    b. 支持复杂对象存储，支持string, number, boolean, object, Array等常见数据类型的存储
*    c. 支持存储加密
*    d. 支持存储过期时间戳
*  调用形式:
*    a. 对象调用 - LocalTango.getItem()
*    b. 链式调用 - LocalTango.storage.encrypt.getItem()
*  逻辑处理:
*    入口分发(index.ts) --> 数据处理层(modules/StorageDriver.ts) ---> 数据存储层(localStorage/sessionStorage)
* */
import { defaultGlobalOptions } from './config'
import StorageDriver from './modules/StorageDriver'

class LocalTango extends StorageDriver {
  constructor () {
    super(defaultGlobalOptions)
  }

  // 方法 - 动态配置使用localStorage driver
  public storage () {
    this.dynamicOptions.driver = 'storage'
    return this
  }

  // 方法 - 动态配置使用sessionStorage driver
  public session () {
    this.dynamicOptions.driver = 'session'
    return this
  }

  // 方法 - 动态配置使用encrypt模式
  public encrypt () {
    this.dynamicOptions.encrypt = true
    return this
  }

  // 方法 - 修改全局配置选项
  public config (options: LocalTangoConfig) {
    for (const key in options) {
      if (!(key in this.globalOptions)) {
        throw new Error(`LocalTango.config不支持属性${key}，请检查配置`)
      }

      if (key === 'driver' && !Object.values(StorageDriver.SUPPORT_DRIVER).includes(options.driver as string)) {
        throw new Error(`do not support this driver type: ${options.driver}, you can use: ${Object.values}`)
      }

      this.globalOptions[key] = options[key]
    }

    return this
  }
}

const localTango = new LocalTango()
const localTangoProxy = new Proxy<LocalTango>(localTango, {
  get(target: LocalTango, key: string, receiver: any) {
    if (key === 'session' || key === 'storage') {
      target[key]()
      return receiver
    }

    if (key === 'encrypt') {
      target[key]()
      return receiver
    }

    return Reflect.get(target, key)
  }
})

export default localTangoProxy

