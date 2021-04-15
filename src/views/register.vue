<template>
  <el-card style="margin-top:50%;margin-left:2%;margin-right:2%">
    <div style="text-align:center">用户注册</div>
    <div v-if="showSetp1">
      <div style="margin:5%">
        <cube-validator :model="registerInfo.name" :rules="rules.name">
          <cube-input
            placeholder="用户名"
            v-model="registerInfo.name"
          ></cube-input>
        </cube-validator>
      </div>
      <div style="margin:5%">
        <cube-validator
          :model="registerInfo.phone_number"
          :rules="rules.phone_number"
        >
          <cube-input
            type="number"
            placeholder="手机号"
            v-model="registerInfo.phone_number"
          ></cube-input>
        </cube-validator>
      </div>
      <div style="margin:5%">
        <cube-button @click="nextStep()">下一步</cube-button>
      </div>
    </div>
    <div v-else>
      <div style="margin:5%">
        <cube-validator :model="registerInfo.code" :rules="rules.code">
          <cube-input
            type="number"
            placeholder="短信验证码"
            v-model="registerInfo.code"
          ></cube-input>
        </cube-validator>
      </div>
      <div style="margin:5%">
        <cube-validator :model="registerInfo.password" :rules="rules.password">
          <cube-input
            type="password"
            placeholder="密码"
            :eye="eye"
            v-model="registerInfo.password"
          ></cube-input>
        </cube-validator>
      </div>
      <div style="margin:5%">
        <cube-button @click="lastStep()">上一步</cube-button>
      </div>
      <div style="margin:5%">
        <cube-button @click="finalStep()">完成注册</cube-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { register } from '../api/requsetMethods'
export default {
  name: 'register',
  data () {
    return {
      eye: {
        open: true,
        reverse: false
      },
      showSetp1: true,
      registerInfo: {
        name: undefined,
        password: undefined,
        phone_number: undefined,
        code: undefined
      },
      rules: {
        name: {
          required: true,
          type: 'string'
        },
        password: {
          required: true,
          type: 'string'
        },
        phone_number: {
          required: true,
          type: 'tel'
        },
        code: {
          required: true,
          type: 'number',
          len: 4
        }
      }
    }
  },
  methods: {
    nextStep () {
      // register/1
      register(this.registerInfo, 1)
        .then(res => {
          const statusCode = res.data.status_code
          switch (statusCode) {
            case 111:
              console.log('正确', res.data)
              this.showSetp1 = false
              break
            case 112:
              alert('已存在相同用户名')
              break
            case 113:
              alert('已存在相同手机号')
              break
            case 114:
              alert('手机验证码缓存失败')
              break
            case 115:
              alert('短信发送失败')
              break
            case 116:
              alert('其他原因检查失败')
              break
          }
        })
        .catch(error => {
          console.log('失败', error)
        })
    },
    lastStep () {
      this.showSetp1 = true
    },
    finalStep () {
      // register/2
      register(this.registerInfo, 2)
        .then(res => {
          const statusCode = res.data.status_code
          switch (statusCode) {
            case 121:
              console.log('手机号验证成功', res.data)
              // register/3
              register(this.registerInfo, 3)
                .then(res => {
                  const statusCode = res.data.status_code
                  switch (statusCode) {
                    case 131:
                      console.log('注册成功', res.data)
                      alert('注册成功,转跳登录页面...')
                      this.$router.push({ name: 'login' })
                      break
                    case 132:
                      alert('新建用户失败')
                      break
                    case 133:
                      alert('登记手机号失败')
                      break
                    case 134:
                      alert('其他原因导致注册失败')
                      break
                  }
                })
                .catch(error => {
                  console.log('失败', error)
                })
              break
            case 122:
              alert('验证码不存在或超时')
              break
            case 123:
              alert('已存在相同手机号')
              break
          }
        })
        .catch(error => {
          console.log('失败', error)
        })
    }
  }
}
</script>

<style></style>
