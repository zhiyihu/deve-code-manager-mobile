<template>
<a-layout style="padding: 16px 0px;background:#fff;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;">
            <div class="data-table-head">
                <div class="opt-head-part">
                    <span>筛选：</span>
                    <a-input placeholder="输入用户名或姓名筛选" allow-clear style="width: calc(100vw - 80px)" @change="search" v-model="searchText"></a-input>
                </div>
                <div style="margin-top: 10px;">
                    <a-button type="primary" icon="reload" style="vertical-align: top;" @click="reqData">刷新数据</a-button>
                    <a-button type="primary" icon="plus" style="vertical-align: top;margin-right: 8px;margin-left: 12px;" @click="addItem">添加用户</a-button>
                </div>
            </div>
            <div class="table-bottom-page-count">一共有{{total}}条数据，每页{{pageSize}}条，当前第{{current}}页</div>
            <div>
                <div v-for="(item,index) in data.slice(current*pageSize-pageSize,current*pageSize)" :key="index" class="table-info-part">
                    <div class="table-info-order-line">
                        {{item.order}}
                    </div>
                    <div class="table-info-line">
                        <div>用户名：</div>
                        <div>
                            <span v-if="item.user == uname" style="font-weight: bolder;color: #1890ff;">{{item.user}}</span>
                            <span v-else>{{item.user}}</span>
                        </div>
                    </div>

                    <div class="table-info-line">
                        <div>姓名：</div>
                        <div>{{item.real_name}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>电话：</div>
                        <div>{{item.telephone}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>邮箱：</div>
                        <div>{{item.email}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>公司：</div>
                        <div>{{item.company_name}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>注册天数：</div>
                        <div>{{ Number(item.regist_max_days) > 9999 ? '永久' : item.regist_max_days + '天'}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>状态：</div>
                        <div>
                            {{ ['正常','删除','停用','待改密码'][item.state || 0] }}
                        </div>
                    </div>
                    <div class="table-info-optbtns">
                        <a href="javascript:;" class="table-opt-alink" @click="modify(item);">修改</a>
                        <a href="javascript:;" class="table-opt-alink" v-if="mypermission.includes('admin') && item.user != 'admin'" @click="modifyRegistDay(item);">修改注册天数</a>
                        <a href="javascript:;" class="table-opt-alink" v-if="item.user != uname && !item.permissions.includes('admin') && item.state != 2" @click="stop(item, '0');">停用</a>
                        <a href="javascript:;" class="table-opt-alink tablel-opt-alink-act" v-if="item.user != uname && !item.permissions.includes('admin') && item.state == 2" @click="stop(item, '1');">激活</a>
                        <a href="javascript:;" class="table-opt-alink" v-if="item.user != uname && !item.permissions.includes('admin')" @click="del(item);">删除</a>
                    </div>
                </div>
            </div>

            <a-pagination show-size-changer style="margin-top: 24px;margin-bottom: 20px;" :page-size="pageSize" @change="onPageChange" v-model="current" :total="total" :show-total="(total) => ``" show-less-items>

            </a-pagination>
            <a-modal width="320px" :centered="true" v-model="visible" :title="modalTitle" on-ok="handleOk">
                <template slot="footer">
                    <a-button key="back" @click="handleCancel">取消</a-button>
                    <a-button key="submit" type="primary" :loading="loading" @click="handleOk">提交</a-button>
                </template>
                <div style="max-height: 320px;overflow: auto;">
                    <div class="amodal-edit-line">
                        <span><i>*</i>用户名</span>
                        <a-input style="width: 180px;" :disabled="unameDisabled" v-model="user"></a-input>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>姓名</span>
                        <a-input style="width: 180px;" v-model="real_name"></a-input>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>电话</span>
                        <a-input style="width: 180px;" v-model="telephone"></a-input>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>邮箱</span>
                        <a-input style="width: 180px;" v-model="email"></a-input>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>所属公司</span>
                        <a-select style="width: 180px;" v-model="companySel" :disabled="!companyCanChange" @change="onParentCompanySelectChange">
                            <a-select-option value="" disabled>请选择</a-select-option>
                            <a-select-option v-for="(item, index) in companys" :key="index" :value="item.company_id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div v-if="treeData&&treeData.length">
                        <div class="amodal-edit-line">
                            <span><i>*</i>角色权限</span>
                        </div>
                        <div class="amodal-edit-line" style="height: 100px;">
                            <a-tree style="width: 260px;position: relative; bottom: 30px;left: 0px;" v-model="checkedKeys" checkable :expanded-keys="expandedKeys" :auto-expand-parent="autoExpandParent" :selected-keys="selectedKeys" :tree-data="treeData" @expand="onExpand" @select="onSelect" />
                        </div>
                    </div>
                    <div v-else>
                        <div class="amodal-edit-line"  style="height: 30px;">
                            <span><i>*</i>角色权限</span>
                            <span style="text-align:left;margin-left:6px;font-weight:bolder;">无</span>
                        </div>
                    </div>
                </div>
            </a-modal>

            <a-modal width="320px" :centered="true" v-model="registDayVisible" title="修改注册天数" on-ok="handleRegistDayOk">
                <template slot="footer">
                    <a-button key="back" @click="handleRegistDayCancel">取消</a-button>
                    <a-button key="submit" type="primary" :loading="loading" @click="handleRegistDayOk">提交</a-button>
                </template>
                <div style="max-height: 480px;overflow: auto;">
                    <div style="margin-bottom: 10px;">
                        <span>用户：{{currModifyRegistUser}}</span>
                    </div>
                    <a-input placeholder="请输入天数" v-model="currModifyRegistIpt"></a-input>
                </div>
            </a-modal>
        </div>
    </a-layout-content>
</a-layout>
</template>

<script>
import UserManager from '../js/UserManager'

export default {
    ...UserManager
}
</script>

<style>
@import url('../../assets/css/manager-mobile.css');
</style>
