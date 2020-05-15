<template>
  <div>
    <div class="container menu" style="text-align: center; margin-top: 5%;">
      <section class="section">
        <div class="container-input minimal">
          <div class="container-input minimal">
            <p style="text-align:left">
              บ้านเลขที่ <span style="color:red;">*</span>
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
          <div class="container menu text-align-center">
            <section class="section-map">
              <div class="showInfo-map">
                  <div><img src="../assets/images/home.png" alt="" width="50%"></div>
                  <div class="text-map"><h3>ยังไม่มีตำแหน่งจัดส่งบนแผนที่</h3></div>
                  <router-link :to="{ name: 'googlemap' }">
                    <button class="btn button-map" type="button">ระบุตำแหน่ง</button>
                  </router-link>
              </div>
            </section>
          </div>
          <div class="container-input">
            <label style="padding: 3%;">
              <router-link :to="{ name: 'address' }">
                <button class="btn-cancle" type="button">
                  ยกเลิก
                </button>
              </router-link>
            </label>
            <label style="padding: 3%;">
              <router-link :to="{ name: 'address' }">
                <button class="btn-add" type="button" v-on:click="addAddress()" :disabled="locat === '' || village === '' || alley === ''">
                  เพิ่มที่อยู่&nbsp;
                  <i class="fas fa-plus fa-lg"></i>
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
      coordinates: null,
      map_address: []
    }
  },
  created () {
    this.map_address = this.$store.state.map_address
    this.coordinates = this.$store.state.coordinates
    this.$http
      .get('https://asia-east2-testlocall.cloudfunctions.net/user', {
        params: { email: 'tew2@email', lineId: 'tew' }
      })
      .then(res => {
        this.locate = res.data.data.addresses
        console.log('locate:', this.locate)
        this.docID = res.data.docsId
        console.log('docID:', this.docID)
      })
  },
  methods: {
    addAddress: function () {
      var addresses = this.locate.concat([{
        'detail': this.detail,
        'villageOrBuilding': this.village,
        'houseNo': this.locat,
        'alley': this.alley
      }])
      this.$http.post('https://asia-east2-testlocall.cloudfunctions.net/user/update', {
        'idFireStore': this.docID,
        'dataForUpdate': {'addresses': addresses}
      })
      this.$store.commit('setAddresses', addresses)
    }
  }
}
</script>
