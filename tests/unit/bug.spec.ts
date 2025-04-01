/* 插件 -> 场景测试 */
import LocalTango from "../../src/index"
import { defaultGlobalOptions } from '../../src/config'

describe('插件 -> 积累bug测试', () => {
  // 生命周期 - 每个测试进行前
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()

    LocalTango.config(defaultGlobalOptions)
  })

  it('removeItem函数没用清理动态配置，导致后续函数调用出错测试', async () => {
    // 存储第一个字段 - storage存储
    const key = 'bug1:removeItem:key'
    const value = 'bug1:removeItem:key测试内容';
    (LocalTango as any).setItem(key, value)
    expect((LocalTango as any).getItem(key)).toEqual(value)

    // 存储第二个字段 - session存储
    const key1 = 'bug1:removeItem:key1'
    const value1 = 'bug1:removeItem:key1测试内容';
    (LocalTango.session as any).setItem(key1, value1)
    expect((LocalTango.session as any).getItem(key1)).toEqual(value1)

    // 存储第三个字段 - storage存储
    const key2 = 'bug1:removeItem:key2'
    const value2 = 'bug1:removeItem:key2测试内容';
    (LocalTango as any).setItem(key2, value2)
    expect((LocalTango as any).getItem(key2)).toEqual(value2);

    // 清除第一个字段
    (LocalTango as any).removeItem(key)
    expect((LocalTango as any).getItem(key)).toEqual(null);

    // 清除第二个字段
    (LocalTango.session as any).removeItem(key1)
    expect((LocalTango.session as any).getItem(key1)).toEqual(null);

    // 清除第三个字段
    (LocalTango as any).removeItem(key2)
    expect(localStorage.getItem(key2)).toEqual(null)
  });
})
