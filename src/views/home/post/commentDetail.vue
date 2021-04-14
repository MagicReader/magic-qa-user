<template>
  <div>
    <el-page-header @back="goBack" content="评论详情页面"></el-page-header>
    <div class="view-wrapper">
      <div style="margin:2%">
        <div>
          <span>用户：</span>
          <span v-if="commentInfo.name">{{ commentInfo.name }}</span>
          <span v-else>-</span>
        </div>
        <div>
          <span v-if="commentInfo.context">{{ commentInfo.context }}</span>
          <span v-else>-</span>
        </div>
        <el-row>
          <el-col :span="18">
            <div>
              <span v-if="commentInfo.time">{{
                timestampToTime(commentInfo.time)
              }}</span>
              <span v-else>-</span>
            </div>
          </el-col>
          <el-col :span="4">
            <el-button type="text" @click="handleItemClick(1, commentInfo)"
              ><span>回复</span></el-button
            >
          </el-col>
        </el-row>
      </div>
      <cube-recycle-list
        :size="queryForm.pageSize"
        :on-fetch="onFetch"
        :offset="offset"
      >
        <template slot="item" slot-scope="{ data }" class="card">
          <el-card style="margin:2%">
            <div>
              <el-row>
                <div>
                  <span v-if="data.from_name">{{ data.from_name }}</span>
                  <span v-else>-</span>
                  <span> 回复 </span>
                  <span v-if="data.to_name">{{ data.to_name }}</span>
                  <span v-else>-</span>
                  <span>：</span>
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
                <el-col :span="4">
                  <el-button type="text" @click="handleItemClick(2, data)"
                    ><span> 回复 </span></el-button
                  >
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
    <el-drawer title="写回复" :visible.sync="drawer" :direction="direction">
      <cube-textarea
        placeholder="内容"
        v-model="replyInfo.context"
        indicator="indicator"
      ></cube-textarea>
      <cube-button :primary="true" @click="handleSendReplyBtnClick"
        >发送</cube-button
      >
    </el-drawer>
  </div>
</template>

<script>
import { getReplyInfo, sendReply } from '../../../api/requsetMethods'
import time from '../../../mixins/time'
export default {
  name: 'home-post-commentDetail',
  mixins: [time],
  data () {
    return {
      replyInfo: {
        from_uid: localStorage.getItem('uid'),
        to_uid: '',
        comment_id: this.$route.params.commentInfo.comment_id,
        context: '',
        from_state: '',
        to_state: ''
      },
      commentInfo: {
        comment_id: this.$route.params.commentInfo.comment_id,
        uid: this.$route.params.commentInfo.uid,
        name: this.$route.params.commentInfo.name,
        context: this.$route.params.commentInfo.context,
        time: this.$route.params.commentInfo.time,
        reply_number: this.$route.params.commentInfo.reply_number,
        state: this.$route.params.commentInfo.state
      },
      drawer: false,
      direction: 'btt',
      offset: 100,
      // 查询条件、分页信息
      queryForm: {
        comment_id: this.$route.params.commentInfo.comment_id,
        currentPage: 0,
        pageSize: 10
      }
    }
  },
  methods: {
    handleItemClick (flag, data) {
      console.log('dsad', this.commentInfo)
      switch (flag) {
        case 1:
          this.replyInfo.to_uid = data.uid
          this.replyInfo.to_state = data.state
          break
        case 2:
          this.replyInfo.to_uid = data.to_uid
          this.replyInfo.to_state = data.to_state
          break
      }
      this.selectReplyState()
    },
    handleSendReplyBtnClick () {
      this.drawer = false
      sendReply(this.replyInfo)
        .then(res => {
          console.log(res.data)
          const statusCode = res.data.status_code
          switch (statusCode) {
            case 581:
              console.log('评论发布成功')
              break
            case 582:
              alert('数据库插入失败')
              break
            case 583:
              alert('其他原因失败')
              break
            case 584:
              alert('未认证，无发言资格')
              break
          }
        })
        .catch(error => {
          console.log('失败', error)
        })
    },
    selectReplyState () {
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
          this.replyInfo.from_state = index + 1
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
        getReplyInfo(this.queryForm)
          .then(res => {
            console.log(res.data)
            const statusCode = res.data.status_code
            switch (statusCode) {
              case 541:
                console.log(res.data.replyInfo)
                resolve(res.data.replyInfo)
                break
              case 542:
                alert('无Id参数')
                break
              case 543:
                alert('获取回复数据失败')
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
  bottom: 8%;
  width: 100%;
}
</style>
