<template>
  <div class="system-config-page">
    <div class="main">
      <h2 class="title">{{ $t("访问token和一些地址") }}</h2>
      <el-form
        label-position="top"
        label-width="100px"
        ref="formRef"
        :model="formLabelAlign"
        status-icon
        :rules="rules"
      >
        <el-form-item label="Token:" prop="token">
          <el-input
            oncopy="return false"
            v-model="formLabelAlign.token"
            type="password"
            placeholder="请输入Token"
          />
        </el-form-item>
        <el-form-item :label="`${$t('导入成员地址')}：`" prop="memberId">
          <el-input
            @blur="handleInputBlur('memberId')"
            v-model="formLabelAlign.memberId"
            :placeholder="$t('导入成员地址')"
          >
            <template #prepend>https://</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('快速签到地址')}：`" prop="signInId">
          <el-input
            @blur="handleInputBlur('signInId')"
            v-model="formLabelAlign.signInId"
            :placeholder="$t('快速签到地址')"
          >
            <template #prepend>https://</template>
          </el-input>
        </el-form-item>
      </el-form>

      <div class="operate-btn">
        <el-button type="primary" @click="handleSaveConfig">{{
          $t("保存")
        }}</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { getPathname } from "@/utils/index";

import { useI18n } from "vue-i18n";
import { initNotion } from "@/notion";

const { t } = useI18n();
const formRef = ref(null);

const defaultConfig = {
  ...{ token: "", memberId: "", signInId: "" },
  ...JSON.parse(localStorage.getItem("systemConfig") || "{}")
}

const formLabelAlign = reactive({ ...defaultConfig });

const rules = {
  token: [
    { required: true, message: "Please input token", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        window.notionApi.initNotion(value)
        .then(() => {
          callback();
        })
        .catch(err => {
          callback(err.message);
        })
      },
      trigger: "blur",
    },
  ],
  memberId: [
    {
      required: true,
      message: `Please input ${t("导入成员地址")}`,
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        window.notionApi.initNotion(formLabelAlign.token).then(notionClient => {
          window.notionApi.databasesQuery(notionClient, getPathname(value)).then(() => {
            callback();
          }).catch(error => {
            callback(error.message);
          })
        }).catch(err => {
          callback(err.message);
        })
      },
      trigger: "blur",
    },
  ],
  signInId: [
    {
      required: true,
      message: `Please input ${t("快速签到地址")}`,
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        window.notionApi.initNotion(formLabelAlign.token).then(notionClient => {
          window.notionApi.databasesQuery(notionClient, getPathname(value)).then(() => {
            callback();
          }).catch(error => {
            callback(error.message);
          })
        }).catch(err => {
          callback(err.message);
        })
      },
      trigger: "blur",
    },
  ],
};

const handleSaveConfig = async () => {
  formRef.value.validate(valid => {
    if (valid) {
      localStorage.setItem("systemConfig", JSON.stringify(formLabelAlign));
      initNotion(formLabelAlign.token)
      ElMessage({
        message: "Configuration saved successfully",
        type: "success",
      });
    }
  });
};

const handleInputBlur = (key) => {
  if (formLabelAlign[key].startsWith("https://")) {
    formLabelAlign[key] = formLabelAlign[key].replace("https://", "");
  }
};

</script>
<style lang="less" scoped>
.system-config-page {
  height: 100%;
  position: relative;
  :deep(.main) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 70%;

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
}
</style>
