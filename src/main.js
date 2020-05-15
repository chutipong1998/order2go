// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import PageNotFound from '@/components/PageNotFound'
import VueScrollactive from 'vue-scrollactive'
import FixedHeader from 'vue-fixed-header'
import VueCookies from 'vue-cookies'
import { ContentLoader } from 'vue-content-loader'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import VueTheMask from 'vue-the-mask'
import store from '@/store/store'
import * as VueGoogleMaps from 'vue2-google-maps'

require('@/assets/css/main.css')
require('@/assets/js/config')
require('buefy/dist/buefy.css')

Vue.config.productionTip = false
Vue.prototype.liff = window.liff

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCWNGcpof-F2AOdTHKAnoXKbtbCQ7_k6rM',
    libraries: 'places'
  },
  installComponents: true
})

Vue.use(Vuex)
Vue.use(VueResource)
Vue.use(VueScrollactive)
Vue.use(VueCookies)
Vue.use(VueTheMask)

Vue.component('page-not-found', PageNotFound)
Vue.component('content-loader', ContentLoader)
Vue.component('fixed-header', FixedHeader)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
