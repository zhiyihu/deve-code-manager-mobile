export default {
    data() {
        return {
           deviceTypeObjArr: [],
        };
    },
    methods: {
        reqQueryDeviceType() {
            const self = this;
            self.$loading.show();
            this.$api.post("/query_device_type", {}).then(res => {
                if (res.err_code == 0) {
                    self.deviceTypeObjArr = res.device_types;
                } else {
                    self.$message.error(res.err_img);
                }
                self.$loading.hide();
            }).catch(() => { 
                self.$loading.hide();
            });
        },
    },
};
