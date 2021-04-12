export default {
    data() {
        return {
           deviceTypeObjArr: [],
           deviceTypeSelectArr: [],  //M65, M66
           deviceType: {},  //标识=>机型, 081:JK07
           deviceTypeIconObj: {},

           userMap: {},
           userSelectArr:[],

           companyMap: {},
           companySelectArr: [],
           deviceImgBase64Obj: {},
           deviceFuncMap: {}
        };
    },
    methods: {
        filterOption(input, option) {
            return (
              option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        reqQueryDeviceType(callback) {
            const self = this;
            self.$loading.show();
            this.$api.post("/query_device_type", {}).then(res => {
                if (res.err_code == 0) {
                    self.deviceTypeObjArr = res.device_types;
                    if(!res.device_typs){
                        res.device_typs = self.$util.adaptDeviceType(res.device_types);
                    }
                    let imgObj = new Object();
                    for (let item of res.device_types) {
                        let imgName = self.$util.getMachinePicByType(item.name);
                        imgObj[item.name] = require('../../assets/' + imgName + '.png');
                    }
                    self.deviceType = res.device_typs;
                    self.deviceTypeIconObj = imgObj;
                    self.deviceTypeSelectArr = [...new Set(Object.values(res.device_typs))];
                    //主机类型对应默认功能码
                    let deviceFuncMap = new Object();
                    for(let item of res.device_types){
                      deviceFuncMap[item.name + '|' + item.sn_flag] = item.product_func_code;
                    }
                    this.deviceFuncMap = deviceFuncMap;
                } else {
                    self.$message.error(res.err_img);
                }
                if(callback){
                    callback();
                }
                self.$loading.hide();
            }).catch(() => { 
                self.$loading.hide();
            });
        },

        reqQueryDeviceIcon(callback){
            const self = this;
            self.$loading.show();
            this.$api.post("/query_device_image", {}).then(res => {
                if (res.err_code == 0) {
                    const deviceImgBase64Obj = new Object();
                    for(let item of res.device_images){                        
                        if(item.image_base64 && item.sn_flag){
                            deviceImgBase64Obj[item.sn_flag] = 'data:image/png;base64,'+item.image_base64;
                        }
                    }
                    self.deviceImgBase64Obj = deviceImgBase64Obj;
                } else {
                    self.$message.error(res.err_img);
                }
                if(callback){
                    callback();
                }
                self.$loading.hide();
            }).catch((err) => { 
                console.error(err);
                self.$loading.hide();
            });
        },

        reqQueryDeviceFuncs(callback) {
            const self = this;
            this.$api.post("/query_device_func", {}).then(res => {
                if (res.err_code == 0) {
                    self.deviceFunc = res.device_func;
                } else {
                    self.$message.error(res.err_img);
                }
                if(callback){
                    callback();
                }
            }).catch(() => { });
        },

        //查询本公司及子用户
        reqQueryUser(callback){
            const self = this;
            this.$api.post("/query_user", {
                type: "2",
            }).then(res => {
                if (res.err_code == '0') {
                    const obj = new Object();
                    res.users.forEach((user) => {
                        obj[user.id] = user.real_name;
                    });
                    self.userMap = obj;

                    self.userSelectArr = res.users.filter(item => {
                        return item.state != '1';
                    });
                }
                if (callback) {
                    callback();
                }
            }).catch((err) => {
                console.error(err);
            });
        },

        reqQueryCompany(callback) {
            const self = this;
            this.$api.post("/query_company", {
                type: "1",
            }).then(res => {
                if (res.err_code == '0') {
                    const resData = [];
                    for (let company of res.companies) {
                        resData.push(company);
                        self.companyMap[company.company_id] = company.name;
                    }
                    self.companySelectArr = resData;
                }
                if (callback) {
                    callback();
                }
            }).catch((err) => {
                console.error(err);
            });
        },

        getIconPic(snFlag, type) {
            let deviceImgBase64Obj = this.deviceImgBase64Obj;
            let imgSrc = deviceImgBase64Obj[snFlag];
            if(imgSrc){
                return imgSrc;
            }else{
                if((/X-M62|X-M65|X-M66|X-M68/).test(type)){
                    type = type.substr(2);
                }
                let deviceTypeIconObj = this.deviceTypeIconObj;
                return deviceTypeIconObj[type];
            }
        },
    },
};
