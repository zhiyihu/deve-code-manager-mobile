<template>
<a-layout style="padding: 20px 16px 0px 16px; background: #fff; margin-bottom: 18px">
    <a-layout-content :style="{background: '#fff',padding: '0px 0px',margin: 0,minHeight: '280px'}">
        <div style="position: relative">
            <div class="data-table-head" style="height: auto; line-height: 45px; padding-bottom: 10px">
                <div class="opt-head-part">
                    <span style="margin-left: 16px">筛选：</span>
                    <a-input allow-clear v-model="searchKeyword" style="width: 240px"></a-input>

                    <a-button type="primary" icon="search" style="margin-left: 12px" @click="reqData">查询</a-button>
					<a-button type="primary" icon="plus" style=" margin-right: 8px; margin-left: 12px" @click="addItem">添加物料</a-button>
                </div>
            </div>

            <a-table style="overflow: auto" :columns="columns" :data-source="tbDatas" :pagination="pagination">
                <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
                    {{ record.remarks }}
                </p>
				<template v-slot:action="record">
                    <a href="javascript:;" class="'table-opt-alink" @click="modify(record);">修改</a>
                    <a-divider type="vertical" />
                    <a href="javascript:;" @click="del(record);">删除</a>
                 </template>
            </a-table>
        </div>
		<a-modal width="650px" :centered="true" v-model="visible" :title="title" on-ok="handleOk">
			<template slot="footer">
				<a-button key="back" @click="handleCancel">取消</a-button>
				<a-button key="submit" type="primary" @click="handleOk">提交</a-button>
            </template>
			<div style="max-height: 680px; overflow: auto">
				<div class="amodal-edit-line">
					<span><i>*</i>物料编号</span>
					<a-input style="width: 200px;" v-model="materialsOrder" :disabled="orderDisabled"></a-input>
				</div>
				<div class="amodal-edit-line">
					<span><i>*</i>原名称</span>
					<a-input style="width: 200px;" v-model="originName"></a-input>
					<span><i>*</i>最新名称</span>
					<a-input style="width: 200px;" v-model="newestName"></a-input>
				</div>
				<div class="amodal-edit-line">
					<span><i>*</i>供应商型号</span>
					<a-input style="width: 200px;" v-model="supplierType"></a-input>
					<span><i></i>最新型号</span>
					<a-input style="width: 200px;" v-model="supplierNewestType"></a-input>
				</div>
				<div class="amodal-edit-line">
					<span><i>*</i>所属机型</span>
					<a-input style="width: 200px;" v-model="belongType"></a-input>
					<span><i></i>物料全名</span>
					<a-input style="width: 200px;" v-model="materialFullname"></a-input>
				</div>
				<div class="amodal-edit-line">
					<span><i></i>备注</span>
					<a-input style="width: 484px;" v-model="remarks"></a-input>
				</div>

			</div>
        </a-modal>
    </a-layout-content>
</a-layout>
</template>

<script>
import MaterialManager from "../js/MaterialManager";

export default {
  ...MaterialManager,
};

</script>

<style lang="css">
@import url("../../assets/css/manager.css");
</style>
