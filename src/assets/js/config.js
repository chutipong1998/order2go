import Vue from 'vue'

Vue.prototype.url = {
  hub: '/hub',
  shop: '/shop'
}

Vue.prototype.order_type_value = {
  'delivery': {
    name: 'จัดส่ง'
  },
  'pick_up': {
    name: 'รับที่ร้าน'
  }
}
/*
  {
    'id': 0,
    'name': 'จัดส่ง'
  },
  {
    'id': 1,
    'name': 'รับที่ร้าน'
  }
]
*/
