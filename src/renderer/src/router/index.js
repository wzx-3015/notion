import { createRouter, createWebHashHistory } from 'vue-router'
import workbenches from '@/views/workbenches/index.vue'
import GlobalLayOut from '@/layout/GlobalLayOut.vue'
import { ElMessage } from "element-plus";
import { notion } from '@/notion'


// meta: {
//   parent: { // 父级参数
//     name: 'signIn', // 路由名称
//     title: '快速签到' // 标题  匹配翻译字库
//   },
//   tabs: false, // 是否开启tabs 卡片展示 默认值为true
//   auth: true, // 是否开启校验（开启会notion未初始化无法进入）
//   title: '打卡设置' // tabs 标题  匹配翻译字库
// }

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'GlobalLayOut',
      component: GlobalLayOut,
      redirect: { name: 'workbenches' },
      children: [
        {
          path: 'workbenches',
          name: 'workbenches',
          component: workbenches,
          meta: {
            title: '工作区'
          }
        },
        {
          path: 'sign-in',
          name: 'signIn',
          component: () => import('@/views/signIn/index.vue'),
          meta: {
            title: '快速签到',
            auth: true
          }
        },
        {
          path: 'clock-settings',
          name: 'clockSettings',
          component: () => import('@/views/clockSettings/index.vue'),
          meta: {
            parent: {
              name: 'signIn',
              title: '快速签到'
            },
            tabs: false,
            auth: true,
            title: '打卡设置'
          }
        },
        {
          path: 'system-config',
          name: 'systemConfig',
          component: () => import('@/views/systemConfig/index.vue'),
          meta: {
            title: 'notion配置'
          }
        },
        {
          path: 'employee-info',
          name: 'ImportEmployeeInfo',
          component: () => import('@/views/ImportEmployeeInfo/index.vue'),
          meta: {
            auth: true,
            title: '导入员工信息'
          }
        },
        {
          path: 'globale-setting',
          name: 'GlobaleSetting',
          component: () => import('@/views/GlobaleSetting/index.vue'),
          meta: {
            title: '工作台设置'
          }
        },
      ]
    },
  ]
})


router.beforeEach(async to => {
  if (to.meta.auth) {
    if (notion) {
      return true
    } else {
      ElMessage('Please set the note configuration first')
      return { name: 'systemConfig' }
    }
  } else {
    return true
  }
})

export default router
