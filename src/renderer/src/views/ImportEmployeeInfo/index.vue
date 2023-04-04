<template>
  <div
    class="import-employee-info-page"
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-background="rgba(122, 122, 122, 0.8)"
  >
    <div style="text-align: right">
      <el-button
        type="primary"
        :disabled="!tableData.length"
        @click="handleImportData"
        >{{ $t('保存') }}</el-button
      >
      <el-button type="primary" @click="handleUpload">{{ $t('上传文件') }}</el-button>
    </div>
    <div class="table-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          v-for="item in tableHeader"
          :key="item"
          :prop="item"
          :label="item"
        />
      </el-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { addUserData } from "@/notion.js";
import useMapStore from "./useMapStore";
import { analyseExcelToJson } from "./const";
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const MapStore = useMapStore(true);
const tableHeader = ref([]);
const tableData = ref([]);

const loading = computed(() => MapStore.loading.value)

const handleUpload = () => {
  const input = document.createElement("input");

  input.type = "file";
  input.accept = ".xlsx";

  input.click();

  input.onchange = () => {
    analyseExcelToJson(input.files[0]).then((res) => {
      if (res && res.length) {
        tableHeader.value = res[0];

        tableData.value = res
          .filter((_, index) => index)
          .map((item) => {
            return item.reduce((acc, val, index) => {
              if (index) {
                acc[tableHeader.value[index]] = tableHeader.value[index] === 'No.' ? Number(val) : val;
              }

              return acc;
            }, {});
          });
      }
    });
  };
};

const handleImportData = () => {
  tableData.value.map((v) => {
    const data = Object.entries(v).reduce((acc, [key, val]) => {
      return {
        ...acc,
        ...MapStore.keyMap.get(key)(val),
      };
    }, {});

    addUserData(data).then(() => {
      ElMessage({
        message: t('数据导入成功'),
        type: 'success'
      })
    });
  });
};
</script>
<stye lang="less" scoped>
.import-employee-info-page {
  padding: 10px;
  height: 100%;
  
  .table-container {
    height: calc(100% - 40px);
    overflow-y: auto;
  }
}
</stye>
