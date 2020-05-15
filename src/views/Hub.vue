<template>
  <div class="page">
    <!-- LOADING VIEW -->
    <div v-if='status === 0'>
      <div class="container">
        <content-loader :width=500 :height=900>
          <rect x="16" y="80" rx="8" ry="8" width="100" height="40" />
          <template v-for="i in 5">
            <rect x="16" :y="150+(150*(i-1))" rx="8" ry="8" width="100" height="100" :key="i*8+0" />
            <rect x="132" :y="150+(150*(i-1))" rx="8" ry="8" width="220" height="20" :key="i*8+1" />
            <rect x="132" :y="180+(150*(i-1))" rx="8" ry="8" width="140" height="20" :key="i*8+2" />
            <rect x="132" :y="230+(150*(i-1))" rx="8" ry="8" width="80" height="20" :key="i*8+3" />
            <rect x="340" :y="230+(150*(i-1))" rx="8" ry="8" width="80" height="20" :key="i*8+4" />
          </template>
        </content-loader>
      </div>
    </div>

    <!-- CONTENT VIEW -->
    <div v-else-if='status === 200'>
      <!-- CONTENT -->
      <section class="section display pd-l-0 pd-r-0">
        <div class="columns columns-item-title column is-mobile title-main mg-b-0">
            <div class="column pd-r-0 pd-t-0 pd-b-0">
              <h1 class='text-align-left'>ร้านค้า</h1>
            </div>
        </div>
        <section class="section display-list pd-0" v-for="(shop, i) in shops" :key='i' :id="whiteSpace(shop.name)">
          <a class="columns is-mobile columns-item-content" v-on:click='onSelectedShop(i)'>
            <div class="menu-img" v-show="is_visible_image">
              <template v-if="trimSpace(shop.image_url) !== ''"><img class='image is-96x96 img-item' :src='shop.image_url'/></template>
              <template v-else><img class='image is-96x96 img-item' :src='"@/assets/images/placeholder_image.png"'/></template>
            </div>
            <div class="column menu-detail" valign="top">
              <div class="hub-name">{{ shop.name }}</div>
              <template v-if="shop.time != '' && shop.time != null && shop.time.open != '' && shop.time.close != ''">
                <div class="hub-time">{{ shop.time.open }} - {{ shop.time.close }}</div>
              </template>
              <div class="hub-desc">{{ shop.desc }}</div>
            </div>
          </a>
        </section>
      </section>
    </div>

    <!-- NOT FOUND VIEW -->
    <div v-else>
      <page-not-found></page-not-found>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import store from '../store/store'

export default {
  data () {
    return {
      url: `${process.env.BASE_URL_API}${Vue.prototype.url.hub}`,
      hub_name: '',
      shops: [],
      status: 0,
      is_visible_image: true
    }
  },
  created () {
    store.commit('setCategories', [])
    this.$http.get(`${this.url}/${this.$route.query.hub}`)
      .then(response => {
        this.status = response.data.status.code
        if (response.data.status.code === 200) {
          this.hub_name = response.data.data.name
          document.title = this.hub_name
          this.shops = response.data.data.shops
        } else {
          this.hub_name = '404 - The Shop can\'t be found'
          document.title = this.hub_name
        }
      }, () => {
        this.status = 500
        this.hub_name = '500 - Internal Server Error'
        document.title = this.hub_name
      })
  },
  methods: {
    trimSpace: function (str) {
      if (str) {
        return str.toLowerCase().trim()
      }
      return str
    },
    whiteSpace: function (str) {
      if (str) {
        return str.toLowerCase().trim().split(' ').join('-')
      }
      return str
    },
    onSelectedShop: function (i) {
      this.$router.push({ path: `/shop/?shop=${this.shops[i].id}` })
    }
  }
}
</script>
