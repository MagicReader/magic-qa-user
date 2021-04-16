<template>
  <div>
    <el-page-header
      @back="goBack"
      content="身份认证页面"
      style="margin:1%"
    ></el-page-header>
    <el-card
      v-if="showInfo"
      style="margin-top:40%;margin-left:2%;margin-right:2%"
    >
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
          <span v-if="certificationInfo.id_number">{{
            certificationInfo.id_number
          }}</span>
          <span v-else>-</span>
        </div>
        <div>
          <span>认证照片：</span><br />
          <div style="text-align:center">
            <el-image
              style="width: 250px; height: 250px"
              :fit="fit"
              :src="certificationInfo.student_card_photo_src"
            >
            </el-image>
          </div>
        </div>
      </div>
      <div style="margin:5%">
        <div style="text-align:center" v-if="certificationInfo.state === 1">
          <p>只注册了手机号</p>
          <div style="margin:5%">
            <cube-button @click="showSetp1 = true">继续上传</cube-button>
          </div>
        </div>
        <div
          style="text-align:center"
          v-else-if="certificationInfo.state === 2"
        >
          <p>已上传，待管理员认证</p>
        </div>
        <div
          style="text-align:center"
          v-else-if="certificationInfo.state === 3"
        >
          <p>认证失败，待重新上传</p>
          <div style="margin:5%">
            <cube-button @click="showSetp1 = true">重新上传</cube-button>
          </div>
        </div>
        <div
          style="text-align:center"
          v-else-if="certificationInfo.state === 4"
        >
          <p>认证成功</p>
        </div>
        <div style="text-align:center" v-else>
          <span>无认证信息</span>
        </div>
      </div>
    </el-card>
    <el-card v-else>
      <div v-if="showSetp1">
        <div style="margin:5%">
          <cube-validator
            :model="certificationInfo.id_number"
            :rules="rules.id_number"
          >
            <cube-input
              type="number"
              placeholder="身份证号"
              v-model="certificationInfo.id_number"
            ></cube-input>
          </cube-validator>
        </div>
        <div style="margin:5%">
          <cube-validator
            :model="certificationInfo.real_name"
            :rules="rules.real_name"
          >
            <cube-input
              placeholder="真实姓名"
              v-model="certificationInfo.real_name"
            ></cube-input>
          </cube-validator>
        </div>
        <div style="margin:5%">
          <cube-validator
            :model="certificationInfo.school"
            :rules="rules.school"
          >
            <cube-input
              placeholder="所在学校"
              v-model="certificationInfo.school"
            ></cube-input>
          </cube-validator>
        </div>
        <div style="margin:5%">
          <cube-validator :model="certificationInfo.major" :rules="rules.major">
            <cube-input
              placeholder="所读专业"
              v-model="certificationInfo.major"
            ></cube-input>
          </cube-validator>
        </div>
        <div style="margin:5%">
          <cube-button @click="showSetp1 = false">上传学生证照片</cube-button>
        </div>
      </div>
      <div v-else>
        <!-- 上传学生证照片 -->
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCertificationInfo, certificate } from '../../api/requsetMethods'
export default {
  name: 'me-certification',
  data () {
    return {
      fit: 'fill',
      showInfo: true,
      showSetp1: true,
      certificationInfo: {
        certification_id: undefined,
        id_number: undefined,
        real_name: undefined,
        school: undefined,
        major: undefined,
        student_card_photo_src: undefined,
        state: undefined,
        phone_number: undefined
      }
    }
  },
  methods: {
    goBack () {
      console.log('go back')
      this.$router.go(-1) // 返回上一层
    },
    uploadImg () {},
    onClickSubmitHandler () {
      certificate(this.certificationInfo)
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
    }
  },
  created () {
    getCertificationInfo(localStorage.getItem('uid'))
      .then(res => {
        const statusCode = res.data.status_code
        switch (statusCode) {
          case 211:
            console.log('获取身份认证状态成功', res.data)
            this.certificationInfo = res.data.certificationInfo
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

<style></style>
