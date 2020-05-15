<template>
  <div class="page">
    <!-- CONTENT VIEW -->
    <div class="container menu">
      <div class="columns columns-item-title column is-mobile title-main mg-b-0">
        <div class="column pd-r-0 pd-t-0 pd-b-0">
          <h1 class='text-align-left'>ข้อมูลจัดส่ง</h1>
        </div>
      </div>
      <section class="section display pd-l-0 pd-r-0">
        <div class="container-input">
          <p style="text-align:left">
            ชื่อ-นามสกุล <span style="color:red;">*</span>
          </p>
          <input class="input" v-model="address.name" placeholder="กรอกชื่อและนามสกุล" rows="1" type="text" />
        </div>

        <div class="container-input">
          <p style="text-align:left">
            เบอร์โทรศัพท์ <span style="color:red;">*</span>
          </p>
          <input class="input" type="tel" pattern="[0-9-]*" inputmode="numeric" v-model="address.phone" placeholder="กรอกเบอร์โทรศัพท์ที่สามารถติดต่อได้" rows="1" v-mask="'##-####-####'" />
        </div>

        <div class="container-input minimal">
          <label class="radio" v-for="(type, index) in order_type" :key="index" v-if='type.enable'>
            <input type="radio" name="showInput" v-model="selected_order_type" :value="index" @click="onChangedOrderType(index)">
            <span>{{ order_type_value[type.name].name }}</span>
          </label>
        </div>

        <div v-if="order_type.length > 0 && order_type[selected_order_type].name === 'delivery'">
          <div class="container-input minimal" v-for="(here, index) in locate" :key="index">
            <div class="col-md-4 col-lg-4 col-sm-4">
              <label class="location-label">
                <input type="radio" name="product" v-model="selected_address" :value="here" class="card-input-element" :checked="index === defaultAdress">

                <div class="panel panel-default card-input" style="border: 1px solid lightgrey">
                  <div class="card-detail" style="background-color: white;">
                    <p style="text-align:left">บ้านเลขที่:&nbsp;{{ here.houseNo }}&nbsp;อาคาร/หมู่บ้าน.&nbsp;{{ here.villageOrBuilding }}</p>
                    <p style="text-align:left">ซอย.&nbsp;{{ here.alley }}</p>
                    <p style="text-align:left">{{ here.detail }}</p>
                  </div>
                  <a class="btn-delete" v-on:click="deleteAddress(here)">
                    ลบ
                  </a>
                  <router-link :to="{ name: 'editAddress', params: {index : index} }">
                    <a class="btn-delete" v-on:click="editAddress(here)">
                    แก้ไข
                    </a>
                  </router-link>
                </div>
              </label>
            </div>

          </div>
          <div style="padding: 3%;">
            <router-link :to="{ name: 'addAddress' }">
              <button class="btn" type="button">
                เพิ่มที่อยู่&nbsp;
                <i class="fas fa-plus fa-lg"></i>
              </button>
            </router-link>
          </div>
        </div>
      </section>
      <div class="footer-space" />
    </div>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="content has-text-centered">
        <div class="summary">
          <div class='summary-total'>฿{{ subtotal.toFixed(2) }}</div>
          <router-link :to="{ name: 'summary' }">
            <button class="submit-order" v-on:click="saveData()" :disabled="address.name === '' || address.phone === ''">
              ถัดไป
            </button>
          </router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data () {
    return {
      selected_address: {},
      docID: '',
      locate: '',
      name: '',
      phone: '',
      defaultAdress: '',
      order_type: [
        {
          'name': 'delivery',
          'enable': true
        },
        {
          'name': 'pick_up',
          'enable': true
        }
      ],
      order_type_value: Vue.prototype.order_type_value,
      selected_order_type: -1,
      subtotal: 0
    }
  },
  created () {
    console.log(this.selected_address)
    this.address = this.$store.state.address
    this.subtotal = this.$store.state.subtotal
    this.$http.get('https://asia-east2-testlocall.cloudfunctions.net/user', {params:
    { email: 'tew2@email', lineId: 'tew' }
    }).then((res) => {
      this.docID = res.data.docsId
      if (res.status !== 404) {
        this.address.name = res.data.data.name
        this.locate = this.$store.state.addresses.length === 0 ? res.data.data.addresses : this.$store.state.addresses
        this.address.phone = res.data.data.phones[Number(res.data.data.defaultPhone)]
        this.defaultAdress = res.data.data.defaultAdress
      }
    })
    // this.order_type = this.$store.state.order_type
    if (this.order_type.length > 0) {
      if (this.$store.state.selected_order_type === -1) {
        this.selected_order_type = 0
        this.$store.commit('setSelectedOrderType', 0)
      } else {
        this.selected_order_type = this.$store.state.selected_order_type
      }
    }
    if (this.address.name === '' || this.address.name === undefined || this.address.name == null) {
      // Open in LINE LIFF
      if (this.liff.isInClient()) {
        this.$http.get('https://asia-east2-testlocall.cloudfunctions.net/user', {params:
        { lineId: this.liff.getDecodedIDToken().sub }
        }).then((res) => {
          console.log(res)
          if (res.status !== 404) {
            this.address.name = res.data.data.name
            this.locate = this.$store.state.addresses.length === 0 ? res.data.data.addresses : this.$store.state.addresses
            this.address.phone = res.data.data.phones[Number(res.data.data.defaultPhone)]
          }
        })
        this.liff.getProfile().then(profile => {
          this.address.name = profile.displayName
        })
      }
    }
  },
  methods: {
    saveData: function () {
      this.$store.commit('setAddress', this.address)
    },
    onChangedOrderType: function (index) {
      this.selected_order_type = index
      this.$store.commit('setSelectedOrderType', index)
    },
    deleteAddress: function (here) {
      var index = this.locate.indexOf(here)
      if (index > -1) {
        this.locate.splice(index, 1)
      }
      this.$http.post('https://asia-east2-testlocall.cloudfunctions.net/user/update', {
        'idFireStore': this.docID,
        'dataForUpdate': {'addresses': this.locate}
      })
    },
    editAddress: function (here) {
      var index = this.locate.indexOf(here)
      console.log(index)
      // this.$http.post('https://asia-east2-testlocall.cloudfunctions.net/user/update', {
      //   'idFireStore': this.docID,
      //   'dataForUpdate': {'addresses': this.locate}
      // })
    }
  }
}
</script>
