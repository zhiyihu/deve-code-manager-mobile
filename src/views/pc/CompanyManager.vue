<template>
<a-layout style="padding: 20px 16px 0px 16px; background: #fff; margin-bottom: 14px">
    <a-layout-content :style="{
        background: '#fff',
        padding: '0px 0px',
        margin: 0,
        minHeight: '280px',
      }">
        <div style="position: relative">
            <div class="data-table-head">
                <div class="opt-head-part">
                    <span style="margin-left: 16px">筛选：</span>
                    <a-input placeholder="输入公司名称筛选" allow-clear style="width: 230px" @change="search" v-model="searchText"></a-input>
                    <a-button type="primary" icon="reload" style="vertical-align: top; margin-left: 12px" @click="reqData">刷新数据</a-button>
                    <a-button type="primary" icon="plus" style="vertical-align: top; margin-right: 8px; margin-left: 12px" @click="addItem">添加公司</a-button>
                </div>
            </div>

            <a-table :columns="columns" :data-source="data" :pagination="pagination">
                <span slot="name" slot-scope="name">
                    <span v-if="name == myCompanyName" style="font-weight: bolder; color: #1890ff">{{ name }}</span>
                    <span v-else>{{ name }}</span>
                </span>
                <span slot="parent_id" slot-scope="parent_id">
                    {{ companyMap[parent_id] || "" }}
                </span>
                <span slot="type" slot-scope="type">
                    {{ ["通用", "代理商", "驾校"][type || 0] }}
                </span>
                <template v-slot:action="record">
                    <a @click="modify(record)" href="javascript:;">修改</a>
                    <template v-if="record.company_id != myCompany && record.parent_id != '0'">
                        <a-divider type="vertical" />
                        <a @click="del(record)" href="javascript:;">删除</a>
                    </template>
                </template>
            </a-table>
            <a-modal :centered="true" v-model="visible" :title="modalTitle" on-ok="handleOk">
                <template slot="footer">
                    <a-button key="back" @click="handleCancel">取消</a-button>
                    <a-button key="submit" type="primary" :loading="loading" @click="handleOk">提交</a-button>
                </template>
                <div style="max-height: 480px; overflow: auto">
                    <div class="amodal-edit-line">
                        <span><i>*</i>公司类型</span>
                        <a-radio-group :disabled="companyId==myCompanyId" default-value="0" button-style="solid" v-model="companyType">
                            <a-radio-button value="0">通用</a-radio-button>
                            <a-radio-button value="1">代理商</a-radio-button>
                            <a-radio-button value="2">驾校</a-radio-button>
                        </a-radio-group>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>公司名称</span>
                        <a-input style="width: 350px" :maxLength="24" :disabled="unameDisabled" v-model="companyName"></a-input>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>电话</span>
                        <a-input style="width: 350px" :maxLength="20" v-model="telephone"></a-input>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>地址</span>
                        <a-input style="width: 350px" :maxLength="30" v-model="address"></a-input>
                    </div>
                    <div class="amodal-edit-line" v-if="parentCanChange">
                        <span><i>*</i>上一级</span>
                        <a-select style="width: 350px" :disabled="!parentCanChange" v-model="companyParentSel" @change="onParentCompanySelectChange">
                            <a-select-option value="" disabled>请选择</a-select-option>
                            <a-select-option v-if="operateType == 'modify'" value="0" disabled>无</a-select-option>
                            <a-select-option v-for="(item, index) in backData" :key="index" :value="item.company_id">
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
        </div>
    </a-layout-content>
</a-layout>
</template>

<script>
import CompanyManager from "../js/CompanyManager";

export default {
    ...CompanyManager,
};
</script>

<style>
@import url("../../assets/css/manager.css");
</style>
