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
import XLSX from "xlsx";
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    bindExportExcel() {
      let arr = [
        ["标题1", "标题2", "标题3"],
        ["1", "2", "3"],
        ["4", "5", "6"],
        [7, 8, 9],
      ];
      this.exportExcel(arr, "exp");
    },
    exportExcel(exportArray, filename = "导出表格") {
      let tSheet = XLSX.utils.aoa_to_sheet(exportArray);  
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, tSheet, "Sheet1");
      XLSX.writeFile(wb, filename + ".xls", {cellStyles: true});
    },
  },
  mounted() {},
};
</script>

<style>
@import url("../../assets/css/manager.css");
@import url("../../assets/iconfont/iconfont.css");
</style>
