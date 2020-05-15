import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  counter: '',
  shop_name: '',
  categories: [],
  payment: '',
  delivery_fee: [],
  order_type: [],
  selected_order_type: -1,
  addresses: [],
  address: {
    name: '',
    phone: '',
    locat: '',
    village: '',
    alley: '',
    detail: ''
  },
  coordinates: null,
  map_address:[],
  subtotal: 0
}

const mutations = {
  setCounter: (state, counter) => {
    state.counter = counter
  },
  setShopName: (state, shopName) => {
    state.shop_name = shopName
  },
  setCategories: (state, categories) => {
    state.categories = categories
  },
  setPayment: (state, payment) => {
    state.payment = payment
  },
  setDeliveryFee: (state, deliveryFee) => {
    state.delivery_fee = deliveryFee
  },
  setOrderType: (state, orderType) => {
    state.order_type = orderType
  },
  setSelectedOrderType: (state, selectedOrderType) => {
    state.selected_order_type = selectedOrderType
  },
  setAddress: (state, address) => {
    state.address = address
  },
  setSubtotal: (state, subtotal) => {
    state.subtotal = subtotal
  },
  setAddresses: (state, addresses) => {
    state.addresses = addresses
  },
  setCoordinates: (state, coordinates) => {
    state.coordinates = coordinates
  },
  setMap_Address: (state, map_address) => {
    state.map_address = map_address
  },
}

const getters = {
  todos: state => state.todos,
  number: state => state.number
}

const actions = {
  addTodo: (state, name) => {
    store.commit('addText', name)
  },
  addNumber: (state, num) => {
    store.commit('addNum', num)
  }
}

let store = new Vuex.Store({
  state: state,
  mutations: mutations,
  getters: getters,
  actions: actions
})

global.store = store
export default store
