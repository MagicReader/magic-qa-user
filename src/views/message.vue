<template>
  <div class="view-wrapper">
    <cube-recycle-list
      class="list"
      :size="queryForm.pageSize"
      :on-fetch="onFetch"
      :offset="offset"
    >
      <template slot="item" slot-scope="{ data }" class="card">
        <el-card style="margin:2%">
          <div :id="data.id" class="item" @click="handleClick(data)">
            <el-row>
              <el-col :span="12">
                <div>
                  <span>标题:</span>
                  <span v-if="data.post_title">{{ data.post_title }}</span>
                  <span v-else>-</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div>
                  <span v-if="data.time">{{ timestampToTime(data.time) }}</span>
                  <span v-else>-</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <div>
                <span>用户：</span>
                <span v-if="data.from_name">{{ data.from_name }}</span>
                <span v-else>-</span>
              </div>
            </el-row>
            <el-row>
              <div>
                <span v-if="data.infoType==='reply'"> 回复</span>
                <span v-else-if="data.infoType==='comment'"> 评论</span>
                <span v-else>-</span>
                <span>：</span>
                <span v-if="data.context">{{ data.context }}</span>
                <span v-else>-</span>
              </div>
            </el-row>
          </div>
        </el-card>
      </template>
      <!-- <div slot="spinner">Loading Data</div> -->
      <div slot="noMore" style="text-align: center"><span>没有更多数据了</span></div>
    </cube-recycle-list>
  </div>
</template>

<script>
import { getMessageInfo } from '../api/requsetMethods'
import time from '../mixins/time'
export default {
  name: 'message',
  mixins: [time],
  data () {
    return {
      offset: 100,
      queryForm: {
        uid: localStorage.getItem('uid'),
        currentPage: 0,
        pageSize: 10
      }
    }
  },
  methods: {
    onFetch () {
      this.queryForm.currentPage += 1
      // 请求 pageSize 条数据
      return new Promise(resolve => {
        getMessageInfo(this.queryForm)
          .then(res => {
            console.log(res.data)
            const statusCode = res.data.status_code
            switch (statusCode) {
              case 551:
                resolve(res.data.messageInfo)
                break
              case 552:
                alert('获取消息数据失败')
                break
            }
          })
          .catch(error => {
            console.log('失败', error)
          })
      })
    },
    handleClick (data) {
      console.log('Item:' + data)
    }
  }
}
</script>

<style>
/* 限制视口 包裹组件*/
.view-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 8%;
  width: 100%;
}
</style>
