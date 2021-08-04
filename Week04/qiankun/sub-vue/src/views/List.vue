<template>
  <div class="home">
    <div v-for="item in list" :key="item.link" class="card" scope="item" @click="handleClick(item)">
      {{item.title}}
    </div>
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
// @ is an alias to /src
import { fetch } from '@/core'
import store from '@/store'
export default {
  name: 'List',
  components: {
  },
  data () {
    return {
      list: [
        {
          link: 1,
          title: '22'
        },
        {
          link: 2,
          title: '22'
        }
      ]
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      console.log('init')
      fetch('ithome/ithome/rss/').then(res => {
        this.list = res
      })
        .catch(error => {
          console.log(error)
        })
    },
    handleClick (item) {
      store.commit('global/setGlobalState', { content: item })
      store.commit('global/emitGlobalState', { content: item })
    }
  }
}
</script>
<style scoped>
.card {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  margin: 8px 0;
  min-height: 40px;
  box-shadow: 0px 8px 60px -10px rgba(13,28,39,0.6);
  background: #fff;
  border-radius: 12px;
  max-width: 700px;
  cursor: pointer;
  position: relative;
}
</style>
