<template>
  <div>
    <div class="login-box">
      <el-form ref="loginForm" :model="form" :rules="rules">
        <h3 class="login-title">用户 登录</h3>
        <el-form-item label="账号:" prop="name">
          <el-input type="text" placeholder="请输入账号" v-model="form.name" />
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="form.password"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="onSubmit('loginForm')" style="width:100%"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <div style=" text-align: center">
        <el-button type="text" v-on:click="onClickRegisterBtn()"
          >注册</el-button
        >
        <el-button type="text" v-on:click="onClickForgetBtn()"
          >忘记密码</el-button
        >
      </div>
    </div>
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <span>请输入账号和密码</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { login } from '../api/requsetMethods'
export default {
  name: 'login',
  data () {
    return {
      form: {
        name: '',
        password: ''
      },

      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        name: [{ required: true, message: '账号不可为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不可为空', trigger: 'blur' }]
      },

      // 对话框显示和隐藏
      dialogVisible: false
    }
  },
  methods: {
    onClickForgetBtn () {
      alert('功能待开发...')
    },
    onClickRegisterBtn () {
      this.$router.push({ name: 'register' })
    },
    onSubmit (formName) {
      // 为表单绑定验证功能
      this.$refs[formName].validate(valid => {
        if (valid) {
          login(this.form)
            .then(res => {
              const statusCode = res.data.status_code
              switch (statusCode) {
                case 141:
                  console.log('成功', res.data)
                  localStorage.setItem('accessToken', res.data.accessToken)
                  localStorage.setItem('refreshToken', res.data.refreshToken)
                  localStorage.setItem('tokenType', 'accessToken')
                  localStorage.setItem('uid', res.data.uid)
                  this.$router.push('/')
                  break
                case 142:
                  alert('用户名或密码错误')
                  localStorage.removeItem('uid', 'tokenType', 'refreshToken', 'accessToken')
                  break
                case 143:
                  alert('其他原因失败')
                  localStorage.removeItem('uid', 'tokenType', 'refreshToken', 'accessToken')
                  break
              }
            })
            .catch(error => {
              console.log('失败', error)
            })
        } else {
          this.dialogVisible = true
          return false
        }
      })
    }
  }
}
</script>

<style>
.login-box {
  border: 1px solid #dcdfe6;
  width: 80%;
  margin: 10% auto;
  padding: 5% 5% 5% 5%;
  box-shadow: 0 0 25px #909399;
}

.login-title {
  text-align: center;
  margin: 0 auto 10% auto;
  color: #303133;
}
</style>
