import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/views/Main'
import ShopPage from '@/views/Shop'
import HubPage from '@/views/Hub'
import SummaryPage from '@/views/Summary'
import AddressPage from '@/views/Address'
import AddAddressPage from '@/views/Add_Address'
import EditAddressPage from '@/views/EditAddress'
import GoogleMapPage from '@/views/GoogleMap'
import PageNotFound from '@/views/PageNotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: MainPage
    },
    {
      path: '/hub',
      name: 'HubPage',
      component: HubPage
    },
    {
      path: '/shop',
      name: 'ShopPage',
      component: ShopPage
    },
    {
      path: '/address',
      name: 'address',
      component: AddressPage
    },
    {
      path: '/add_address',
      name: 'addAddress',
      component: AddAddressPage
    },
    {
      path: '/summary',
      name: 'summary',
      component: SummaryPage
    },
    {
      path: '/edit_address',
      name: 'editAddress',
      component: EditAddressPage
    },
    {
      path: '/googlemap',
      name: 'googlemap',
      component: GoogleMapPage
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
})
