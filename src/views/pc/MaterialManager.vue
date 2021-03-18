<template>
  <a-layout
    style="padding: 20px 16px 0px 16px; background: #fff; margin-bottom: 18px"
  >
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '0px 0px',
        margin: 0,
        minHeight: '280px',
      }"
    >
      <div style="position: relative">
        <div
          class="data-table-head"
          style="height: auto; line-height: 45px; padding-bottom: 10px"
        >
          <div class="opt-head-part">
            <span style="margin-left: 16px">机型：</span>
            <a-select
              style="width: 240px"
              default-value=""
              @change="onDeviceTypeChange"
            >
              <a-select-option value="">请选择</a-select-option>
              <a-select-option
                v-for="(item, index) in deviceTypeSelectArr"
                :key="index"
                :value="item"
              >
                {{ item }}
              </a-select-option>
            </a-select>
            <span style="margin-left: 16px">公司：</span>
            <a-select
              style="width: 240px"
              default-value=""
              @change="onCompanyChange"
            >
              <a-select-option value="">请选择</a-select-option>
              <a-select-option
                v-for="(item, index) in companySelectArr"
                :key="index"
                :value="item.company_id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>

            <span style="margin-left: 16px">机号：</span>
            <a-input
              allow-clear
              v-model="searchSN"
              style="width: 240px"
            ></a-input>
            <a-cascader
              :options="materialOptions"
              placeholder="Please select"
              style="width: 240px;"
            />
            <a-button
              type="primary"
              icon="search"
              style="margin-left: 12px"
              @click="reqData"
              >查询</a-button
            >
          </div>
        </div>

        <a-table
          style="overflow: auto"
          :columns="columns"
          :data-source="data"
          :pagination="pagination"
        >
          <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
            {{ record.remarks }}
          </p>
        </a-table>
        <a-pagination
          show-size-changer
          style="margin-top: 24px; margin-bottom: 20px"
          :page-size-options="pageSizeOptions"
          :page-size="Number(reqParam.per_page_max_record_count)"
          @change="onPageChange"
          @showSizeChange="onShowSizeChange"
          v-model="current"
          :total="total"
          :show-total="(total) => `共有${total}条数据`"
          show-less-items
        >
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
import moment from "moment";
import DeveCodeCommon from "../js/DeveCodeCommon";
import materialsTypes from "../json/materials-type.json";
let columns = [
  {
    title: "序号",
    dataIndex: "order",
  },
  {
    title: "物料编号",
    dataIndex: "materials_order",
  },
  {
    title: "原名称",
    dataIndex: "origin_name",
  },
  {
    title: "最新名称",
    dataIndex: "newest_name",
  },
  {
    title: "供应商型号",
    dataIndex: "supplier_type",
  },
  {
    title: "最新型号",
    dataIndex: "supplier_newest_type",
  },
  {
    title: "所属机型",
    dataIndex: "belong_type",
  },
  {
    title: "物料全名",
    dataIndex: "material_fullname",
  },
];

export default {
  extends: DeveCodeCommon,
  data() {
    return {
      materialOptions: materialsTypes,
      data: [],
      columns,
      dateRange: [],
      reqParam: {
        page_num: "1",
        per_page_max_record_count: "10",
      },
      pagination: false,
      pageSizeOptions: ["10", "20", "50", "100"],
      tableStyle: {
        maxHeight: Math.floor(document.body.clientHeight - 250) + "px",
      },
      tableScroll: {
        y: Math.floor(document.body.clientHeight - 320),
      },
      total: 0, //记录总条数
      current: 1, //分页的当前页码
      searchSN: "", //搜索机号
      pageSize: 10,
    };
  },
  methods: {
    onDateChange(moment, dates) {
      this.reqParam.beg_time = dates[0] ? dates[0] + " 00:00:00" : "";
      this.reqParam.end_time = dates[1] ? dates[1] + " 23:59:59" : "";
    },
    onCompanyChange(val) {
      this.reqParam.company_id = val;
    },
    onDeviceTypeChange(val) {
      this.reqParam.device_type = val;
    },

    onPageChange(pageIndex) {
      this.current = pageIndex;
      this.reqParam.page_num = pageIndex.toString();
      this.reqDevices();
    },

    onShowSizeChange(current, size) {
      this.reqParam.page_num = "1";
      this.reqParam.per_page_max_record_count = size.toString();
      this.reqDevices();
    },
    getReqParam(action) {
      const self = this;
      let param = new Object();
      param.action = action;
      param.beg_time = self.reqParam.beg_time;
      param.end_time = self.reqParam.end_time;
      param.device_type = self.reqParam.device_type;
      param.company_id = self.reqParam.company_id;
      param.page_num = self.reqParam.page_num;
      param.per_page_max_record_count = self.reqParam.per_page_max_record_count;
      if (self.searchSN) {
        param.sn = [self.searchSN];
      }
      return param;
    },
    //查询记录总条数
    reqDataTotalCount(callback) {
      const self = this;
      this.reqParam.page_num = "1";
      this.current = 1;
      const param = this.getReqParam("1");
      this.$api.post("/query_device", param).then((res) => {
        self.total = res.err_code == "0" ? Number(res.count) : 0;
        if (callback) {
          callback();
        }
        if (res.err_code != "0") {
          this.$message.error(res.err_msg);
        }
      });
    },
    reqData() {
      this.reqDataTotalCount(() => {
        this.reqDevices();
      });
    },

    //请求数据
    reqDevices() {
      const self = this;
      self.$loading.show();
      const param = this.getReqParam("0");
      this.$api
        .post("/query_device", param)
        .then((res) => {
          if (res.err_code == "0") {
            let i = 0;
            for (let item of res.devices) {
              i += 1;
              let order =
                i +
                (self.current - 1) * self.reqParam.per_page_max_record_count;
              item.key = order;
              item.order = order;
              item.pic = self.getIconPic(
                this.$util.getSnFlag(item.sn),
                item.device_type
              );
              item.description = "额外的描述" + order;
            }
            self.data = res.devices;
          } else {
            self.$message.error(res.err_msg);
            self.data = [];
          }
          self.$loading.hide();
        })
        .catch((err) => {
          console.error(err);
          self.$loading.hide();
        });
    },

    setDateRange() {
      const today = this.$util.getFmtDateStr(new Date());
      this.dateRange = [
        moment("2016-01-01", "YYYY-MM-DD"),
        moment(today, "YYYY-MM-DD"),
      ];
      this.reqParam.beg_time = "2016-01-01" + " 00:00:00";
      this.reqParam.end_time = today + " 23:59:59";
    },
  },
  mounted() {
    let materialsJSON = localStorage.getItem("materials");
    if (!materialsJSON) {
      return;
    }
    let materials = JSON.parse(materialsJSON);
    let tableArr = new Array();
    let keys = [
      "materials_order",
      "origin_name",
      "newest_name",
      "mark_num",
      "supplier_type",
      "supplier_newest_type",
      "belong_type",
      "material_fullname",
      "remarks",
    ];
    let order = 1;
    for (let item of materials) {
      let obj = new Object();
      let i = 0;
      for (let key of keys) {
        obj[key] = item[i++];
      }
      obj.order = order++;
      obj.key = obj.order;
      tableArr.push(obj);
    }
    this.data = tableArr;
  },
};
</script>

<style lang="css">
@import url("../../assets/css/manager.css");
</style>
