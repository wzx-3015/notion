<template>
  <div class="global-lay-out">
    <el-tabs
      class="tabs-container"
      :modelValue="rootStore.menuTagActive"
      type="card"
      @tab-remove="handleRemoveTab"
      @tab-click="handleGoRoute"
    >
      <el-tab-pane
        class="car-item"
        v-for="(item, index) in rootStore.menuTags"
        :closable="item.name !== 'workbenches'"
        :key="item.label"
        :label="$t(item.label)"
        :name="item.name"
      />
    </el-tabs>
    <div class="global-main">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
import { useRootStore } from "@/stores/root";
import { useRouter } from "vue-router";

const router = useRouter();

const rootStore = useRootStore();

const handleGoRoute = ({ paneName, active }) => {
  if (!active) {
    router.push({ name: paneName });
  }
};

const handleRemoveTab = name => {
  const nextRouteName = rootStore.removeMenuTag(name);

  router.push({ name: nextRouteName });
};

</script>
<style lang="less" scoped>
.global-lay-out {
  height: 100vh;
  width: 100vw;

  :deep(.tabs-container) {
    height: 40px;
    user-select: none;
    // -webkit-app-region: drag;

    .el-tabs__item {
      // -webkit-app-region: no-drag;
      &.is-active,
      &:hover {
        background: var(--primary-color);
        color: #fff;
        .is-icon-close {
          font-size: 14px;
          width: 16px !important;
          height: 16px;
        }
      }
    }
  }

  .global-main {
    height: calc(100vh - 40px);
    background-color: #fff;
  }
}
</style>
