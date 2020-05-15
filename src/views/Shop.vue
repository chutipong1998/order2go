<template>
  <div class="page">
    <!-- LOADING VIEW -->
    <div v-if='status === 0'>
      <div class="container">
        <content-loader :width=500 :height=900>
          <rect x="16" y="10" rx="8" ry="8" width="80" height="20" />
          <rect x="112" y="10" rx="8" ry="8" width="100" height="20" />
          <rect x="228" y="10" rx="8" ry="8" width="60" height="20" />
          <rect x="304" y="10" rx="8" ry="8" width="120" height="20" />
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
      <!-- HEADER -->
      <nav v-if="categories.length > 1" class='header is-fixed-top'>
        <div class="container">
          <div class="navbar scroll-horizontal">
            <scrollactive active-class="active" class="nav-menu" :highlightFirstItem='true' :exact='true' :modifyUrl='false' :offset="80" :scrollOffset="30">
              <template v-for="(category, i) in categories" >
                <a :href="'#' + whiteSpace(category.name)" :key='i' class="scrollactive-item">
                  {{ category.name }}
                </a>
              </template>
            </scrollactive>
          </div>
        </div>
      </nav>

      <!-- CONTENT -->
      <div class="container menu">
        <section class="section" v-for="(category, x) in categories" :key='x' :id="whiteSpace(category.name)">
          <div class="columns columns-item-title column is-mobile title-section"  :class="{'title-main': x == 0, active: categories.length > 1}">
            <template v-if="x == 0">
              <div class="column pd-r-0 pd-t-0 pd-b-0">
                <h1 class='text-align-left'>รายการสินค้า</h1>
              </div>
              <a class="btn-display" type="button" v-on:click='onDisplay()'>
                <span v-show="!display"><i class="fas fa-list"></i></span>
                <span v-show="display"><i class="fas fa-th-large"></i></span>
              </a>
            </template>
            <template v-else>
              <div class="column remove-padding-bottom">
                <h2 class='text-align-left category'>{{category.name}}</h2>
              </div>
            </template>
          </div>
          <!-- LIST VIEW -->
          <template v-if="display">
            <div class="columns is-mobile columns-item-content display-list" v-for='(item, y) in category.menus' :key='item.id' :class="{ disabled: item.enable === 0}">
              <div class="menu-img" v-show="is_visible_image">
                <template v-if="trimSpace(item.image_url) !== ''"><img class='image is-96x96 img-item' :src='item.image_url'/></template>
                <template v-else><img class='image is-96x96 img-item' :src='"@/assets/images/placeholder_image.png"'/></template>
              </div>
              <div class="column menu-detail" valign="top">
                <div class="menu-name">{{ item.name }}</div>
                <section class="menu-buyer">
                  <div class="menu-buyer-price">฿{{ item.price }}</div>
                  <div class="stepper menu-buyer-quantity">
                    <button class="btn-circle" type="button" v-on:click='decrease(x,y)' :disabled='counter[x][y] == 0 || item.enable === 0'>
                      <i class="fas fa-minus fa-lg"></i>
                    </button>
                    <div class="st-number">{{ counter[x][y] }}</div>
                    <button class="btn-circle" type="button" v-on:click='increase(x,y)' :disabled='item.enable === 0'>
                      <i class="fas fa-plus fa-lg"></i>
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </template>
          <!-- GRID VIEW -->
          <template v-else>
            <div class="columns is-mobile columns-item-content is-multiline display-grid is-gapless">
              <template v-for='(item, y) in category.menus'>
                <div class="column is-6" :key='item.id'>
                  <div class="menu-img" v-show="is_visible_image">
                    <template v-if="trimSpace(item.image_url) !== ''"><img class='image is-120x120 img-item' :src='item.image_url'/></template>
                    <template v-else><img class='image is-120x120 img-item' :src='"@/assets/images/placeholder_image.png"'/></template>
                  </div>
                  <div class="column menu-detail" valign="top">
                    <div class="menu-name">{{ item.name }}</div>
                    <div class="menu-buyer-price">฿{{ item.price }}</div>
                    <section class="menu-buyer">
                      <div class="stepper menu-buyer-quantity">
                        <button class="btn-circle" type="button" v-on:click='decrease(x,y)' :disabled='counter[x][y] == 0 || item.enable === 0'>
                          <i class="fas fa-minus fa-lg"></i>
                        </button>
                        <div class="st-number">{{ counter[x][y] }}</div>
                        <button class="btn-circle" type="button" v-on:click='increase(x,y)' :disabled='item.enable === 0'>
                          <i class="fas fa-plus fa-lg"></i>
                        </button>
                      </div>
                    </section>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </section>
        <div class="footer-space"/>
      </div>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="content has-text-centered">
          <div class="summary">
            <div class='summary-total'>฿{{ subtotal.toFixed(2) }}</div>
            <router-link :to="{ name: 'address' }">
              <button class="submit-order" v-on:click='saveData()' :disabled="subtotal === 0">
                ถัดไป
              </button>
            </router-link>
          </div>
        </div>
      </footer>
    </div>

    <!-- NOT FOUND VIEW -->
    <div v-else>
      <page-not-found></page-not-found>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
const KEY_DISPLAY = 'display'

export default {
  data () {
    return {
      url: `${process.env.BASE_URL_API}${Vue.prototype.url.shop}`,
      counter: [],
      subtotal: 0,
      status: 0,
      shop_name: '',
      is_visible_image: true,
      categories: '',
      payment: '',
      delivery_fee: [],
      order_type: [],
      display: true
    }
  },
  created () {
    if (this.$cookies.isKey(KEY_DISPLAY)) {
      this.display = (this.$cookies.get(KEY_DISPLAY) === 'true')
    }
    if (this.$store.state.categories.length === 0) {
      this.$http.get(`${this.url}/${this.$route.query.shop}`).then(response => {
        this.status = response.data.status.code
        if (response.data.status.code === 200) {
          this.shop_name = response.data.data.shop.name
          if (response.data.data.order_type !== null && response.data.data.order_type !== undefined) {
            this.order_type = response.data.data.order_type
            for (var i = 0; i < this.order_type.length; i++) {
              if (!this.order_type[i].enable) {
                this.order_type.splice(i, 1)
                i = i - 1
              }
            }
          }
          document.title = this.shop_name
          this.categories = response.data.data.categories
          this.payment = response.data.data.payment ? response.data.data.payment : []
          this.delivery_fee = response.data.data.delivery_fee ? response.data.data.delivery_fee : []
          this.categories.forEach(category => {
            var l = []
            category.menus.forEach(menu => {
              l.push(0)
            })
            this.counter.push(l)
          })
        } else {
          this.shop_name = '404 - The Shop can\'t be found'
          document.title = this.shop_name
        }
      }, () => {
        this.status = 500
        this.shop_name = '500 - Internal Server Error'
        document.title = this.shop_name
      })
    } else {
      // Restore
      this.status = 200
      this.counter = this.$store.state.counter
      this.categories = this.$store.state.categories
      this.payment = this.$store.state.payment
      this.delivery_fee = this.$store.state.delivery_fee
      this.order_type = this.$store.state.order_type
      this.subtotal = this.calculatorSubtotal()
      this.shop_name = this.$store.state.shop_name
    }
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
    onDisplay: function () {
      this.display = !this.display
      this.$cookies.set(KEY_DISPLAY, this.display.toString())
    },
    saveData: function () {
      // this.$http.post('https://asia-east2-testlocall.cloudfunctions.net/user/create', {
      //   'name': 'Fred',
      //   'email': 'Fred@email',
      //   'lineId': 'FredZa007',
      //   'phones': ['0878787987', '089798789'],
      //   'addresses': [],
      //   'defaultAdress' : '',
      //   'defaultPhone' : '',
      //   })
      // this.$http.post('https://asia-east2-testlocall.cloudfunctions.net/user/update', {
      //   'idFireStore': 'w77ovtGSZri5vBBRgalP',
      //   'dataForUpdate': {
      //     'name': 'Fredy'
      //   }})
      // this.$http.post('https://asia-east2-testlocall.cloudfunctions.net/user/delete', {
      //   'idFireStore': 'w77ovtGSZri5vBBRgalP'
      // })
      // this.$http.get()
      this.$store.commit('setCategories', this.categories)
      this.$store.commit('setCounter', this.counter)
      this.$store.commit('setShopName', this.shop_name)
      this.$store.commit('setPayment', this.payment)
      this.$store.commit('setDeliveryFee', this.delivery_fee)
      this.$store.commit('setOrderType', this.order_type)
      this.$store.commit('setSubtotal', this.subtotal)
    },
    increase: function (x, y) {
      if (this.categories[x].menus[y].enable !== '0') {
        this.counter[x][y] += 1
        this.subtotal = this.calculatorSubtotal()
      }
    },
    decrease: function (x, y) {
      if (this.counter[x][y] > 0) {
        this.counter[x][y] -= 1
        this.subtotal = this.calculatorSubtotal()
      }
    },
    calculatorSubtotal: function () {
      var value = 0
      for (let x = 0; x < this.counter.length; x++) {
        for (let y = 0; y < this.counter[x].length; y++) {
          value += this.categories[x].menus[y].price * this.counter[x][y]
        }
      }
      return value
    }
  }
}
</script>
