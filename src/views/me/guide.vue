<template>
  <div>
    <user-info :data="userInfoDetail.userInfo"></user-info>
    <div>
      <cube-tab-bar
        v-model="selectedLabel"
        show-slider
        @click="handlerTabClick"
      >
        <cube-tab v-for="item in labels" :label="item" :key="item"
          ><span>{{ item }}</span></cube-tab
        >
      </cube-tab-bar>
      <cube-tab-panels v-model="selectedLabel">
        <cube-tab-panel label="发帖记录">
          <post-info :data="userInfoDetail.postInfo"></post-info>
        </cube-tab-panel>
        <cube-tab-panel label="评论记录">
          <comment-info :data="userInfoDetail.commentInfo"></comment-info>
        </cube-tab-panel>
        <cube-tab-panel label="回复记录">
          <reply-info :data="userInfoDetail.replyInfo"></reply-info>
        </cube-tab-panel>
      </cube-tab-panels>
    </div>
    <el-row
      style="margin: 1%"
      v-for="(item, index) in btn"
      :key="item.name"
    >
      <cube-button @click="handlerBtnClick(index)">{{ item.name }}</cube-button>
    </el-row>
  </div>
</template>

<script>
import { getUserInfoDetail } from '../../api/requsetMethods'
import userInfo from './components/userInfo.vue'
import CommentInfo from './components/commentInfo.vue'
import postInfo from './components/postInfo.vue'
import ReplyInfo from './components/replyInfo.vue'
export default {
  components: { userInfo, postInfo, CommentInfo, ReplyInfo },
  name: 'me-guide',
  data () {
    return {
      selectedLabel: '发帖记录',
      labels: ['发帖记录', '评论记录', '回复记录'],
      btn: [
        {
          name: '身份认证',
          pathName: 'me-certification'
        },
        {
          name: '设置',
          pathName: 'me-setting'
        }
      ],
      uid: localStorage.getItem('uid'),
      userInfoDetail: {
        userInfo: {},
        certificationInfo: {},
        postInfo: [],
        commentInfo: [],
        replyInfo: []
      }
    }
  },
  methods: {
    handlerBtnClick (index) {
      this.$router.push({ name: this.btn[index].pathName })
    },
    handlerTabClick (value) {
      this.selectedLabel = value
    }
  },
  created () {
    getUserInfoDetail(this.uid)
      .then(res => {
        console.log(res.data)
        const statusCode = res.data.status_code
        switch (statusCode) {
          case 331:
            console.log('成功', res.data)
            this.userInfoDetail = res.data
            break
          case 332:
            alert('获取用户数据失败')
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
