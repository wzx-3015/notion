<template>
  <div class="globale-settings-page">
    <div class="globale-settings-tabs">
      <el-tabs tab-position="left" v-model="tabsActive">
        <el-tab-pane :label="$t('通用')" name="currency">
          <el-form :model="form" label-position="top">
            <el-form-item :label="`${$t('语言')}`">
              <el-select
                v-model="form.locale"
                placeholder="请选择"
                @change="handleLocaleChange"
              >
                <el-option
                  v-for="item in languages"
                  :key="item.type"
                  :label="item.label"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { languages, setLocale, getLocale } from "@/language/index";

const tabsActive = ref('currency')
const form = reactive({ locale: getLocale() })

const handleLocaleChange = (val) => {
  setLocale(val)
  window.location.reload()
}

</script>
<style lang="less" scoped>
.globale-settings-page {
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 20px;
  :deep(.globale-settings-tabs) {
    position: absolute;
    border-radius: 6px;
    left: 50%;
    top: 50%;
    padding: 20px;
    box-sizing: border-box;
    width: 98%;
    min-height: calc(98% - 40px);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);

    .el-tabs__content {
      padding: 0 20px;
    }
  }
}
</style>
