import Vue from 'vue';

const util = {
    calDateStrByGap(date, aft){
      const ndate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 0 + aft);
      return this.getFmtDateStr(ndate);
    },
    getSnFlag: function(code){
      let type = "";
      if(code.charAt(0) == 'X'){
        code = code.substr(1);
      }
      if (code.length == 15) {
        type = '0' + code.substr(5, 2);
      } else if (code.length == 14) {
        type = '0' + code.substr(2, 2);
      } else if (code.length == 19) {
        type = code.substr(6, 3);
      }
      return type;
    },
    
    fillZero(num) {
        return (num < 10 ? '0' : '') + num;
    },
     //适配修改类型返回的请求
    adaptDeviceType: function(deviceTypes){
      const deviceTypeObj = new Object();
      for(let item of deviceTypes){
        deviceTypeObj[item.sn_flag] = item.name;
      }
      return deviceTypeObj;
    },
    //9999天显示永久
    fmtRegDay: function(days){
      return (days < 9999 ? days + '天' : '永久');
    },

    fmtPassDay: function(days, passDateStr){
      return (days < 9999 ? passDateStr.substr(0, 10) : '永久激活');
    },
    getFmtTimeStr(date) {
        return date.getFullYear() + '-'
        + this.fillZero(date.getMonth() + 1) + '-'
        + this.fillZero(date.getDate()) + ' '
        + this.fillZero(date.getHours()) + ':'
        + this.fillZero(date.getMinutes()) + ':'
        + this.fillZero(date.getSeconds());
    },
    isDragonflyOrder(type){
      return (/X-M65|X-M66|X-M68/).test(type);
    },
    getMachinePicByType(type){
      let types = 'M62,M65,M66,M68,JK06,JK07,JK08,JK09,JK17,JK27,JK20,SCC318';
      if(types.includes(type)){
        return type;
      }else{
        return 'logo';
      }
    },

    //每隔4位插入一个-符号
    fmtActCode(code){
      let arr = new Array();
      for(let i = 0; i < code.length; i += 4){
        arr.push(code.substr(i, 4));
      }
      return arr.join('-');
    },

    getFmtDateStr(date){
      return date.getFullYear() + '-'
        + this.fillZero(date.getMonth() + 1) + '-'
        + this.fillZero(date.getDate());
    },

    getBeijingFmtTimeStr(date){
      let year = date.getUTCFullYear();
      let month = date.getUTCMonth();
      let day = date.getUTCDate();
      let hour = date.getUTCHours();
      let min = date.getUTCMinutes();
      let second = date.getUTCSeconds();
      let beijingDate = new Date(year, month, day, hour + 8, min, second);
      return this.getFmtTimeStr(beijingDate);
    },

    checkNull(arrs){
      for(let a of arrs){
        if(!a || !a.replace(/\s/g,'')){
          return true;
        }
      }
      return false;
    },

    checkPhone(phone){
      const cellphoneReg = /^1[345789]\d{9}$/;  //手机号
      const phoneReg = /^(0\d{2,3}-)?([2-9]\d{6,7})+(-\d{1,6})?$/;  //固定电话
      return (cellphoneReg.test(phone) || phoneReg.test(phone));
    },

    checkPwd(pwd){
      const pwdReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~,.:;@$!%*#?&+_=-])[A-Za-z\d~,.:;@$!%*#?&+_=-]{8,20}$/;  //密码为字母数字符号组成，长度至少8位
      return pwdReg.test(pwd);
    },

    checkDeviceFlag(flag){
      const reg = /^\d{3}$/;
      return reg.test(flag);
    },

    checkDeviceRegDay(regDay){
      const reg = /^([1-9]\d{0,3}|10000)$/;
      return reg.test(regDay);
    },

    checkPort(port){
      const reg = /^([1-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;  //端口范围1~65535
      return reg.test(port);
    },

    checkServer(server){
      const reg = /^[a-z]{2,5}:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/;
      return reg.test(server);
    },

    checkEmail(email){
      const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      return emailReg.test(email);
    },

    checkUsername(uname){
      const reg = /^[a-zA-Z0-9]{4,20}$/;
      return reg.test(uname);
    }

};


export default {
    install() {
      if (!Vue.$util) {
        Vue.$util = util;
      }
      Vue.mixin({
        created() {
          this.$util = Vue.$util;
        }
      });
    }
  };