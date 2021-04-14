<template>
  <div>
    <router-view class="body"></router-view>
    <cube-tab-bar
      class="footer"
      v-model="selectedLabel"
      show-slider
      @click="clickHandler"
    >
      <cube-tab
        v-for="item in tabs"
        :label="item.label"
        :key="item.label"
      >
        <!-- name为icon的插槽 -->
        <i slot="icon" :class="item.icon"></i>
        <!-- 默认插槽 -->
        <span>{{ item.label }}</span>
      </cube-tab>
    </cube-tab-bar>
  </div>
</template>

<script>
export default {
  name: 'navigation',
  data () {
    return {
      selectedLabel: '主页',
      tabs: [
        {
          label: '主页',
          icon: 'cubeic-home'
        },
        {
          label: '公告',
          icon: 'cubeic-notification'
        },
        {
          label: '消息',
          icon: 'cubeic-message'
        },
        {
          label: '我',
          icon: 'cubeic-person'
        }
      ]
    }
  },
  methods: {
    clickHandler (label) {
      this.updateTab(label)
    },
    changeHandler (label) {
      this.updateTab(label)
    },
    updateTab (label) {
      this.selectedLabelSlots = label
      switch (label) {
        case '主页':
          this.$router.push({ name: 'home-index' })
          break
        case '公告':
          this.$router.push({ name: 'announcement-index' })
          break
        case '消息':
          this.$router.push({ name: 'message' })
          break
        case '我':
          this.$router.push({ name: 'me-index' })
          break
      }
    }
  }
}
</script>

<style>
.body {
  background-color: #e9eef3;
  color: #333;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 8%;
}
.footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 92%;
  bottom: 0;
}
span {
  font-size: 15px;
}
</style>
