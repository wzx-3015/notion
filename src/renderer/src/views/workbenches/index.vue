<template>
  <div class="workbenches-page">
    <div class="workbenches-main">
      <div
        class="workbenches-item"
        v-for="item in rootStore.menus"
        :key="item.name"
        @click="handleGoRoute(item)"
      >
        <div class="icon-left">
          <el-icon size="18">
            <component :is="item.icon" />
          </el-icon>
        </div>
        <div class="title">
          <p>{{ $t(item.label) }}</p>
          <p>{{ $t(item.desc) }}</p>
        </div>

        <div class="icon-right">
          <el-icon size="18"><Right /></el-icon>
        </div>
      </div>
    </div>

    <div class="globale-setting">
      <el-icon size="20" @click="handleGoGlobaleSetting"><Setting /></el-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Right, Setting } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useRootStore } from "@/stores/root";
const Router = useRouter();

const rootStore = useRootStore();

const handleGoRoute = item => {
  Router.push({ name: item.name });
};

const handleGoGlobaleSetting = () => {
  Router.push({ name: 'GlobaleSetting' });
}
</script>
<style lang="less" scoped>
.workbenches-page {
  height: 100%;
  position: relative;

  .globale-setting {
    position: absolute;
    right: 20px;
    top: 20px;
    .el-icon {
      cursor: pointer;
    }
  }

  .workbenches-main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .workbenches-item {
    width: 418px;
    height: 76px;
    background: rgba(255, 255, 255, 0.09);
    border-radius: 11px;
    border: 1px solid rgba(33, 128, 211, 0.12);
    cursor: pointer;
    display: flex;
    align-items: center;
    color: var(--primary-color);
    font-family: PingFangSC-Medium, PingFang SC;
    margin-bottom: 16px;
    transition: all 0.5s;

    .icon-left {
      width: 46px;
      text-align: center;
      position: relative;

      &::after {
        position: absolute;
        content: "";
        right: 0;
        width: 1px;
        height: 30px;
        background: #d3e6f8;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .title {
      padding-left: 19px;
      flex-grow: 1;
      color: inherit;

      p:nth-child(1) {
        font-weight: 500;
      }
      p:nth-child(2) {
        font-size: 12px;
        margin-top: 4px;
      }
    }

    .icon-right {
      width: 40px;
    }
  }

  .workbenches-item:last-child {
    margin-bottom: 0;
  }

  .workbenches-item.active,
  .workbenches-item:hover {
    color: #fff;
    background-color: var(--primary-color);
  }

  .workbenches-item:not(.active):active {
    opacity: 0.8;
  }
}
</style>
