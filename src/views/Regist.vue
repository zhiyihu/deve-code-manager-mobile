<template>
<div class="regist-main">
    <div style="height: 20px;"></div>
    <div class="login-head">
        <img src="../assets/logo.png"/>
        <span>注册码管理系统</span>
    </div>
    <div class="regist-form">
        <div></div>
        <div class="regist-head">用户注册</div>
        <a-form :form="form" @submit="handleSubmit" style="width: 460px; margin: auto">
            <a-form-item v-bind="formItemLayout">
                <span slot="label"> 用户名 </span>
                <a-input autocomplete="off" v-decorator="[
          'username',
          {
            rules: [
              { required: true, message: '请输入用户名', whitespace: false },
            ],
          },
        ]" />
            </a-form-item>
            <a-form-item v-bind="formItemLayout">
                <span slot="label">姓名</span>
                <a-input autocomplete="off" v-decorator="[
          'nickname',
          {
            rules: [
              { required: true, message: '请输入用户名', whitespace: false },
            ],
          },
        ]" />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="手机号">
                <a-input autocomplete="off" v-decorator="[
          'phone',
          {
            rules: [{ required: true, message: '请输入手机号!' },{validator: validatePhoneNum,},],
          },
        ]" style="width: 100%">
                </a-input>
            </a-form-item>
            <a-form-item label="公司名称" v-bind="formItemLayout">
                <a-select v-decorator="[
          'company',
          { rules: [{ required: true, message: '请选择公司' }] },
        ]">
                    <a-select-option value="1"> 北斗星通 </a-select-option>
                    <a-select-option value="2"> 和芯星通 </a-select-option>
                    <a-select-option value="3"> 南方测绘 </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="邮箱">
                <a-input autocomplete="off" v-decorator="[
          'email',
          {
            rules: [
              {
                type: 'email',
                message: '不合法的邮箱地址',
              },
              {
                required: true,
                message: '请输入邮箱地址',
              },
            ],
          },
        ]" />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="密码" has-feedback>
                <a-input v-decorator="[
          'password',
          {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
              {
                validator: validateToNextPassword,
              },
            ],
          },
        ]" type="password" />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="确认密码" has-feedback>
                <a-input v-decorator="[
          'confirm',
          {
            rules: [
              {
                required: true,
                message: '请确认你的密码',
              },
              {
                validator: compareToFirstPassword,
              },
            ],
          },
        ]" type="password" @blur="handleConfirmBlur" />
            </a-form-item>
            <a-form-item v-bind="tailFormItemLayout">
                <a-button type="primary" html-type="submit" style="width: 130px;">注册</a-button>
            </a-form-item>
        </a-form>
        <div style="height: 2px;"></div>
        <div class="bottom-regist-line">
			<span>已有帐户，前往<a href="javascript:;"><router-link to='/login'>登录</router-link></a></span>
		</div>
    </div>
    <div class="foot-copy">Copyright&nbsp;&copy;&nbsp;Guangzhou&nbsp;Devecent&nbsp;Company</div>
    <div style="height: 20px;"></div>
</div>
</template>

<script>
export default {
    data() {
        return {
            confirmDirty: false,
            autoCompleteResult: [],
            formItemLayout: {
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 4
                    },
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 20
                    },
                },
            },
            tailFormItemLayout: {
                wrapperCol: {
                    xs: {
                        span: 24,
                        offset: 0,
                    },
                    sm: {
                        span: 16,
                        offset: 8,
                    },
                },
            },
        };
    },
    beforeCreate() {
        this.form = this.$form.createForm(this, {
            name: "register"
        });
    },
    methods: {
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log("Received values of form: ", values);
                }
            });
        },
        handleConfirmBlur(e) {
            const value = e.target.value;
            this.confirmDirty = this.confirmDirty || !!value;
        },
        compareToFirstPassword(rule, value, callback) {
            const form = this.form;
            if (value && value !== form.getFieldValue("password")) {
                callback("两次密码不一致");
            } else {
                callback();
            }
        },
        validatePhoneNum(rule, value, callback) {
            const reg = (/^(1[3456789]\d{9})$/);
            if (value && !reg.test(value)) {
                callback("不合法的手机号");
            } else {
                callback();
            }
        },
        validateToNextPassword(rule, value, callback) {
            const form = this.form;
            if (value && this.confirmDirty) {
                form.validateFields(["confirm"], {
                    force: true
                });
            }
            if (value && value.length < 8) {
                callback('密码长度小于8');
            }
            callback();
        },
        handleWebsiteChange(value) {
            let autoCompleteResult;
            if (!value) {
                autoCompleteResult = [];
            } else {
                autoCompleteResult = [".com", ".org", ".net"].map(
                    (domain) => `${value}${domain}`
                );
            }
            this.autoCompleteResult = autoCompleteResult;
        },
    },
};
</script>

<style>
.regist-main {
    background: #f0f2f5;
    min-height: 100vh;
    position: relative;
}

.regist-form {
    background: white;
    width: 580px;
    margin: auto;
    margin-top: 10px;
    box-shadow: 0 7px 25px rgba(0, 0, 0, .08);
    border-radius: 6px;
    padding-top: 14px;
    position: relative;
}
.regist-head{
    text-align: center;
    margin-bottom: 14px;
    font-size: 20px;
}
.bottom-regist-line{
    width: 300px;
    color: #999;
    font-size: 16px;
    position: absolute;
    bottom: 36px;
    left: 390px;
}

.bottom-regist-line a{
    color: #1890ff;
    font-weight: bolder;
}
</style>
