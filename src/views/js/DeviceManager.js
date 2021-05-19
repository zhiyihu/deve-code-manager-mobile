import moment from "moment";
import DeveCodeCommon from './DeveCodeCommon';



let columns = [{
    title: '序号',
    dataIndex: 'order',
    width: 120,
}, {
    title: '图标',
    dataIndex: 'pic',
    width: 100,
    scopedSlots: {
        customRender: 'pic'
    },
},
{
    width: 240,
    title: '机号',
    dataIndex: 'sn',
},
{
    width: 90,
    title: '机型',
    dataIndex: 'device_type',
},
{
    title: '公司',
    dataIndex: 'company_id',
    scopedSlots: {
        customRender: 'company_id'
    },
},
{
    title: '生产时间',
    dataIndex: 'product_time',
    scopedSlots: {
        customRender: 'time'
    },
    customCell: () => {
        return {
            style: {
                'min-width': '66px',
            },
        };
    },
},

];
let company_id = JSON.parse(sessionStorage.getItem("user")).company_id;
let isDevecent = company_id == '1';
if(!isDevecent){
    columns = columns.slice(0, columns.length - 1);
}
export default {
    extends: DeveCodeCommon,
    data() {
        return {
            data: [],
            columns,
            isDevecent: isDevecent,
            dateRange: [],
            reqParam: {
                page_num: "1",
                per_page_max_record_count: "10",
            },
            pagination: false,
            pageSizeOptions: ['10', '20', '50', '100'],
            tableStyle: {
                maxHeight: Math.floor((document.body.clientHeight - 250)) + 'px'
            },
            tableScroll: {
                y: Math.floor((document.body.clientHeight - 320))
            },
            total: 0, //记录总条数
            current: 1, //分页的当前页码
            searchSN: '', //搜索机号
            pageSize: 10,
        };
    },
    methods: {
        exportExcelByArr(exportArray, filename = "导出表格") {
            //this.downloadTextFile(filename + ".csv", exportArray.join("\r\n"));
            this.$loading.show();
            let XLSX = require("xlsx");
            let tSheet = XLSX.utils.aoa_to_sheet(exportArray);  
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, tSheet, "Sheet1");
            this.$loading.hide();
            XLSX.writeFile(wb, filename + ".xls", {cellStyles: true});
        },
        downloadTextFile(fileName, content) {
            var data = new Blob([content]);
            var downloadUrl = window.URL.createObjectURL(data);
            var anchor = document.createElement("a");
            anchor.href = downloadUrl;
            anchor.download = fileName;
            anchor.click();
            window.URL.revokeObjectURL(data);
        },
        //根据筛选条件，导出全部数据
        exportExcel(){            
            const self = this;
            self.$loading.show();
            const param = this.getReqParam('0');
            param.page_num = '1'
            param.per_page_max_record_count = '60000';
            const tableArr = [["序号","机号","型号","公司","生产时间"]];
            this.$api.post("/query_device", param).then(res => {
                if (res.err_code == '0') {
                    let i = 0;
                    for (let item of res.devices) {
                        item.order = ++i;
                        tableArr.push([
                            i,
                            item.sn, 
                            item.device_type, 
                            self.companyMap[item.company_id],
                            item.product_time.substr(0,19)
                        ]);
                    }
                    self.exportExcelByArr(tableArr);
                } else {
                    self.$message.error(res.err_msg);
                    self.data = [];
                }
                self.$loading.hide();
            }).catch((err) => {
                console.error(err);
                self.$loading.hide();
            });
            
        },
        onDateChange(moment, dates) {
            this.reqParam.beg_time = dates[0] ? dates[0] + ' 00:00:00' : '';
            this.reqParam.end_time = dates[1] ? dates[1] + ' 23:59:59' : '';
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
            this.reqParam.page_num = '1';
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
            const param = this.getReqParam('1');
            this.$api.post("/query_device", param).then(res => {
                self.total = res.err_code == '0' ? Number(res.count) : 0;
                if (callback) {
                    callback();
                }
                if (res.err_code != '0') {
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
            const param = this.getReqParam('0');
            this.$api.post("/query_device", param).then(res => {

                if (res.err_code == '0') {
                    let i = 0;
                    for (let item of res.devices) {
                        i += 1;
                        let order = i + (self.current - 1) * self.reqParam.per_page_max_record_count;
                        item.key = order;
                        item.order = order;
                        item.pic = self.getIconPic(this.$util.getSnFlag(item.sn), item.device_type)
                    }
                    self.data = res.devices;
                } else {
                    self.$message.error(res.err_msg);
                    self.data = [];
                }
                self.$loading.hide();
            }).catch((err) => {
                console.error(err);
                self.$loading.hide();
            });
        },

        setDateRange() {
            const today = this.$util.getFmtDateStr(new Date());
            this.dateRange = [moment('2016-01-01', 'YYYY-MM-DD'), moment(today, 'YYYY-MM-DD')];
            this.reqParam.beg_time = '2016-01-01' + ' 00:00:00';
            this.reqParam.end_time = today + ' 23:59:59';
        }

    },
    mounted() {
        const self = this;
        this.setDateRange();
        this.reqQueryDeviceType(() => {
            self.reqQueryDeviceIcon(()=>{
                self.reqQueryCompany(() => {
                    self.reqData();
                });
            });
        });

    }
};