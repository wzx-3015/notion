import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Client } from '@notionhq/client'
import Store from 'electron-store'
import log from 'electron-log'

const store = new Store()

// Custom APIs for renderer
const api = {}

let notion = null

ipcRenderer.on('setLanguage', (_, value) => {
  store.set('Language', value)
})

const getSystemToken = () => {
  return (JSON.parse(localStorage.getItem('systemConfig')) || {}).token
}

export const notionApi = {
  initNotion: async (token) => {
    const notion = new Client({
      auth: token
    });

    await notion.users.list()

    return notion
  },
  // 获取notion用户列表
  getNotionUserList: (notion) =>  {
    return notion.users.list()
  },
  // 查表
  databasesQuery: (notion, databaseId, params = {}) => {
    return notion.databases.query({
      database_id: databaseId,
      ...params,
    });
  },
  createData: (notion, data) => {
    return notion.pages.create(data)
  },
  updateData: (notion, data) => {
    return notion.pages.update(data)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
const token = getSystemToken()
if (token) {
  notion = new Client({ auth: token });
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('notionApi', notionApi)
    contextBridge.exposeInMainWorld('notion', notion)
    contextBridge.exposeInMainWorld('EStore', store)
  } catch (error) {
    console.error(error)
    log.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
  window.notion = notion
  window.notionApi = notionApi
  window.EStore = store
}
