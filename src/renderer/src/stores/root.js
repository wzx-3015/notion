import { defineStore } from 'pinia';
import { ref, computed, watch, markRaw } from 'vue'
import { useRoute } from 'vue-router';
import { isArray, isObject } from 'lodash-es'
import { Checked, Tickets, Tools } from "@element-plus/icons-vue";

export const useRootStore = defineStore('app', () => {
  const Route = useRoute()

  const menus = markRaw([
    {
      label: '快速签到',
      icon: Checked,
      name: 'signIn',
      desc: '上班快速打卡'
    },
    {
      label: '导入员工信息',
      icon: Tickets,
      name: 'ImportEmployeeInfo',
      desc: '将员工信息以Excel导入'
    },
    {
      label: 'notion配置',
      icon: Tools,
      name: 'systemConfig',
      desc: '访问token和一些地址'
    },
  ]);

  const defaultMenuTags = [
    { 
      name: 'workbenches',
      label: '工作台'
    }
  ]

  const menuTags = ref(JSON.parse(localStorage.getItem('menuTags')) || defaultMenuTags)

  const menuTagActive = computed(() => {
    const tabs = Route.meta.tabs

    if (tabs === false) {
      return Route.meta.parent?.name || Route.name
    } else {
      return Route.name
    }
  })

  const setMenuTag = tag => {
    if (isArray(tag)) {
      menuTags.value = tag
    } else if (isObject(tag)) {
      const findTag = menuTags.value.find(v => v.name === tag.name)
  
      if (findTag) {
        return
      }
  
      menuTags.value.push(tag)
    }

    localStorage.setItem('menuTags', JSON.stringify(menuTags.value))
  }

  watch(() => Route.name, (RouteName) => {
    const tabs = Route.meta.tabs
    if (tabs === undefined || tabs === true) {
      setMenuTag({
        label: Route.meta?.title,
        name: RouteName,
      })
    }
   }, { immediate: false })

  // 删除标签 返回 下一个路由
  const removeMenuTag = name => {
    const index = menuTags.value.findIndex(v => v.name === name)
    
    const tags = menuTags.value.filter((_, i) => i !== index)
    
    setMenuTag(tags)
    if (menuTagActive.value !== name) {
      return menuTagActive.value
    }
    
    if (tags.length === 1) {
      return tags[0].name
    } else if (index >= tags.length) {
      return tags[tags.length - 1].name
    } else {
      tags[index].name
    }

  }

  return {
    menuTags,
    menus,
    menuTagActive,
    removeMenuTag,
    setMenuTag
  }
})
  