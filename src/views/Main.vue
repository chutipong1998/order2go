<template>
  <div class="page">
    <!-- LOADING VIEW -->
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
</template>

<script>
const LINE_LIFF_ID = '1654177345-M3qyB4Am' // Order2Go
// const LINE_LIFF_ID = '1654119168-oE6Wj9bn' // Jack
// const LINE_LIFF_ID = '1654123386-yz6pE61E' // Tiw

export default {
  created () {
    if (this.liff.isInClient()) {
      this.liff.init({ liffId: LINE_LIFF_ID }, this.liffInitSuccess, this.liffInitError)
    } else {
      this.browser()
    }
  },
  methods: {
    browser: function () {
      // Param
      const redirect = this.redirectUrl()
      if (redirect !== '') {
        // Redirect
        this.$router.replace({ path: redirect })
      } else {
        // Close
        this.$router.replace({ path: '/404' })
      }
    },
    liffInitSuccess: function () {
      // Param
      const redirect = this.redirectUrl()
      // Condition
      if (!this.liff.isLoggedIn()) {
        // LINE Login
        // this.liff.login() // Redirect to Endpoint URL
        this.liff.login({ redirectUri: `${process.env.BASE_URL_API}/${redirect}` })
      } else if (redirect !== '') {
        // Redirect
        this.$router.replace({ path: redirect })
      } else {
        // Close
        this.$router.replace({ path: '/404' })
      }
    },
    liffInitError: function (err) {
      // Error happens during initialization
      console.log(err.code, err.message)
      if (this.liff.isInClient()) this.liff.closeWindow()
    },
    redirectUrl: function () {
      var redirect = ''
      if (this.$route.query.hub) {
        redirect = `/hub/?hub=${this.$route.query.hub}`
      } else if (this.$route.query.shop) {
        redirect = `/shop/?shop=${this.$route.query.shop}`
      }
      return redirect
    }
  }
}
</script>
