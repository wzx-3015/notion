<template>
  <div class="sign-in-page" v-loading="loading"
    element-loading-text="Loading..."
    element-loading-background="rgba(122, 122, 122, 0.8)">
    <div class="sign-in-operate">
      <el-button type="info" @click="handleClockSettings">{{ $t('打卡设置') }}</el-button>
    </div>
    <div class="main">
      <el-form label-position="top" :rules="rules" ref="ruleForm" label-width="100px" :model="formLabelAlign">
        <el-form-item :label="$t('员工编号')" prop="personnelNo">
          <el-select
            style="width: 100%"
            v-model="formLabelAlign.personnelNo"
            filterable
            @change="handlePersonnelNoChange"
            placeholder="Select"
          >
            <el-option
              v-for="(item, index) in employeeOptions"
              :key="item.pageId + index"
              :label="item.no"
              :value="item.no"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('工作场所')" prop="workplace">
          <el-select
            style="width: 100%"
            v-model="formLabelAlign.workplace"
            filterable
            placeholder="Select"
          >
            <el-option
              v-for="(item, index) in workplaceOptions"
              :key="item + index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('出勤类型')" prop="attendanceType">
          <el-select
            style="width: 100%"
            v-model="formLabelAlign.attendanceType"
            filterable
            placeholder="Select"
          >
            <el-option
              v-for="(item, index) in attendanceTypeOptions"
              :key="item + index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('出勤时间')" prop="startTime">
          <el-date-picker
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%"
            :clearable="false"
            :disabled="!formLabelAlign.startTime"
            v-model="formLabelAlign.startTime"
            type="datetime"
            placeholder="Select date and time"
          />
        </el-form-item>
        <el-form-item :label="$t('终止时间')" prop="endTime">
          <el-date-picker
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%"
            :disabled="!formLabelAlign.endTime"
            v-model="formLabelAlign.endTime"
            :clearable="false"
            type="datetime"
            placeholder="Select date and time"
          />
        </el-form-item>
        <el-form-item :label="$t('休息时间')" prop="restTime">
          <el-input type="number" v-model="formLabelAlign.restTime" placeholder="Please input">
            <template #append>h</template>
          </el-input>
        </el-form-item>
      </el-form>

      <div class="operate-btn">
        <el-row>
          <el-col :span="8" v-if="isSignIn">
            <el-button type="primary" @click="handleSignIn">{{ $t('签到') }}</el-button>
          </el-col>
          <el-col :span="8" :offset="8" v-if="!isSignIn">
            <el-button type="success" @click="handleSignIn">{{ $t('下班打卡') }}</el-button>
          </el-col>
        </el-row>

      </div>
    </div>

    <div class="basic-info">
      <el-avatar
        :size="50"
        :src="avatarSrc"
      />
      <el-form
        label-position="top"
        disabled
        label-width="80px"
        :model="formLabelAlign"
      >
        <el-form-item :label="$t('员工部门')" prop="department">
          <el-input v-model="formLabelAlign.department" placeholder="Please input" />
        </el-form-item>
        <el-form-item :label="$t('姓名')" prop="name">
          <el-input v-model="formLabelAlign.name" placeholder="Please input" />
        </el-form-item>
        <el-form-item :label="$t('员工所属')" prop="No">
          <el-input v-model="formLabelAlign.job" placeholder="Please input" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getUserList, getLogList, sigInLog, updateSigInLog } from "@/notion";
import { ref, reactive } from "vue";
import { keyMap } from "./const";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ElMessage } from "element-plus";
import { useI18n } from 'vue-i18n'
import { useRouter } from "vue-router";
import { attendanceTypeOptions, workplaceOptions } from "@/const";

dayjs.extend(timezone)
dayjs.extend(utc)
const Router = useRouter()
const { t } = useI18n()
const avatarSrc = new URL('./image/3ea6beec64369c2642b92c6726f1epng.png', import.meta.url).href
// const attendanceTypeOptions = getAttendanceTypeOptions()
// const workplaceOptions = getWorkplaceOptions()
const employeeOptions = ref([]);

const ruleForm = ref(null)

const loading = ref(true)

const formLabelAlign = reactive({
  useId: '',
  name: "",
  personnelNo: '',
  workplace: '', // 工作场所
  attendanceType: '', // 出勤类型
  type: "",
  department: "",
  job: "",
  startTime: '', // 出勤时间
  endTime: '', // 终止时间
  restTime: 0, // 休息时间
  laborHours: 0, // 劳动时间
  overtime: 0, // 加班时间
});

let pageId = ''

const isSignIn = ref(true)

const rules = {
  personnelNo: [
    { required: true, message: `select ${t('员工编号')}`, trigger: 'change' },
  ],
  workplace: [
    { required: true, message: `select ${t('工作场所')}`, trigger: 'change' },
  ],
  attendanceType: [
    { required: true, message: `select ${t('出勤类型')}`, trigger: 'change' },
  ],
}

getUserList().then(res => {
  loading.value = false
  employeeOptions.value = res;
});

getLogList()

const handlePersonnelNoChange = val => {
  const findData = employeeOptions.value.find(v => v.no === val) || {}

  formLabelAlign.job = findData.job
  formLabelAlign.department = findData.department
  formLabelAlign.name = findData.name
  formLabelAlign.useId = findData.pageId

  // 判断当前人员当天时间是否已经签到
  if (findData.name) {
    const date = dayjs().format('YYYY-MM-DD')
    getLogList({
      "and": [
        {
          property: "出勤時間",
          date: {
            equals: date
          },
        },
        {
          property: "Member",
          relation: {
            contains: findData.pageId
          }
        }
      ]
    }).then(res => {
      if (res && res.length) {
        const { start, end } = res[0].properties['出勤時間'].date

        if (start && !end) {
          isSignIn.value = false
          formLabelAlign.workplace = res[0].properties['作業場所'].select.name
          formLabelAlign.attendanceType = res[0].properties['出勤区分'].select.name
          // 下班签到
          pageId = res[0].id
          formLabelAlign.startTime = dayjs(start).utc().format('YYYY-MM-DD HH:mm:ss')
          formLabelAlign.endTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
        } else if (end) {
          ElMessage(`${findData.name} ${date}Signed in`)
        }
      } else {
        // 首次签到
        isSignIn.value = true
        formLabelAlign.workplace = ''
        formLabelAlign.attendanceType = ''
        formLabelAlign.startTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
        formLabelAlign.endTime = ''
        pageId = ''
      }
    })
  }
}

const handleClockSettings = () => {
  Router.push({ name: 'clockSettings' })
}

const handleSignIn = () => {
  ruleForm.value.validate(valid => {
    if (valid) {
      // $t_{劳动时间}= T_{终止时间}-T_{出勤时间}-t_{休息时间}$）（-小时-分）
      const laborHoursNumber = dayjs(formLabelAlign.endTime).diff(formLabelAlign.startTime, 'hour', true) - formLabelAlign.restTime

      formLabelAlign.overtime = laborHoursNumber - 8
      formLabelAlign.laborHours = laborHoursNumber
    
      const params = Object.keys(formLabelAlign).reduce((params, key) => {
        if (key === 'startTime') {
          return {
            ...params,
            ...keyMap.get('startTime')(formLabelAlign.startTime, formLabelAlign.endTime)
          }
        }
        return keyMap.get(key) ? {
          ...params,
          ...keyMap.get(key)(formLabelAlign[key])
        } : params
      }, {...keyMap.get('log')()})

      loading.value = true

      if (pageId) {
        updateSigInLog(params, pageId).then(() => {
          loading.value = false
          ElMessage({
            message: `${t('签到')} successfully`,
            type: 'success'
          })
        }).catch(() => (loading.value = false))
      } else {
        sigInLog(params).then(() => {
          loading.value = false
          ElMessage({
            message: `${t('签到')} successfully`,
            type: 'success'
          })
          ruleForm.value.resetField()
        }).catch(() => (loading.value = false))
      }
    }
  })
}

</script>
<style lang="less" scoped>
.sign-in-page {
  height: 100%;
  position: relative;

  .sign-in-operate{
    padding: 20px;
    text-align: right;
  }

  :deep(.main) {
    position: absolute;
    left: 46%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 56%;

    .title {
      margin-bottom: 40px;
      text-align: center;
    }

    .el-form-item__label {
      font-size: 14px;
      color: #999999;
    }

    .el-input__wrapper,
    .el-input {
      box-shadow: none;
      border-bottom: 1px solid #ebf3fb;
      position: relative;
      transition: all 0.4s;

      &::after {
        position: absolute;
        content: "";
        width: 0;
        height: 1px;
        background-color: var(--primary-color);
        bottom: 0;
        left: 0;
        z-index: 1;
        transition: all 0.4s;
      }

      &.is-focus {
        &::after {
          width: 100%;
        }

        border-color: transparent;
      }
    }

    .operate-btn {
      text-align: center;

      .el-button {
        padding: 8px 24px;
      }
    }
  }

  :deep(.basic-info) {
    width: 200px;
    background: #ffffff;
    box-shadow: 2px 2px 4px 0px rgba(235, 235, 235, 0.5),
      inset 2px 1px 3px 0px rgba(242, 242, 242, 0.5);
    position: absolute;
    right: 40px;
    top: 50%;
    text-align: center;
    transform: translateY(-50%);
    padding: 25px 20px;

    .el-avatar {
      margin-bottom: 20px;
    }

    .el-form-item__label {
      font-size: 14px;
      color: #999999;
    }

    .el-input__wrapper,
    .el-input {
      box-shadow: none;
      border-bottom: 1px solid #ebf3fb;
      position: relative;
      transition: all 0.4s;
      background-color: transparent !important;

      &::after {
        position: absolute;
        content: "";
        width: 0;
        height: 1px;
        background-color: var(--primary-color);
        bottom: 0;
        left: 0;
        z-index: 1;
        transition: all 0.4s;
      }

      &.is-focus {
        &::after {
          width: 100%;
        }

        border-color: transparent;
      }
    }
  }
}
</style>
