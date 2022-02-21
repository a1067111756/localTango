/* 插件 -> 场景测试 */
import LocalTango from "../../src/index"
import { defaultGlobalOptions } from '../../src/config'

describe('插件 -> 场景测试', () => {
  // 生命周期 - 每个测试进行前
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()

    LocalTango.config(defaultGlobalOptions)
  })

  it('scene:driver、encrypt复合使用测试', async () => {
    const key = 'scene:storage_encrypt'
    const value = 'scene:storage_encrypt复合使用测试';
    (LocalTango.storage as any).encrypt.setItem(key, value)
    expect(localStorage.getItem(key)).not.toEqual(value)
    expect((LocalTango.storage as any).encrypt.getItem(key)).toEqual(value)

    const key1 = 'scene:session_encrypt'
    const value1 = 'scene:session_encrypt复合使用测试';
    (LocalTango.session as any).encrypt.setItem(key1, value1)
    expect(sessionStorage.getItem(key1)).not.toEqual(value1)
    expect((LocalTango.session as any).encrypt.getItem(key1)).toEqual(value1)
  });

  it('scene:复杂数据存储测试', async () => {
    const key = 'scene:complex_data'
    const value = {
      a: 12.68,
      b: 'abcdefghijklmnopqrstuvwxy',
      d: false,
      e: [123, 456, 'sss'],
      f: { aa: 12, bb: 'bb' },
      g: [
        { a1: 'hello', b1: 'world' },
        { c1: 'rollup', d1: 'jest' }
      ]
    };
    (LocalTango.storage as any).encrypt.setItemJSON(key, value)
    expect((LocalTango.storage as any).encrypt.getItemJSON(key)).toEqual(value)
  });

  it('scene:带时间戳过期测试', async () => {
    // 无过期期限
    const key = 'scene:timestamp'
    const value = 'scene:timestamp无过期戳测试Value';
    (LocalTango.storage as any).encrypt.setItemExpired(key, value)
    expect((LocalTango.storage as any).encrypt.getItemExpired(key)).toEqual(value)

    // 过期期限
    const key1 = 'scene:timestamp1'
    const value1 = 'scene:timestamp过期戳测试Value';
    (LocalTango.storage as any).encrypt.setItemExpired(key1, value1, 1000)
    jest.useFakeTimers()
    setTimeout(() => {
      expect((LocalTango.storage as any).encrypt.getItemExpired(key1)).not.toEqual(value1)
    }, 1500)
    jest.runAllTimers()

    // 未过期期限
    const key2 = 'scene:timestamp2'
    const value2 = 'scene:timestamp未过期戳测试Value';
    (LocalTango.storage as any).encrypt.setItemExpired(key2, value2, 2000)
    jest.useFakeTimers()
    setTimeout(() => {
      expect((LocalTango.storage as any).encrypt.getItemExpired(key2)).toEqual(value2)
    }, 1500)
    jest.runAllTimers()
  });
})
