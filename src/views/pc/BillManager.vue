<template>
  <a-layout
    style="padding: 20px 0px 0px 0px; background: #fff; margin-bottom: 0px"
  >
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '0px 0px',
        margin: 'auto',
        minHeight: '280px',
      }"
    >
      <div
        style="
          position: relative;
          border: 0px solid #e8e8e8;
          width: 598pt;
          margin: auto;
          padding: 0px;
        "
      >
        <a-button @click="bindExportExcel">导出表格</a-button>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>

export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    bindExportExcel() {
      
    },
    
  },
  mounted() {},
};
</script>

<style>
@import url("../../assets/css/manager.css");
@import url("../../assets/iconfont/iconfont.css");
</style>
