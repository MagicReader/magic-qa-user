<template>
  <div>
    <!-- 头部 搜索栏 -->
    <div class="header">
      <el-row style="margin:2%">
        <el-col :span="14">
          <el-input
            placeholder="关键词"
            v-model="queryForm.name"
            @keypress.native.enter="handleSearchBtnClick"
            size="small"
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            plain
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleSearchBtnClick"
          ></el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            plain
            type="primary"
            icon="el-icon-s-promotion"
            size="small"
            circle
            @click="selectPostState"
          ></el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            plain
            type="primary"
            icon="el-icon-refresh-right"
            size="small"
            circle
            @click="handleRefreshBtnClick"
          ></el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 主体 -->
    <div class="view-wrapper">
      <cube-recycle-list
        class="list"
        :size="queryForm.pageSize"
        :on-fetch="onFetch"
        :offset="offset"
      >
        <template slot="item" slot-scope="{ data }" class="card">
          <el-card style="margin:2%">
            <div
              :id="data.id"
              class="item"
              @click="handleItemClick(data.post_id)"
            >
              <el-row>
                <div>
                  <span>用户：</span>
                  <span v-if="data.name">{{ data.name }}</span>
                  <span v-else>-</span>
                </div>
              </el-row>
              <el-row>
                <div>
                  <span>标题：</span>
                  <span v-if="data.title">{{ data.title }}</span>
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
                  <span v-if="data.comment_number">{{
                    data.comment_number
                  }}</span>
                  <span v-else>0</span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </template>
        <!-- <div slot="spinner">Loading Data</div> -->
        <div slot="noMore" style="text-align: center">
          <span>没有更多数据了</span>
        </div>
      </cube-recycle-list>
    </div>
    <el-drawer title="发帖" :visible.sync="drawer" :direction="direction">
      <cube-input placeholder="标题" v-model="postInfo.title"></cube-input>
      <cube-textarea
        placeholder="内容"
        v-model="postInfo.context"
        indicator="indicator"
      ></cube-textarea>
      <cube-button :primary="true" @click="handleSendPostBtnClick"
        >发送</cube-button
      >
    </el-drawer>
  </div>
</template>

<script>
import { getPostInfo, sendPost } from '../../../api/requsetMethods'
import time from '../../../mixins/time'
export default {
  name: 'home-post-list',
  mixins: [time],
  data () {
    return {
      postInfo: {
        uid: localStorage.getItem('uid'),
        title: '',
        context: '',
        state: ''
      },
      indicator: {
        negative: true,
        remain: true
      },
      drawer: false,
      direction: 'btt',
      offset: 100,
      // 查询条件、分页信息
      queryForm: {
        keyword: '',
        currentPage: 0,
        pageSize: 10
      }
    }
  },
  methods: {
    selectPostState () {
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
          this.postInfo.state = index
          this.drawer = true
        }
      }).show()
    },
    // 跳转到 帖子详情 页面
    handleItemClick (id) {
      this.$router.push({
        name: 'home-post-detail',
        query: { post_id: id }
      })
    },
    // 处理搜索按钮点击事件
    async handleSearchBtnClick () {
      this.onFetch()
    },
    // 处理刷新按钮点击事件
    async handleRefreshBtnClick () {
      this.queryForm.keyword = ''
      this.queryForm.currentPage = 0
      this.queryForm.pageSize = 10
      this.onFetch()
    },
    // 发送新帖子
    handleSendPostBtnClick () {
      console.log('发送新帖子')
      sendPost(this.postInfo)
        .then(res => {
          console.log(res.data)
          const statusCode = res.data.status_code
          switch (statusCode) {
            case 561:
              console.log('发帖成功')
              break
            case 562:
              alert('数据库插入失败')
              break
            case 563:
              alert('其他原因失败')
              break
            case 564:
              alert('未认证，无发言资格')
              break
          }
        })
        .catch(error => {
          console.log('失败', error)
        })
    },
    onFetch () {
      this.queryForm.currentPage += 1
      // 请求 pageSize 条数据
      return new Promise(resolve => {
        getPostInfo(this.queryForm)
          .then(res => {
            console.log(res.data)
            const statusCode = res.data.status_code
            switch (statusCode) {
              case 511:
                resolve(res.data.postInfo)
                break
              case 512:
                alert('获取帖子数据失败')
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
.header {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 90%;
  width: 100%;
}
.view-wrapper {
  position: absolute;
  top: 10%;
  left: 0;
  bottom: 8%;
  width: 100%;
}
</style>
