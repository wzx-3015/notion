<template>
  <div class="clock-settings-page">
    <el-breadcrumb>
      <el-breadcrumb-item
        v-for="item in breadcrumb"
        :key="item.name"
        v-bind="{ to: item.name ? { name: item.name } : null }"
        :to="{ name: item.name }"
        >{{ $t(item.title) }}</el-breadcrumb-item
      >
    </el-breadcrumb>

    <div class="clock-settings-tabs">
      <el-tabs tab-position="left" v-model="tabsActive" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('工作场所')" name="workplace">
          <div class="tab-pane-main">
            <div class="tab-pane-add-btn">
              <el-button type="primary" @click="handleAdd">{{ $t('添加') }}</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column prop="title" label="title" align="center" />
              <el-table-column :label="$t('操作')" align="center">
                <template #default="scope">
                  <el-button type="danger" @click="handleRemove(scope)" link>{{$t("删除")}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('出勤类型')" name="attendanceType">
          <div class="tab-pane-main">
            <div class="tab-pane-add-btn">
              <el-button type="primary" @click="handleAdd">{{ $t('添加') }}</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column prop="title" label="title" align="center" />
              <el-table-column :label="$t('操作')" align="center">
                <template #default>
                  <el-button type="danger" @click="handleRemove" link>{{$t("删除")}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>


    <el-dialog
      v-model="centerDialogVisible"
      :title="$t('添加')"
      width="30%"
      align-center
    >
      <div>
        <el-input v-model="form.title" placeholder="Please input" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { workplaceOptions, attendanceTypeOptions, setWorkplaceOptions, setAttendanceTypeOptions } from "@/const";

const Route = useRoute();
const breadcrumb = computed(() => {
  return [
    Route.meta.parent,
    {
      title: Route.meta.title,
    },
  ];
});

const tabsActive = ref('workplace')
const centerDialogVisible = ref(false)
const form = reactive({ title: '' })

const tabsList = {
  'workplace': {
    list: workplaceOptions,
    updateData: setWorkplaceOptions
  },
  'attendanceType': {
    list: attendanceTypeOptions,
    updateData: setAttendanceTypeOptions
  },
}

const tableData = ref([])

const handleTabClick = (tab) => {
  tableData.value = tabsList[tab.paneName].list.map(v => ({ title: v}))
}

handleTabClick({ paneName: tabsActive.value })

const handleRemove = (scope) => {
  tableData.value.splice(scope.$index, 1)
  tabsList[tabsActive.value].updateData(tableData.value.map(v => v.title))
}

const handleConfirm = () => {
  tableData.value.push({ title: form.title })
  tabsList[tabsActive.value].updateData(tableData.value.map(v => v.title))
  centerDialogVisible.value = false
}

const handleAdd = () => {
  form.title = ''
  centerDialogVisible.value = true
}
</script>
<style lang="less" scoped>
.clock-settings-page {
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 20px;
  .clock-settings-tabs {
    position: absolute;
    border-radius: 6px;
    left: 50%;
    top: 50%;
    padding: 20px;
    box-sizing: border-box;
    width: 98%;
    min-height: calc(96% - 40px);
    transform: translate(-50%, -48%);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);

    .tab-pane-main {
      padding: 0 20px;

      .tab-pane-add-btn {
        text-align: right;
        padding: 10px 0;
      }
    }
  }
}
</style>
