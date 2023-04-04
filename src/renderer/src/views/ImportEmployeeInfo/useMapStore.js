import { getDepartmentList, getJobList, getUsers, getNotionUserList } from "@/notion.js";
import dayjs from "dayjs";
import { ref } from "vue";

const useMapStore = status => {
  let departmentList = [];
  // 所属列表
  let jobList = [];
  let userList = [];
  let NotionUserList = []

  const loading = ref(true)

  Promise.all([
    getDepartmentList().then((res) => (departmentList = res)),
    getJobList().then((res) => (jobList = res)),
    getUsers().then((res) => (userList = res)),
    getNotionUserList(res => (NotionUserList = res)),
  ]).then(() => {
    loading.value = false
  })

  const keyMap = new Map([
    [
      "Name",
      (content) => {
        return {
          "名前": {
            title: [
              {
                text: { content: content, link: null },
                plain_text: content,
              },
            ],
          },
        };
      },
    ],
    [
      "No.",
      (number) => {
        return {
          "No.": {
            number: Number(number),
          },
        };
      },
    ],
    [
      "Dept.",
      (name) => {
        const findData = departmentList.find((v) => v.name === name)
        return findData ? {
          "部門": {
            relation: [{ id: findData.pageId }],
          },
        } :  ''
      },
    ],
    [
      "Team",
      (name) => {
        const findData = jobList.find((v) => v.name === name)
  
        return findData ? {
          "チーム": {
            relation: [{ id: findData.pageId }],
          },
        } : ''
      },
    ],
    [
      "Supervisor",
      (val) => {
        return {
          "スーパーバイザー": {
            checkbox: val === "Y",
          },
        };
      },
    ],
    [
      "Leader",
      (name) => {
        const findData = NotionUserList.find((v) => v.name === name)
        return findData ? {
          "担当者": {
            people: [
              {
                ...findData
              },
            ],
          },
        } : ''
      },
    ],
    [
      "Type",
      (name) => {
        return {
          "雇用形態": {
            select: {
              name,
            },
          },
        };
      },
    ],
    [
      "hiredate",
      (time) => {
        return {
        "入社日": {
            date: {
              start: dayjs(time).format("YYYY-MM-DD"),
            },
          },
        };
      },
    ],
    [
      "E-mail",
      (email) => {
        return {
          "メール": {
            email,
          },
        };
      },
    ],
    [
      "Tel.",
      (phone_number) => {
        return {
          "電話": {
            phone_number,
          },
        };
      },
    ],
  ]);

  return {
    keyMap,
    loading
  }
}

export default useMapStore
