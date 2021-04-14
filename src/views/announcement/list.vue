<template>
  <div>
    <cube-recycle-list
      :size="queryForm.pageSize"
      :on-fetch="onFetch"
      :offset="offset"
    >
      <template slot="item" slot-scope="{ data }">
        <el-card style="margin:1%">
          <div :id="data.announcement_id" @click="handleClick(data)">
            <el-row style="margin:2%">
              <el-col :span="12">
                <div>
                  <span v-if="data.title">{{
                    data.title
                  }}</span>
                  <span v-else>-</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div>
                  <span v-if="data.time">{{
                    timestampToTime(data.time)
                  }}</span>
                  <span v-else>-</span>
                </div>
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
</template>

<script>
import { getAnnouncement } from '../../api/requsetMethods'
import time from '../../mixins/time'
export default {
  name: 'announcement-list',
  mixins: [time],
  data () {
    return {
      offset: 100,
      queryForm: {
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
        getAnnouncement(this.queryForm)
          .then(res => {
            console.log(res.data)
            const statusCode = res.data.status_code
            switch (statusCode) {
              case 411:
                resolve(res.data.announcementInfo)
                break
              case 412:
                alert('获取公告数据失败')
                break
            }
          })
          .catch(error => {
            console.log('失败', error)
          })
      })
    },
    handleClick (data) {
      console.log('JUMP announcement_id:' + data.announcement_id)
      this.$router.push({
        name: 'announcement-detail',
        query: { announcement_id: data.announcement_id }
      })
    }
  }
}
</script>

<style>
</style>
