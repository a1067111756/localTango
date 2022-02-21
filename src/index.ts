/* 插件注册入口，负责导出实例和window全局挂载 */
import localTangoInstance from './LocalTango'

// 挂载到window全局
window.localTango = localTangoInstance as any

// 导出默认实例
export default localTangoInstance
