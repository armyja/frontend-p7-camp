import store from './store'

const microApps = [
  {
    name: 'sub-vue',
    entry: process.env.VUE_APP_SUB_VUE,
    activeRule: '/',
    container: '#news-list',
    props: {
      routerBase: '/', // 下发基础路由
      getGlobalState: store.getGlobalState, // 下发getGlobalState方法
      setGlobalState: store.setGlobalState
    }
  },
  {
    name: 'sub-react',
    entry: process.env.VUE_APP_SUB_REACT,
    activeRule: '/',
    container: '#news-content',
    props: {
      routerBase: '/', // 下发基础路由
      getGlobalState: store.getGlobalState, // 下发getGlobalState方法
      setGlobalState: store.setGlobalState,
      registerListener: store.registerListener
    }
  }
]

export default microApps
