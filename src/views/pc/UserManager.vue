<template>
  <a-layout
    style="padding: 20px 16px 0px 16px; background: #fff; margin-bottom: 14px"
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
        <div class="data-table-head">
          <div class="opt-head-part">
            <span style="margin-left: 16px">筛选：</span>
            <a-input
              placeholder="输入用户名或姓名筛选"
              allow-clear
              style="width: 200px"
              @change="search"
              v-model="searchText"
            ></a-input>
            <a-button
              type="primary"
              icon="reload"
              style="vertical-align: top; margin-left: 12px"
              @click="reqData"
              >刷新数据</a-button
            >
            <a-button
              type="primary"
              icon="plus"
              style="vertical-align: top; margin-right: 8px; margin-left: 12px"
              @click="addItem"
              >添加用户</a-button
            >
          </div>
        </div>

        <a-table
          :columns="columns"
          :data-source="data"
          :pagination="pagination"
        >
          <span slot="user" slot-scope="user">
            <span
              v-if="user == uname"
              style="font-weight: bolder; color: #1890ff"
              >{{ user }}</span
            >
            <span v-else>{{ user }}</span>
          </span>
          <span slot="state" slot-scope="state">
            <a-tag :color="state === '0' ? 'green' : 'red'">
              {{ ["正常", "删除", "停用", "待改密码"][state || 0] }}
            </a-tag>
          </span>
          <span slot="regist_max_days" slot-scope="regist_max_days">
            {{
              Number(regist_max_days) > 9999 ? "永久" : regist_max_days + "天"
            }}
          </span>
          <template v-slot:action="record">
            <a @click="modify(record)" href="javascript:;">修改</a>
            <template
              v-if="
                record.user != uname &&
                !record.permissions.includes('admin') &&
                record.state != 2
              "
            >
              <a-divider type="vertical" />
              <a @click="stop(record, '0')" href="javascript:;">停用</a>
            </template>
            <template
              v-if="
                record.user != uname &&
                !record.permissions.includes('admin') &&
                record.state == 2
              "
            >
              <a-divider type="vertical" />
              <a @click="stop(record, '1')" href="javascript:;">激活</a>
            </template>
            <template
              v-if="
                record.user != uname && !record.permissions.includes('admin')
              "
            >
              <a-divider type="vertical" />
              <a @click="del(record)" href="javascript:;">删除</a>
            </template>
            <template
              v-if="mypermission.includes('admin') && record.user != 'admin'"
            >
              <a-divider type="vertical" />
              <a @click="modifyRegistDay(record)" href="javascript:;"
                >修改注册天数</a
              >
            </template>
          </template>
        </a-table>
        <a-modal
          width="650px"
          :centered="true"
          v-model="visible"
          :title="modalTitle"
          on-ok="handleOk"
        >
          <template slot="footer">
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button
              key="submit"
              type="primary"
              :loading="loading"
              @click="handleOk"
              >提交</a-button
            >
          </template>
          <div style="max-height: 480px; overflow: auto">
            <div class="amodal-edit-line">
              <span><i>*</i>用户名</span>
              <a-input
                style="width: 200px"
                :disabled="unameDisabled"
                v-model="user"
              ></a-input>
              <span><i>*</i>姓名</span>
              <a-input style="width: 200px" v-model="real_name"></a-input>
            </div>
            <div class="amodal-edit-line">
              <span><i>*</i>电话</span>
              <a-input style="width: 200px" v-model="telephone"></a-input>
              <span><i>*</i>邮箱</span>
              <a-input style="width: 200px" v-model="email"></a-input>
            </div>
            <div class="amodal-edit-line">
              <span><i>*</i>所属公司</span>
              <a-select
                style="width: 486px"
                v-model="companySel"
                @change="onParentCompanySelectChange"
                :disabled="!companyCanChange"
              >
                <a-select-option value="" disabled>请选择</a-select-option>
                <a-select-option
                  v-for="(item, index) in companys"
                  :key="index"
                  :value="item.company_id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
            <div v-if="treeData&&treeData.length" class="amodal-edit-line" style="min-height: 100px;">
                <span><i>*</i>角色权限</span>
                <a-tree style="width: 340px; position: relative; bottom: 30px; left: 84px" v-model="checkedKeys" checkable :expanded-keys="expandedKeys" :auto-expand-parent="autoExpandParent" :selected-keys="selectedKeys" :tree-data="treeData" @expand="onExpand" @select="onSelect" />
            </div>
            <div v-else class="amodal-edit-line" style="height: 30px;">
                <span><i>*</i>角色权限</span>
                <span style="text-align:left;font-weight:bolder;margin-left:6px;">无</span>
            </div>
          </div>
        </a-modal>

        <a-modal
          width="450px"
          :centered="true"
          v-model="registDayVisible"
          title="修改注册天数"
          on-ok="handleRegistDayOk"
        >
          <template slot="footer">
            <a-button key="back" @click="handleRegistDayCancel">取消</a-button>
            <a-button
              key="submit"
              type="primary"
              :loading="loading"
              @click="handleRegistDayOk"
              >提交</a-button
            >
          </template>
          <div style="max-height: 480px; overflow: auto">
            <div style="margin-bottom: 10px">
              <span>用户：{{ currModifyRegistUser }}</span>
            </div>
            <a-input
              placeholder="请输入天数"
              v-model="currModifyRegistIpt"
            ></a-input>
          </div>
        </a-modal>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
import UserManager from "../js/UserManager";

export default {
  ...UserManager,
};
</script>

<style>
@import url("../../assets/css/manager.css");
</style>
