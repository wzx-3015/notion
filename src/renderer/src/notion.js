import { Client } from '@notionhq/client'
import { ElMessage } from "element-plus";
import { getPathname } from '@/utils/index'
// 部门id
const departmentId = '007d353c70544084bf72f22e007d4a39'

// 所属id
const jobId = '72159625aae7449484dba3c9187fafe2'

const userId = 'c100ffc146b9431f8dd157932b9397ab'

export let notion = window.notion

export const getSystemConfig = () => {
  return JSON.parse(localStorage.getItem('systemConfig')) || {}
}

// 初始化Notion
export const initNotion = async auth => {
  auth = getSystemConfig().token

  if (!auth) {
    return
  }

  notion = await window.notionApi.initNotion(auth)

  return notion
}

const handleTitle = titles => {
  return titles.reduce((acc, title) => {
    acc += title.plain_text

    return acc
  }, '')
}

const findData = (list, pageId) => {
  const data = list.find(v => v.pageId === pageId) || {}

  return data.name
}

export const getUsers = async (database_id = getPathname(getSystemConfig().memberId)) => {
  database_id = getPathname(getSystemConfig().memberId)
  
  if (!database_id) {
    return Promise.reject()
  }

  return window.notionApi.databasesQuery(notion, database_id).then(({ results }) => {
    return results.map((page) => {
      const title = page.properties["名前"].title

      return {
        pageId: page.id,
        name: title.length ? handleTitle(title) : '',
      };
    });
  }).catch(error => {
    ElMessage.error(error.message)
    return error
  })
}

// 获取用户人员列表
export const getUserList = async (database_id = getPathname(getSystemConfig().memberId)) => {
  
  database_id = getPathname(getSystemConfig().memberId)
  if (!database_id) {
    return Promise.reject()
  }

  const departmentList =  await getDepartmentList()
  const jobList = await getJobList()

  return window.notionApi.databasesQuery(notion, database_id).then(({ results }) => {
    return results.map((page) => {
      const title = page.properties["名前"].title
      const relation = page.properties["部門"].relation
      const jobRelation = page.properties["チーム"].relation

      return {
        pageId: page.id,
        name: title.length ? handleTitle(title) : '',
        no: page.properties["No."].number,
        departmentId: relation.length ? relation[0].id : '',
        jobId: jobRelation.length ? jobRelation[0].id : '',
        department: relation.length ? findData(departmentList, relation[0].id) : '',
        job: jobRelation.length ? findData(jobList, jobRelation[0].id) : '',
      };
    });
  }).catch(error => {
    ElMessage.error(error.message)
    return error
  })
}

// 获取部门列表
export const getDepartmentList = (database_id = departmentId) => {
  return window.notionApi.databasesQuery(notion, database_id).then(({ results }) => {
    return results.map(page => {
      const title = page.properties[""].title
      return {
        pageId: page.id,
        name: title.length ? handleTitle(title) : '',
      }
    })
  }).catch(error => {
    ElMessage.error(error.message)
    return error
  })
}

// 获取所属列表
export const getJobList = async (database_id = jobId) => {
  return window.notionApi.databasesQuery(notion, database_id).then(({ results }) => {
    return results.map(page => {
      const title = page.properties['Name'].title
      return {
        pageId: page.id,
        name: title.length ? handleTitle(title) : '',
      }
    })
  }).catch(error => {
    ElMessage.error(error.message)
    return error
  })
}

// 保存数据
export const addUserData = async (properties, database_id = getPathname(getSystemConfig().memberId)) => {
  database_id = getPathname(getSystemConfig().memberId)
  if (!database_id) {
    return Promise.reject()
  }

  return window.notionApi.createData(notion, {
    parent: {
      database_id
    },
    properties,
  }).catch(error => {
    ElMessage.error(error.message)
    return error
  })
}

// 获取notion 用户列表
export const getNotionUserList = async () => {
  const list = await window.notionApi.getNotionUserList(notion).catch(error => {
    ElMessage.error(error.message)
    return error
  })

  return list.results
}

// 查找用户当天是否已经签到
export const getLogList = async (filter = undefined, database_id = getPathname(getSystemConfig().signInId)) => {
  const res = await window.notionApi.databasesQuery(notion, database_id, { filter }).catch(error => {
    ElMessage.error(error.message)
    return error
  })
  return res.results
}

// 签到
export const sigInLog = async (properties, database_id = getPathname(getSystemConfig().signInId)) => {
  database_id = getPathname(getSystemConfig().signInId)
  if (!database_id) {
    return Promise.reject()
  }

  return window.notionApi.createData(notion, {
    parent: {
      database_id
    },
    properties
  }).catch(error => {
    ElMessage.error(error.message)
    return error
  })
}

// 更新数据
export const updateSigInLog = async (properties, pageId) => {
  if (!pageId) {
    return Promise.reject()
  }

  return window.notionApi.updateData(notion, {
    page_id: pageId,
    properties
  }).catch(error => {
    ElMessage.error(error.message)
    return error
  })
}
