<template>
  <div class="page">
    <!-- CONTENT VIEW -->
    <div class="container menu">
      <div class="columns columns-item-title column is-mobile title-main mg-b-0">
        <div class="column pd-r-0 pd-t-0 pd-b-0">
          <h1 class="text-align-left">ระบุตำแหน่ง</h1>
        </div>
      </div>
      <section class="section display pd-l-0 pd-r-0">
        <div class="container-input">
          <gmap-autocomplete class="box-input-map" @place_changed="updateCenter($event)" style="display: table-cell;"/>
        </div>
        <GmapMap
          class="container-input minimal"
          ref="mapRef"
          :center="latLngMap"
          :zoom="17"
          :options="{
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            disableDefaultUi: false
          }"
          map-type-id="terrain"
          style="width: 100%; height: 400px"
        >
          <GmapMarker :position="latLngMap" :draggable="true" @dragend="updateCoordinates" />
          <gmap-autocomplete @place_changed="updateCenter($event)" />
        </GmapMap>
        <div class="container-input minimal">
        </div>
        <div class="container-input minimal">
            <button v-on:click="findMyLocation()">ตำแหน่งของฉัน</button>
        </div>
      </section>
    </div>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="content has-text-centered">
        <div class="summary">
          <div class="cancle-mappage">
          <router-link :to="{ name: 'address' }">
              <button class="cancle-mappage">
                กลับ
              </button>
          </router-link>
          </div>
          <router-link :to="{ name: 'address' }">
            <button class="submit-order" v-on:click="saveData()">
              ถัดไป
            </button>
          </router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      coordinates: null,
      map_address:[],
      latLngMap:{}
    }
  },
  created() {
    this.map_address = this.$store.state.map_address
    this.coordinates = this.$store.state.coordinates
    if (this.coordinates === null) {
      this.findMyLocation()
    }else{
      this.latLngMap={ lat: this.coordinates.lat, lng: this.coordinates.lng}
    }
  },
  methods: {
    findMyLocation: function () {
      navigator.geolocation.getCurrentPosition(position => {
        this.latLngMap = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
        this.coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
      })
    },
    saveData: function() {
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode(
            {
            location: {
                lat: this.coordinates.lat,
                lng: this.coordinates.lng
            }
            },
            (results, status) => {
            if (status === "OK") {
                this.map_address = results[0].address_components
                this.$store.commit('setMap_Address', this.map_address)
                this.$store.commit('setCoordinates', this.coordinates)
                console.log(this.map_address)
            }
            }
        )
        console.log(this.coordinates.lat, this.coordinates.lng)
    },
    updateCenter: function (place) {
      this.latLngMap = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
    },
    updateCoordinates: function (location) {
      const geocoder = new google.maps.Geocoder()
      this.coordinates = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      }
      geocoder.geocode(
        {
          location: {
            lat: this.coordinates.lat,
            lng: this.coordinates.lng
          }
        },
        (results, status) => {
          if (status === 'OK') {
            this.map_address = results[0].formatted_address
            console.log(results[0].address_components)
          }
        }
      )
      this.$refs.mapRef.$mapPromise.then(map => {
        map.panTo({ lat: location.latLng.lat(), lng: location.latLng.lng() })
      })
      console.log(this.coordinates.lat, this.coordinates.lng)
    }
  }
}
</script>
