<template>
  <div>
    <el-page-header
      @back="goBack"
      content="公告详情页面"
      style="margin:1%"
    ></el-page-header>
    <div style="margin:2%">
      <el-row>
        <div>
          <span>发布人：</span>
          <span v-if="announcementInfoDetail.name">{{
            announcementInfoDetail.name
          }}</span>
          <span v-else>-</span>
        </div>
      </el-row>
      <el-row>
        <div>
          <span>公告标题：</span>
          <span v-if="announcementInfoDetail.title">{{
            announcementInfoDetail.title
          }}</span>
          <span v-else>-</span>
        </div>
      </el-row>
      <el-row>
        <div>
          <span>发布时间：</span>
          <span v-if="announcementInfoDetail.time">{{
            timestampToTime(announcementInfoDetail.time)
          }}</span>
          <span v-else>-</span>
        </div>
      </el-row>
      <el-row>
        <div>
          <span>公告内容：</span>
          <span v-if="announcementInfoDetail.context">{{
            announcementInfoDetail.context
          }}</span>
          <span v-else>-</span>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getAnnouncementDetail } from '../../api/requsetMethods'
import time from '../../mixins/time'
export default {
  name: 'announcement-detail',
  mixins: [time],
  data () {
    return {
      queryForm: {
        announcement_id: this.$route.query.announcement_id
      },
      announcementInfoDetail: {
        name: '',
        title: '',
        context: '',
        time: ''
      }
    }
  },
  created () {
    getAnnouncementDetail(this.queryForm)
      .then(res => {
        console.log(res.data)
        const statusCode = res.data.status_code
        switch (statusCode) {
          case 421:
            this.announcementInfoDetail = res.data.announcementInfoDetail
            break
          case 422:
            alert('获取用户数据失败')
            break
        }
      })
      .catch(error => {
        console.log('失败', error)
      })
  },
  methods: {
    goBack () {
      console.log('go back')
      this.$router.go(-1) // 返回上一层
    }
  }
}
</script>

<style></style>
