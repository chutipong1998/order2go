<template>
  <div class="page">
    <!-- CONTENT VIEW -->
    <div class="container menu">
      <!-- ORDER -->
      <section class="section">
        <div class="columns columns-item-title column is-mobile title-main mg-b-0">
          <div class="column pd-r-0 pd-t-0 pd-b-0">
            <h1 class='text-align-left'>สรุปรายการสินค้า</h1>
          </div>
        </div>
         <div v-for="(indexCategory, x) in Array(counter.length).keys()" :key="x">
           <div v-for="indexItem in Array(counter[indexCategory].length).keys()" :key=" categories[indexCategory].name + categories[indexCategory].menus[indexItem] + indexItem">
            <!-- INIT VALUE-->
            <div class="none">{{ item = categories[indexCategory].menus[indexItem] }}</div>
            <div class="none">{{ counterByItem = counter[indexCategory][indexItem] }}</div>
            <div class="columns is-mobile columns-item-content display-list" v-if="counter[indexCategory][indexItem] > 0">
              <div class="menu-img" v-show="is_visible_image">
                <template v-if="trimSpace(item.image_url) !== ''"><img class='image is-96x96 img-item' :src='item.image_url'/></template>
                <template v-else><img class='image is-96x96 img-item' :src='"@/assets/images/placeholder_image.png"'/></template>
              </div>
              <div class="column menu-detail" valign="top">
                <div class="menu-summary">
                  <div class="menu-name menu-summary-name">{{ item.name }}</div>
                  <div class="menu-summary-price">฿{{ item.price * counterByItem }}</div>
                </div>
                <section class="menu-buyer">
                  <a class="btn-delete" v-on:click="deleteMenu(indexCategory, indexItem)">
                    ลบ
                  </a>
                  <div class="stepper menu-buyer-quantity">
                    <button class="btn-circle" type="button" v-on:click="decrease(indexCategory, indexItem)" :disabled="counterByItem === 1 || item.enable === 0">
                      <i class="fas fa-minus fa-lg"></i>
                    </button>
                    <div class="st-number">{{ counterByItem }}</div>
                    <button class="btn-circle" type="button" v-on:click="increase(indexCategory, indexItem)" :disabled='item.enable === 0'>
                      <i class="fas fa-plus fa-lg"></i>
                    </button>
                  </div>
                </section>
              </div>
            </div>
           </div>
        </div>
        <div class="is-mobile mg-l-0-75-rem mg-r-0-75-rem mg-t-1-rem">
          <div class="menu-summary-text">
            ราคาสินค้า
          </div>
          <div class="menu-summary-text">
            ฿{{ subtotal }}
          </div>
        </div>
        <div class="is-mobile mg-l-0-75-rem mg-r-0-75-rem mg-t-0-75-rem">
          <div class="menu-summary-text">
            ค่าจัดส่ง
          </div>
          <div class="menu-summary-text">
            ฿{{ total_delivery_fee }}
          </div>
        </div>
      </section>

      <!-- ADDRESS -->
      <template v-if="order_type.length > 0 && selected_order_type > -1">
        <section class="section" v-show="order_type[selected_order_type].name === 'delivery'">
          <div class="columns columns-item-title column is-mobile mg-t-0-75-rem mg-b-0 pd-b-0">
            <div class="column pd-b-0">
              <h2 class='text-align-left category'>ที่อยู่จัดส่ง</h2>
            </div>
          </div>
          <div class="is-mobile columns-item-content mg-l-0-75-rem mg-l-0-75-rem pd-t-0 pd-b-0">
            <div class="delevery-name">คุณ {{ address.name }}</div>
            <div class="delevery-village">บ้านเลขที่ {{ addressText(address.villageOrBuilding) }} {{ address.alley }}</div>
            <div class="delevery-locat">ซอย. {{ addressText(address.houseNo) }} </div>
            <div class="delevery-detail">{{ address.detail }}</div>
            <div class="delevery-phone">โทร. {{ addressText(address.phone) }}</div>
          </div>
        </section>
        <section class="section" v-show="order_type[selected_order_type].name === 'pick_up'">
          <div class="columns columns-item-title column is-mobile">
            <div class="column pd-b-0">
              <h2 class='text-align-left category'>(รับที่ร้าน)</h2>
            </div>
          </div>
        </section>
      </template>

      <!-- PAYMENT -->
      <section class="section">
        <div class="columns columns-item-title column is-mobile mg-t-0-75-rem mg-b-0 pd-b-0">
          <div class="column pd-b-0">
            <div class="container-input minimal">
              <h2>ช่องทางการชำระเงิน</h2>
              <div class="radio-toolbar">
                <input type="radio" id="cash" v-model="money" value="เงินสด" :checked="money === 'เงินสด'">
                <label for="cash" style="width: 30%">
                  <img src="https://cdn.pixabay.com/photo/2016/09/16/09/21/money-1673582_960_720.png" alt="">
                  <p style="text-align: center;">เงินสด</p>
                </label>

                <span v-for="payment in payments" :key="payment.bank">
                  <input type="radio" :id="payment.bank" v-model="money" :value="payment">
                  <label :for="payment.bank" style="width: 30%">
                    <img :src="bank[payment.bank]" alt="">
                    <p style="text-align: center;">{{ payment.bank }}</p>
                  </label>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- NOTE -->
      <section class="section">
        <div class="columns columns-item-title column is-mobile mg-t-0-75-rem mg-b-0 pd-b-0">
          <div class="column pd-b-0">
            <h2 class='text-align-left category'>โน้ต</h2>
          </div>
        </div>
        <div class="is-mobile columns-item-content mg-l-0-75-rem mg-r-0-75-rem pd-t-0">
          <textarea class="textarea" v-model="note" placeholder="รายละเอียดเพิ่มเติม" rows="5"></textarea>
        </div>
      </section>

      <div class="footer-space"/>
    </div>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="content has-text-centered">
        <div class="summary">
          <div class="summary-total">฿{{ total.toFixed(2) }}</div>
          <button class="submit-order" v-on:click="send_message()" :disabled="total === 0">
            สั่งซื้อ
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import SendMessages from '@/assets/js/sendMessage'

export default {
  data () {
    return {
      is_visible_image: true,
      categories: '',
      shop_name: '',
      payments: '',
      note: '',
      counter: '',
      total: 0,
      subtotal: 0,
      delivery_fee: [],
      order_type: [],
      selected_order_type: 0,
      total_delivery_fee: 0,
      money: '',
      address: {
        name: '',
        phone: '',
        locat: '',
        village: '',
        alley: '',
        detail: ''
      },
      bank: {
        'KBANK': 'https://firebasestorage.googleapis.com/v0/b/order-with-local.appspot.com/o/bank_icon%2Fkbank.png?alt=media&token=5b46bf42-5177-40a7-bef7-345b601d666e',
        'SCB': 'https://firebasestorage.googleapis.com/v0/b/order-with-local.appspot.com/o/bank_icon%2Fscb.png?alt=media&token=32c0565f-82d5-4133-8144-764c21b4b5ce',
        'BAY': 'https://firebasestorage.googleapis.com/v0/b/order-with-local.appspot.com/o/bank_icon%2Fbay.png?alt=media&token=9a30cbf1-974a-40a3-a72c-61ee34f1f47b',
        'BBL': 'https://firebasestorage.googleapis.com/v0/b/order-with-local.appspot.com/o/bank_icon%2Fbbl.png?alt=media&token=25c78e7e-2b48-4dce-be30-733a42edd9c9',
        'UOB': 'https://firebasestorage.googleapis.com/v0/b/order-with-local.appspot.com/o/bank_icon%2Fuob.png?alt=media&token=c4e7c961-b7f4-4a5b-831f-3ef31156286d',
        'KTB': 'https://firebasestorage.googleapis.com/v0/b/order-with-local.appspot.com/o/bank_icon%2Fktb.png?alt=media&token=4522df9c-39d8-459c-b806-9903534a7827',
        'GSB': 'https://firebasestorage.googleapis.com/v0/b/order-with-local.appspot.com/o/bank_icon%2Fgsb.png?alt=media&token=9e919e5c-2da6-46ca-92bf-69c91c6c0b15',
        'TMB': 'https://firebasestorage.googleapis.com/v0/b/order-with-local.appspot.com/o/bank_icon%2Ftmb.png?alt=media&token=4fd89ae8-d319-4942-adf5-29c60b2d82c1'
      }
    }
  },
  created () {
    this.counter = this.$store.state.counter
    this.shop_name = this.$store.state.shop_name
    this.categories = this.$store.state.categories
    this.payment = this.$store.state.payment
    this.address = this.$store.state.address
    this.delivery_fee = this.$store.state.delivery_fee
    this.money = 'เงินสด'
    this.payments = this.$store.state.payment

    this.order_type = this.$store.state.order_type
    this.selected_order_type = this.$store.state.selected_order_type

    this.subtotal = this.calculatorSubtotal()
    this.total_delivery_fee = this.calculatorDeliveryFee()
    this.total = this.calculatorTotal()
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
    addressText: function (str) {
      if (str !== '' && str !== undefined && str != null) {
        return str
      }
      return '-'
    },
    increase: function (x, y) {
      if (this.categories[x].menus[y].enable !== '0') {
        this.counter[x][y] += 1
        this.subtotal = this.calculatorSubtotal()
        this.total_delivery_fee = this.calculatorDeliveryFee()
        this.total = this.calculatorTotal()

        this.$store.commit('setCounter', this.counter)
        this.$store.commit('setSubtotal', this.subtotal)
      }
    },
    decrease: function (x, y) {
      if (this.counter[x][y] > 0) {
        this.counter[x][y] -= 1
        this.subtotal = this.calculatorSubtotal()
        this.total_delivery_fee = this.calculatorDeliveryFee()
        this.total = this.calculatorTotal()

        this.$store.commit('setCounter', this.counter)
        this.$store.commit('setSubtotal', this.subtotal)
      }
    },
    deleteMenu: function (x, y) {
      this.counter[x][y] = 0
      this.$forceUpdate()

      this.subtotal = this.calculatorSubtotal()
      this.total_delivery_fee = this.calculatorDeliveryFee()
      this.total = this.calculatorTotal()

      this.$store.commit('setSubtotal', this.subtotal)
      this.$store.commit('setCounter', this.counter)
    },
    calculatorTotal: function () {
      return this.calculatorSubtotal() + this.calculatorDeliveryFee()
    },
    calculatorSubtotal: function () {
      var value = 0
      for (let x = 0; x < this.counter.length; x++) {
        for (let y = 0; y < this.counter[x].length; y++) {
          value += this.categories[x].menus[y].price * this.counter[x][y]
        }
      }
      return value
    },
    calculatorDeliveryFee: function () {
      var fee = 0
      if (this.order_type.length > 0 && this.selected_order_type > -1) {
        if (this.order_type[this.selected_order_type].name === 'delivery') {
          this.delivery_fee.sort(this.compareValues('total', 'desc'))
          for (var i = 0; i < this.delivery_fee.length; i++) {
            const range = this.delivery_fee[i]
            if (this.subtotal >= range.total) {
              fee = range.fee
              break
            }
          }
        }
      }
      return fee
    },
    compareValues: function (key, order = 'asc') {
      return function innerSort (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          return 0
        }

        const varA = (typeof a[key] === 'string')
          ? a[key].toUpperCase() : a[key]
        const varB = (typeof b[key] === 'string')
          ? b[key].toUpperCase() : b[key]

        let comparison = 0
        if (varA > varB) {
          comparison = 1
        } else if (varA < varB) {
          comparison = -1
        }
        return (
          (order === 'desc') ? (comparison * -1) : comparison
        )
      }
    },
    send_message: function () {
      var address = ''
      var textDelivery = ''
      console.log(this.order_type.length)
      console.log(this.selected_order_type)
      if (this.order_type.length > 0 && this.selected_order_type > -1) {
        // Delivery
        textDelivery = Vue.prototype.order_type_value[this.order_type[this.selected_order_type].name].name

        // Address
        if (this.order_type[this.selected_order_type].name === 'delivery') {
          if (this.address.village !== '') {
            address += `บ้านเลขที่ ${this.address.village} `
          }
          if (this.address.alley !== '') {
            address += `อาคาร/หมู่บ้าน ${this.address.alley} `
          }
          if (this.address.locat !== '') {
            address += `ซอย ${this.address.locat} `
          }
          if (this.address.detail !== '') {
            address += `(${this.address.detail})`
          }
        }
      }
      if (this.liff.isInClient()) {
        SendMessages.sendMessage(this.liff, this.counter, this.subtotal, this.categories, this.shop_name, this.total_delivery_fee, this.note, textDelivery, this.address.name, address, this.address.phone)
      }
    }
  }
}
</script>
