<template>
  <div>
    <el-page-header @back="goBack" content="帖子详情页面" style="margin:1%"></el-page-header>
    <div class="view-wrapper">
      <div style="margin:2%">
        <div>
          <span>用户：</span>
          <span v-if="postInfoDetail.name">{{ postInfoDetail.name }}</span>
          <span v-else>-</span>
        </div>
        <div>
          <span>标题：</span>
          <span v-if="postInfoDetail.title">{{ postInfoDetail.title }}</span>
          <span v-else>-</span>
        </div>
        <div>
          <span v-if="postInfoDetail.context">{{
            postInfoDetail.context
          }}</span>
          <span v-else>-</span>
        </div>
        <div>
          <span v-if="postInfoDetail.time">{{
            timestampToTime(postInfoDetail.time)
          }}</span>
          <span v-else>-</span>
        </div>
      </div>
      <cube-recycle-list
        :size="queryForm.pageSize"
        :on-fetch="onFetch"
        :offset="offset"
      >
        <template slot="item" slot-scope="{ data }" class="card">
          <el-card style="margin:2%">
            <div @click="handleItemClick(data)">
              <el-row>
                <div>
                  <span>用户：</span>
                  <span v-if="data.name">{{ data.name }}</span>
                  <span v-else>-</span>
                </div>
              </el-row>
              <el-row>
                <div>
                  <span v-if="data.context">{{ data.context }}</span>
                  <span v-else>-</span>
                </div>
              </el-row>
              <el-row>
                <el-col :span="18">
                  <div>
                    <span v-if="data.time">{{
                      timestampToTime(data.time)
                    }}</span>
                    <span v-else>-</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <i class="cubeic-message" style="font-size: 16px"></i>
                  <span v-if="data.reply_number">{{ data.reply_number }}</span>
                  <span v-else>0</span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </template>
        <div slot="noMore" style="text-align: center">
          <span>没有更多数据了</span>
        </div>
      </cube-recycle-list>
    </div>
    <el-drawer title="写评论" :visible.sync="drawer" :direction="direction">
      <cube-textarea
        placeholder="内容"
        v-model="commentInfo.context"
        indicator="indicator"
      ></cube-textarea>
      <cube-button :primary="true" @click="handleSendCommentBtnClick"
        >发送</cube-button
      >
    </el-drawer>
    <div class="post_bottom">
      <cube-button @click="selectCommentState">评论</cube-button>
    </div>
  </div>
</template>

<script>
import {
  getCommentInfo,
  getPostInfoDetail,
  sendComment
} from '../../../api/requsetMethods'
import time from '../../../mixins/time'
export default {
  name: 'home-post-detail',
  mixins: [time],
  data () {
    return {
      commentInfo: {
        uid: localStorage.getItem('uid'),
        post_id: this.$route.query.post_id,
        context: '',
        state: ''
      },
      drawer: false,
      direction: 'btt',
      postInfoDetail: {
        post_id: '',
        name: '',
        title: '',
        context: '',
        time: '',
        state: ''
      },
      offset: 100,
      // 查询条件、分页信息
      queryForm: {
        post_id: this.$route.query.post_id,
        currentPage: 0,
        pageSize: 10
      }
    }
  },
  created () {
    getPostInfoDetail(this.queryForm.post_id)
      .then(res => {
        console.log(res.data)
        const statusCode = res.data.status_code
        switch (statusCode) {
          case 521:
            this.postInfoDetail = res.data.postInfoDetail
            break
          case 522:
            alert('获取帖子数据失败')
            break
        }
      })
      .catch(error => {
        console.log('失败', error)
      })
  },
  methods: {
    // 跳转到 评论详情 页面
    handleItemClick (data) {
      this.$router.push({
        name: 'home-post-commentDetail',
        params: { commentInfo: data }
      })
    },
    handleSendCommentBtnClick () {
      this.drawer = false
      sendComment(this.commentInfo)
        .then(res => {
          console.log(res.data)
          const statusCode = res.data.status_code
          switch (statusCode) {
            case 571:
              console.log('评论发布成功')
              break
            case 572:
              alert('数据库插入失败')
              break
            case 573:
              alert('其他原因失败')
              break
            case 574:
              alert('未认证，无发言资格')
              break
          }
        })
        .catch(error => {
          console.log('失败', error)
        })
    },
    selectCommentState () {
      this.$createActionSheet({
        title: '选择发言身份',
        pickerStyle: true,
        data: [
          {
            content: '纯匿名'
          },
          {
            content: '展示学校'
          },
          {
            content: '实名'
          }
        ],
        onSelect: (item, index) => {
          this.$createToast({
            txt: `发言身份： ${item.content}`,
            type: 'correct',
            time: 1000
          }).show()
          this.commentInfo.state = index + 1
          this.drawer = true
        }
      }).show()
    },
    goBack () {
      console.log('go back')
      this.$router.go(-1) // 返回上一层
    },
    onFetch () {
      this.queryForm.currentPage += 1
      // 请求 pageSize 条数据
      return new Promise(resolve => {
        getCommentInfo(this.queryForm)
          .then(res => {
            console.log(res.data)
            const statusCode = res.data.status_code
            switch (statusCode) {
              case 531:
                resolve(res.data.commentInfo)
                break
              case 532:
                alert('获取评论数据失败')
                break
            }
          })
          .catch(error => {
            console.log('失败', error)
          })
      })
    }
  }
}
</script>

<style>
/* 限制视口 包裹组件*/
.view-wrapper {
  position: absolute;
  top: 6%;
  left: 0;
  bottom: 14%;
  width: 100%;
}
.post_bottom {
  position: absolute;
  top: 92%;
  left: 0;
  bottom: 8%;
  width: 100%;
}
</style>
