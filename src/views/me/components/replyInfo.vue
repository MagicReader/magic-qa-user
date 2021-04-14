<template>
  <cube-slide ref="slide" :auto-play="false" :data="data">
    <cube-slide-item
      v-for="(item, index) in data"
      :key="index"
      @click.native="clickHandler(item.post_id)"
    >
      <el-card style="margin:2%">
        <el-row>
          <div>
            <span> 回复 </span>
            <span v-if="item.to_name">{{ item.to_name }}</span>
            <span v-else>-</span>
            <span> ：</span>
          </div>
        </el-row>
        <el-row>
          <div>
            <span v-if="item.context">{{ item.context }}</span>
            <span v-else>-</span>
          </div>
        </el-row>
        <el-row>
          <div>
            <span v-if="item.time">{{ timestampToTime(item.time) }}</span>
            <span v-else>-</span>
          </div>
        </el-row>
      </el-card>
    </cube-slide-item>
  </cube-slide>
</template>

<script>
import time from '../../../mixins/time'
export default {
  name: 'me-replyInfo',
  mixins: [time],
  props: {
    data: {
      type: Array,
      required: true,
      default: null
    }
  },
  methods: {
    clickHandler (id) {
      this.$router.push({ path: '帖子的路径', query: { post_id: id } })
    }
  }
}
</script>

<style></style>
