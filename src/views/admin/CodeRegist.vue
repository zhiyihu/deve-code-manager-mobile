<template>
<a-layout style="padding: 20px 0px 0px 0px;background:#fff;margin-bottom:18px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;border: 0px solid #e8e8e8; width: 900px;margin: auto;">
            <a-tabs v-if="codeList.length" :activeKey="currTypeIndex" @change="tabCallback">
                <a-tab-pane v-for="(item,index) in groupList" :key="index" :tab="item.tab">
                </a-tab-pane>
            </a-tabs>
            <div class="regist-machine-line">
                <div class="">全部主机个数：<span style="color: #1890ff;font-size: 20px;">{{codeList.length}}</span></div>
            </div>
            <div class="regist-machine-line">
                <div class="regist-machine-line-title">机号列表</div>
                <div class="regist-machine-list">
                    <div class="regist-machine-sn" v-for="(item, index) in showCodeList" :key="index">
                        <span style="width: 14px;">{{index + 1}}</span>
                        <img :src="item.pic" />
                        <span style="flex-grow:1;">{{item.value}}</span>
                        <button @click="bindDelCode(item.value)"><span class="iconfont icon-yichu" style="color:#18acff;font-size:18px;"></span></button>
                    </div>
                </div>
                <div class="regist-machine-list-addremove">
                    <a-button type="primary" icon="plus" @click="addDevice">添加机号</a-button>
                    <a-button v-if="codeList.length" type="danger" @click="bindClearList">清空列表</a-button>
                </div>
            </div>
            <div class="regist-machine-line">
                <div class="regist-machine-line-title">激活天数（{{maxActText}}）</div>
                <div class="regist-machine-time">
                    <a-radio-group v-model="regTimeVal" @change="onRegTimeChange">
                        <a-radio-button v-for="(item, index) in actTimesArr" :key="index" :value="item.val">
                            {{item.name}}
                        </a-radio-button>
                    </a-radio-group>
                    <span class="regist-machine-tipspan">
                        {{Number(activeDays) > 9999 ? '永久激活': activeDays + '天'}}
                    </span>
                </div>
                <div class="regist-machine-passday" v-if="activeDays<=9999">
                    <div class="machine-passday-div" :style="dateStyle">
                        <a-date-picker :allowClear="false" v-model="actPassDay" :disabled-date="disabledDate" @change="onDateChange" style="width: 180px;" />
                    </div>
                    <span class="regist-machine-tipspan">到期</span>
                </div>
            </div>
            <div class="regist-machine-line" v-if="deviceFuncOptions.length">
                <div class="regist-machine-line-title">主机功能</div>
                <div class="regist-machine-funclist">
                    <a-checkbox-group v-model="regFuncVal" name="checkboxgroup" :options="deviceFuncOptions" />
                </div>
            </div>

            <div class="regist-machine-line">
                <div class="regist-machine-line-title">注册原因</div>
                <div class="regist-machine-funclist">
                    <a-radio-group v-model="regReasonVal">
                        <a-radio-button v-for="(item,index) in actReasonArr" :key="index" :value="item">
                            {{item}}
                        </a-radio-button>
                    </a-radio-group>
                </div>
            </div>
            <div class="regist-machine-submit">
                <a-button type="primary" @click="submitRegist">申请注册</a-button>
            </div>

            <a-modal :width="520" :centered="true" v-model="visible" :title="modalTitle" on-ok="handleOk">
                <template slot="footer">
                    <a-button key="back" @click="handleCancel">取消</a-button>
                    <a-button key="submit" type="primary" :loading="loading" @click="handleOk">添加</a-button>
                </template>
                <div style="height: 240px;overflow: hidden;">
                    <a-textarea v-model="addDeviceSnListVal" placeholder="多个机号用换行或分号逗号等隔开" style="width: 480px;height: 210px;resize:none;" @change="codeStrChange"></a-textarea>
                    <div style="padding-top: 8px;">
                        <span>识别到{{machineNum}}个机号</span>
                    </div>
                </div>
            </a-modal>
            <a-modal :width="520" :centered="true" v-model="regResVisible" :title="regResModalTitle">
                <template slot="footer">
                    <a-button :visible="false" key="back" @click="regResHandleCancel">取消</a-button>
                    <a-button key="submit" type="primary" :loading="loading" class="copy" :data-clipboard-text="copyText" @click="regResHandleOk">复制全部结果</a-button>
                </template>
                <div style="min-height: 220px;max-height: 300px;padding: 0px 14px;overflow: auto;">
                    <div class="code-list-detail" v-for="(item,index) in registResArr" :key="index">
                        <div class="machine-line-info">
                            <div>序号：</div>
                            <div><span user-select="true">第{{index + 1}}条</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>机号：</div>
                            <div><span user-select="true">{{item.sn}}</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>机型：</div>
                            <div><span user-select="true">{{item.type}}</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>注册码：</div>
                            <div><span user-select="true">{{item.codeShow}}</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>注册天数：</div>
                            <div><span user-select="true">{{item.daysShow}}</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>到期时间：</div>
                            <div><span user-select="true">{{item.passDayShow}}</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>主机功能：</div>
                            <div><span user-select="true">{{item.funcShow}}</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>操作人：</div>
                            <div><span user-select="true">{{item.user}}</span></div>
                        </div>
                    </div>
                </div>
            </a-modal>
        </div>
    </a-layout-content>
    <div class="not-enough-height"></div>
</a-layout>
</template>

<script>
import moment from "moment";
import ClipboardJS from 'clipboard';

export default {
    data() {
        return {
            registResArr: [],
            copyText: '',
            regResVisible: false,
            regResModalTitle: '注册结果',
            dateStyle: {
                borderWidth: '0px'
            },
            maxActDay: 1,
            deviceTypesObj: {},
            dateRange: [],
            loading: false,
            visible: false,
            modalTitle: '添加机号',
            addDeviceSnListVal: '',
            deviceTypeIconObj: {},
            regTimeVal: '1',
            activeDays: 1,
            regReasonVal: '',
            deviceFunc: {},
            deviceType: {},
            deviceFuncOptions: [],
            actPassDay: moment().add(1, 'days'),
            regFuncVal: [],
            codeList: [],
            showCodeList: [],
            groupList: [],
            currTypeIndex: 0,
            currType: '',
            actTimesArr: [],
            actTimeConfigArr: [{
                "val": "1",
                "name": "1天"
            }, {
                "val": "3",
                "name": "3天"
            }, {
                "val": "7",
                "name": "7天"
            }, {
                "val": "15",
                "name": "15天"
            }, {
                "val": "30",
                "name": "30天"
            }, {
                "val": "60",
                "name": "60天"
            }, {
                "val": "90",
                "name": "90天"
            }, {
                "val": "180",
                "name": "180天"
            }, {
                "val": "365",
                "name": "1年"
            }, {
                "val": "1095",
                "name": "3年"
            }, {
                "val": "1825",
                "name": "5年"
            }, {
                "val": "10000",
                "name": "永久"
            }],
            actReasonArr: [],
            machineNum: 0,
        };
    },
    methods: {
        initClipboard() {
            const self = this
            this.clipboard = new ClipboardJS('.copy');
            this.clipboard.on('success', (e) => {
                e.clearSelection();
                self.$message.success('复制成功');
            });
            this.clipboard.on('error', () => {
                self.$message.error('复制错误，请重新复制！');
            });
        },

        destoryClipboard() {
            if (this.clipboard) {
                this.clipboard.destroy();
            }
        },
        regResHandleOk() {
            this.regResVisible = false;
        },
        regResHandleCancel() {
            this.regResVisible = false;
        },
        submitRegist() {
            const self = this;
            if (!this.codeList.length) {
                this.$message.info('请添加机号');
                return;
            }
            const currTypeIndex = self.currTypeIndex;
            let currType = (this.groupList[currTypeIndex] || {
                type: ''
            }).type;
            this.$confirm({
                title: '激活提示',
                content: '确认激活全部' + currType + '？',
                okText: '确认',
                okType: 'primary',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.reqRegistMachine();
                },
                onCancel() {},
            });
        },
        getDeviceFuncVal() {
            let regFuncVal = this.regFuncVal;
            let total = 0;
            for (let key of regFuncVal) {
                total += Math.pow(2, key - 0);
            }
            return total;
        },
        reqRegistMachine() {
            const self = this;
            const param = new Object();
            const devices = new Array();
            const showCodeList = self.showCodeList;
            const actDay = (self.activeDays) + '';
            const functionCode = self.getDeviceFuncVal() + '';
            const actReason = self.regReasonVal;
            for (let item of showCodeList) {
                devices.push({
                    sn: item.value,
                    type: item.type,
                    days: actDay,
                    function_code: functionCode,
                    apply_reason: actReason,
                });
            }
            param.devices = devices;
            param.way = "web"; //激活方式为网页

            self.$loading.show();

            this.$api.post('/regist_device', param).then(res => {
                self.$loading.hide();
                if (res.err_code == '0') {
                    self.clearCurrList();
                    self.showRegistResModal(res.codes);
                } else {
                    self.$error({
                        title: res.err_msg,
                        onOk() {},
                    });
                }
            }).catch(e => {
                self.$loading.hide();
                console.error(e);
            });

        },
        showRegistResModal(codes) {
            const self = this;
            let copyText = '';
            const len = codes.length;
            codes.forEach((item, index) => {
                item.regDayShow = item.regist_datetime.substr(0, 19);
                item.daysShow = (item.days <= 9999 ? item.days + '天' : '永久');
                item.passDayShow = (item.days <= 9999 ? item.expire_date.substr(0, 19) : '9999-12-31');
                item.codeShow = self.$util.fmtActCode(item.code);
                item.funcShow = (item.func_list.join('，') || '无');
                copyText += '第' + (index + 1) + '条记录\r\n';
                copyText += this.getClipFmtTextSingle(item) + (index < len - 1 ? '\r\n\r\n' : '');
            });
            self.registResArr = codes;
            self.regResVisible = true;
            self.copyText = copyText;
            self.regResModalTitle = '注册成功（共' + codes.length + '条）';
        },
        getClipFmtTextSingle: function (code) {
            let res = '';
            res += '机号：' + code.sn + '\r\n';
            res += '机型：' + code.type + '\r\n';
            res += '注册码：' + code.codeShow + '\r\n';
            res += '注册天数：' + code.daysShow + '\r\n';
            res += '到期时间：' + code.passDayShow + '\r\n';
            res += '主机功能：' + code.funcShow + '\r\n';
            res += '操作人：' + code.user + '\r\n';
            return res;
        },
        disabledDate(current) {
            let maxActDay = this.maxActDay;
            return (current && current < moment().endOf('day')) || current > moment().add(maxActDay, 'days');
        },
        onDateChange(date) {
            this.regTimeVal = '';
            let dayGap = date.diff(moment().startOf('day'), 'day');
            this.activeDays = dayGap - 0;
            this.dateStyle = {
                borderWidth: '1px'
            };
        },
        refreshDeviceFuncOptions(isNotResetVal) {
            let options = new Array();
            const currTypeIndex = this.currTypeIndex;
            let currType = (this.groupList[currTypeIndex] || {
                type: ''
            }).type;
            let funcArr = (this.deviceFunc[currType] || []);
            for (let item of funcArr) {
                options.push({
                    label: item.name,
                    value: item.bit,
                });
            }
            this.deviceFuncOptions = options;
            if (!isNotResetVal) {
                this.regFuncVal = [];
            }

        },
        codeStrChange(e) {
            const codeStr = e.target.value;
            const codesArr = this.getLegalCodes(codeStr);
            this.machineNum = codesArr.length;
        },
        calGroupList(codeList) {
            const groupList = new Array();
            const obj = new Object();
            for (let code of codeList) {
                obj[code.type] = (obj[code.type] || 0) + 1
            }
            for (let key in obj) {
                groupList.push({
                    type: key,
                    num: obj[key],
                    tab: key + ' * ' + obj[key]
                });
            }
            return groupList;
        },

        getMachineType(code) {
            let type = "";
            if (code.length == 15) {
                type = '0' + code.substr(5, 2);
            } else if (code.length == 14) {
                type = '0' + code.substr(2, 2);
            } else if (code.length == 19) {
                type = code.substr(6, 3);
            }
            const deviceType = this.deviceType;
            return deviceType[type];
        },

        getIndexOfCode(code) {
            const codeList = this.codeList;
            for (let i = 0; i < codeList.length; i++) {
                let codeObj = codeList[i];
                if (codeObj.value == code) {
                    return i;
                }
            }
            return -1;
        },
        getLegalCodes(codeStr) {
            codeStr = codeStr.toUpperCase();
            const reg = new RegExp('[A-Z][A-Z0-9]{13,18}', 'g');
            const self = this;
            return [...new Set(codeStr.match(reg) || [])].filter(item => {
                return self.getMachineType(item);
            });
        },
        bindDelCode: function (code) {

            const self = this;
            this.$confirm({
                title: '删除提示',
                content: '确认移除' + code + '？',
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.removeCode(code);
                },
                onCancel() {},
            });
        },

        removeCode: function (code) {
            const codeList = this.codeList;
            const index = this.getIndexOfCode(code);
            if (index >= 0) {
                codeList.splice(index, 1);
                const groupList = this.groupList;
                const newGroupList = this.calGroupList(codeList);
                const currTypeIndex = (newGroupList.length == groupList.length ? this.currTypeIndex : 0);
                const currType = (newGroupList[currTypeIndex] || {
                    type: ''
                }).type;
                const showCodeList = codeList.filter((item) => {
                    return item.type == currType
                });

                this.codeList = codeList;
                this.showCodeList = showCodeList;
                this.groupList = newGroupList;
                this.currTypeIndex = currTypeIndex;
                this.refreshDeviceFuncOptions(true);
            }

        },

        bindClearList: function () {
            const self = this;
            const currTypeIndex = self.currTypeIndex;
            let currType = (this.groupList[currTypeIndex] || {
                type: ''
            }).type;
            this.$confirm({
                title: '删除提示',
                content: '确认清空全部' + currType + '？',
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.clearCurrList();
                },
                onCancel() {},
            });

        },
        clearCurrList: function () {
            const self = this;
            const currTypeIndex = self.currTypeIndex;
            let currType = (this.groupList[currTypeIndex] || {
                type: ''
            }).type;
            const codeList = self.codeList.filter((item) => {
                return item.type != currType
            });
            const groupList = self.calGroupList(codeList);
            currType = (groupList[0] || {
                type: ''
            }).type;
            const showCodeList = codeList.filter((item) => {
                return item.type == currType
            });

            this.codeList = codeList;
            this.showCodeList = showCodeList;
            this.groupList = groupList;
            this.currTypeIndex = 0;
            this.refreshDeviceFuncOptions();
        },
        addCode(codeStr) {
            codeStr = (codeStr || '');
            if (!codeStr) {
                return;
            }
            const legalCodes = this.getLegalCodes(codeStr);

            if (!legalCodes.length) {
                this.$message.error('不正确的主机号');
                return;
            }
            const codeList = this.codeList;
            if (codeList.length >= 300) {
                this.$message.info('最多添加300台');
                return;
            }

            for (let code of legalCodes) {
                const index = this.getIndexOfCode(code);
                if (index >= 0) {

                    this.$info({
                        title: code + '已在列表',
                        onOk() {},
                    });
                    return;
                }
            }

            for (let code of legalCodes) {
                let type = this.getMachineType(code);
                codeList.push({
                    type: type,
                    value: code,
                    pic: this.getIconPic(type)
                });
            }

            const groupList = this.calGroupList(codeList);
            const currTypeIndex = this.currTypeIndex;
            const currType = (groupList[currTypeIndex] || {
                type: ''
            }).type;
            const showCodeList = codeList.filter((item) => {
                return item.type == currType
            });

            this.codeList = codeList;
            this.showCodeList = showCodeList;
            this.groupList = groupList;

            this.refreshDeviceFuncOptions(true);

        },

        onRegTimeChange(e) {
            let day = e.target.value;
            this.activeDays = day - 0;
            this.actPassDay = moment().add(day, 'days');
            this.dateStyle = {
                borderWidth: '0px'
            };
        },

        tabCallback(key) {
            const index = key;
            const currType = this.groupList[index].type;
            const codeList = this.codeList;
            this.currTypeIndex = key;
            this.showCodeList = codeList.filter((item) => {
                return item.type == currType
            });
            this.refreshDeviceFuncOptions();
        },

        handleOk() {
            const codeStr = this.addDeviceSnListVal;
            this.addCode(codeStr);
            this.visible = false;
        },
        handleCancel() {
            this.visible = false;
        },
        addDevice() {
            this.addDeviceSnListVal = '';
            this.machineNum = 0;
            this.visible = true;
        },

        getIconPic(type) {
            let deviceTypeIconObj = this.deviceTypeIconObj;
            return deviceTypeIconObj[type];
        },

        /**请求类型 */
        reqDeviceType(callback) {
            const self = this;
            this.$api.post("/query_device_type", {}).then(res => {

                if (res.err_code == 0) {
                    self.deviceTypesObj = res.device_typs;
                    let obj = new Object();
                    let deviceType = new Object();
                    let types = res.device_typs;
                    for (let key in types) {
                        deviceType[types[key]] = key;
                        let imgName = self.$util.getMachinePicByType(key);
                        obj[key] = require('../../assets/' + imgName + '.png');
                    }
                    self.deviceType = deviceType;
                    self.deviceTypeIconObj = obj;
                } else {
                    self.$message.error(res.err_img);
                }
                if (callback) {
                    callback();
                }
            }).catch(() => {});
        },

        reqRegistReasons() {
            const self = this;
            this.$api.post("/query_regist_reason", {}).then(res => {
                if (res.err_code == 0) {
                    self.actReasonArr = res.reasons;
                    self.regReasonVal = res.reasons[0];
                } else {
                    self.$message.error(res.err_img);
                }
            }).catch(() => {});
        },

        reqDeviceFuncs() {
            const self = this;
            this.$api.post("/query_device_func", {}).then(res => {
                if (res.err_code == 0) {
                    self.deviceFunc = res.device_func;
                } else {
                    self.$message.error(res.err_img);
                }
            }).catch(() => {});
        },

        setDateRange() {
            const today = this.$util.getFmtDateStr(new Date());
            this.dateRange = [moment(today, 'YYYY-MM-DD'), moment(today, 'YYYY-MM-DD')];

        },
        refreshMaxActDays: function () {
            let user = JSON.parse(sessionStorage.getItem("user"));
            const maxActDay = user.regist_max_days - 0;
            this.maxActDay = maxActDay;

            const timesArr = new Array();
            const actTimeConfigArr = this.actTimeConfigArr;
            for (let item of actTimeConfigArr) {
                if (item.val - 0 <= maxActDay) {
                    timesArr.push(item);
                }
            }
            this.actTimesArr = timesArr;
        },

    },
    mounted() {
        this.refreshMaxActDays();
        this.reqDeviceType();
        this.reqRegistReasons();
        this.reqDeviceFuncs();
        this.initClipboard();
    },
    destroyed() {
        this.destoryClipboard();
    },
    computed: {
        maxActText() {
            let maxActDay = this.maxActDay;
            return maxActDay - 0 <= 9999 ? '最多' + maxActDay + '天' : '可永久激活';
        }
    }
};
</script>

<style>
@import url('../../assets/css/manager.css');
@import url('../../assets/iconfont/iconfont.css');
</style>
