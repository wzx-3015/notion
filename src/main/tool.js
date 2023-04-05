import fs from 'fs'
import log from 'electron-log'

// 判断系统类型
export const getSystem = () => {
  //这是mac系统
  if (process.platform == "darwin") {
    return 1;
  }
  //这是windows系统
  if (process.platform == "win32") {
    return 2;
  }
  //这是linux系统
  if (process.platform == "linux") {
    return 3;
  }
}


/**
 *
 * @returns 获取语言配置文件路径
 */
export const getConfigPath = path => {
  if (getSystem() === 1) {
    return path + "/Language.json";
  } else {
    return path + "\\Language.json";
  }
}


/**
 * 读取配置文件
 */
export const readConfig = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        log.error(error)
        reject(error)
        return
      }

      try {
        if (data) {
          //有值
          const config = JSON.parse(data);
          resolve(config)
        } else {
          log.error(`readFile ${path} 文件为空`)
        }
      } catch (error) {
        log.error(error)
        reject(error)
      }
    });
  })
}
