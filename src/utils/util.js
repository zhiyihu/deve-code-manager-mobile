import Vue from 'vue';

const util = {
    fillZero(num) {
        return (num < 10 ? '0' : '') + num;
    },
    getFmtTimeStr(date) {
        return date.getFullYear() + '-'
        + this.fillZero(date.getMonth() + 1) + '-'
        + this.fillZero(date.getDate()) + ' '
        + this.fillZero(date.getHours()) + ':'
        + this.fillZero(date.getMinutes()) + ':'
        + this.fillZero(date.getSeconds());
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