<template>
  <div>
    <el-page-header
      @back="goBack"
      content="身份认证页面"
      style="margin:1%"
    ></el-page-header>
    <el-card v-if="showInfo" style="margin:2%">
      <div>
        <div>
          <span>身份证号：</span>
          <span v-if="certificationInfo.id_number">{{
            certificationInfo.id_number
          }}</span>
          <span v-else>-</span>
        </div>
        <div>
          <span>真实姓名：</span>
          <span v-if="certificationInfo.real_name">{{
            certificationInfo.real_name
          }}</span>
          <span v-else>-</span>
        </div>
        <div>
          <span>所在学校：</span>
          <span v-if="certificationInfo.school">{{
            certificationInfo.school
          }}</span>
          <span v-else>-</span>
        </div>
        <div>
          <span>所读专业：</span>
          <span v-if="certificationInfo.major">{{
            certificationInfo.major
          }}</span>
          <span v-else>-</span>
        </div>
        <div>
          <span>手机号：</span>
          <span v-if="certificationInfo.phone_number">{{
            certificationInfo.phone_number
          }}</span>
          <span v-else>-</span>
        </div>
        <div>
          <span>认证照片：</span><br />
          <div style="text-align:center">
            <el-image
              style="width: 200px; height: 200px"
              :fit="fit"
              :src="certificationInfo.student_card_photo_src"
            >
            </el-image>
          </div>
        </div>
      </div>
      <div style="margin:1%">
        <div style="text-align:center" v-if="certificationInfo.state === 1">
          <span>只注册了手机号</span>
          <div style="margin:5%">
            <cube-button @click="showInfoUpload()">继续认证</cube-button>
          </div>
        </div>
        <div
          style="text-align:center"
          v-else-if="certificationInfo.state === 2"
        >
          <span>已上传信息，待管理员认证</span>
        </div>
        <div
          style="text-align:center"
          v-else-if="certificationInfo.state === 3"
        >
          <span>认证未通过，待重新认证</span>
          <div style="margin:5%">
            <cube-button @click="showInfoUpload()">重新认证</cube-button>
          </div>
        </div>
        <div
          style="text-align:center"
          v-else-if="certificationInfo.state === 4"
        >
          <span>认证成功</span>
        </div>
        <div style="text-align:center" v-else>
          <span>无认证信息</span>
        </div>
      </div>
    </el-card>
    <el-card v-else style="margin:2%">
      <div>
        <div style="margin:5%">
          <cube-validator
            :model="uploadData.id_number"
            :rules="rules.id_number"
          >
            <cube-input
              type="number"
              placeholder="身份证号"
              v-model="uploadData.id_number"
            ></cube-input>
          </cube-validator>
        </div>
        <div style="margin:5%">
          <cube-validator
            :model="uploadData.real_name"
            :rules="rules.real_name"
          >
            <cube-input
              placeholder="真实姓名"
              v-model="uploadData.real_name"
            ></cube-input>
          </cube-validator>
        </div>
        <div style="margin:5%">
          <cube-validator :model="uploadData.school" :rules="rules.school">
            <cube-input
              placeholder="所在学校"
              v-model="uploadData.school"
            ></cube-input>
          </cube-validator>
        </div>
        <div style="margin:5%">
          <cube-validator :model="uploadData.major" :rules="rules.major">
            <cube-input
              placeholder="所读专业"
              v-model="uploadData.major"
            ></cube-input>
          </cube-validator>
        </div>
        <div style="text-align:center">
          <el-upload
            class="avatar-uploader"
            action="https://pic.alexhchu.com/api/upload"
            name="image"
            :headers="header"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="uploadData.student_card_photo_src"
              :src="uploadData.student_card_photo_src"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div style="margin:2%">
          <cube-button :primary="true" @click="onClickSubmitHandler()"
            >确认上传</cube-button
          >
        </div>
        <div style="margin:2%">
          <cube-button :outline="true" @click="backToInfo()"
            >取消上传</cube-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { getCertificationInfo, certificate } from '../../api/requsetMethods'
export default {
  name: 'me-certification',
  data () {
    return {
      fit: 'fill',
      showInfo: true,
      showSetp1: true,
      certificationInfo: {
        certification_id: '',
        id_number: '',
        real_name: '',
        school: '',
        major: '',
        student_card_photo_src: '',
        state: '',
        phone_number: ''
      },
      uploadData: {
        uid: localStorage.getItem('uid'),
        id_number: undefined,
        real_name: undefined,
        school: undefined,
        major: undefined,
        student_card_photo_src: undefined
      },
      rules: {
        id_number: {
          required: true,
          type: 'number',
          len: 18
        },
        real_name: {
          required: true,
          type: 'string'
        },
        school: {
          required: true,
          type: 'string'
        },
        major: {
          required: true,
          type: 'string'
        }
      },
      header: {
        token: ''
      }
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      console.log('上传图片', res)
      switch (res.code) {
        case 200:
          this.uploadData.student_card_photo_src = URL.createObjectURL(file.raw)
          this.uploadData.student_card_photo_src = res.data.url
          console.log('图片地址：' + this.uploadData.student_card_photo_src)
          break
        default:
          this.$message.error('上传图片失败!')
          break
      }
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    goBack () {
      console.log('go back')
      this.$router.go(-1) // 返回上一层
    },
    showInfoUpload () {
      this.showInfo = false
    },
    backToInfo () {
      this.showInfo = true
    },
    onClickSubmitHandler () {
      certificate(this.uploadData)
        .then(res => {
          const statusCode = res.data.status_code
          switch (statusCode) {
            case 221:
              console.log('上传成功', res.data)
              break
            case 222:
              alert('上传失败')
              break
          }
        })
        .catch(error => {
          console.log('失败', error)
        })
    },
    getImgToken () { /** 参考API文档：https://pic.alexhchu.com/index/api.html **/
      const userData = {
        email: 'freedom_science@126.com',
        password: 'yanghui666'
      }
      const url = 'https://pic.alexhchu.com/api/token'
      axios.post(url, userData)
        .then(res => {
          switch (res.data.code) {
            case 200:
              console.log('获取图床Token成功', res.data)
              this.header.token = res.data.data.token
              break
            default:
              alert('获取图床Token失败:', res.data)
              break
          }
        })
        .catch(error => {
          console.log('失败', error)
        })
    }
  },
  created () {
    this.showInfo = true
    getCertificationInfo(localStorage.getItem('uid'))
      .then(res => {
        const statusCode = res.data.status_code
        switch (statusCode) {
          case 211:
            console.log('获取身份认证状态成功', res.data)
            this.certificationInfo = res.data.certificationInfo
            this.getImgToken()
            break
          case 212:
            alert('获取身份认证状态失败')
            break
        }
      })
      .catch(error => {
        console.log('失败', error)
      })
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
