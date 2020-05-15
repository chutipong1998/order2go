<template>
  <div>
    <div class="container menu" style="text-align: center; margin-top: 5%;">
      <section class="section">
        <div class="container-input minimal">
          <div class="container-input minimal">
            <p style="text-align:left">
              บ้านเลขที่ <span style="color:red;">*</span> {{ $route.params.index }}
            </p>
            <input class="input" v-model="locat" placeholder="บ้านเลขที่" rows="1" />
          </div>
          <div class="container-input minimal">
            <p style="text-align:left">
              อาคาร/หมู่บ้าน <span style="color:red;">*</span>
            </p>
            <input class="input" v-model="village" placeholder="อาคาร/หมู่บ้าน" rows="1" />
          </div>
          <div class="container-input minimal">
            <p style="text-align:left">
              ซอย <span style="color:red;">*</span>
            </p>
            <input class="input" v-model="alley" placeholder="ซอย" rows="1" />
          </div>
          <div class="container-input minimal">
            <p style="text-align:left">
              รายละเอียด
            </p>
            <textarea class="textarea" v-model="detail" placeholder="รายละเอียดการเดินทาง เช่น ชั้น หรือเลขที่ห้อง" rows="5" />
          </div>
          <div>
            <label style="padding: 3%;">
              <router-link :to="{ name: 'address' }">
                <button class="btn-cancle" type="button">
                  ยกเลิก
                </button>
              </router-link>
            </label>
            <label style="padding: 3%;">
              <router-link :to="{ name: 'address' }">
                <button class="btn-add" type="button" v-on:click="updateAddress()" :disabled="locat === '' || village === '' || alley === ''">
                  แก้ไขที่อยู่&nbsp;
                </button>
              </router-link>
            </label>
          </div>
        </div>
      </section>
      <div class="footer-space" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      village: '',
      alley: '',
      locat: '',
      detail: '',
      docID: '',
      addresses: '',
      index: ''
    }
  },
  created () {
    this.index = this.$route.params.index
    this.$http
      .get('https://asia-east2-testlocall.cloudfunctions.net/user', {
        params: { email: 'tew2@email', lineId: 'tew' }
      })
      .then(res => {
        this.addresses = res.data.data.addresses
        this.locate = res.data.data.addresses[this.index]
        this.locat = this.locate.houseNo
        this.village = this.locate.villageOrBuilding
        this.alley = this.locate.alley
        this.detail = this.locate.detail
        console.log('locate:', this.locate)
        this.docID = res.data.docsId
        console.log('docID:', this.docID)
      })
  },
  methods: {
    updateAddress: function () {
      this.addresses[this.index].villageOrBuilding = this.village
      this.addresses[this.index].houseNo = this.locat
      this.addresses[this.index].alley = this.alley
      this.addresses[this.index].detail = this.detail
      this.$http.post('https://asia-east2-testlocall.cloudfunctions.net/user/update', {
        'idFireStore': this.docID,
        'dataForUpdate': {'addresses': this.addresses}
      })
      this.$store.commit('setAddresses', this.addresses)
    }
  }
}
</script>
