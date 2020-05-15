
const xlsx = require('node-xlsx').default;
const cors = require('cors');
const express = require('express');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const path = require('path');
const os = require('os');
const fs = require('fs');

// Admin
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

// Api
const REGION = "asia-east2"

// Application Express
const appHub = express();
appHub.use(cors({ origin: true }));
const appShop = express();
appShop.use(cors({ origin: true }));

const appUser = express();
appUser.use(cors({ origin: true }));

function res404(res){
  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  res.send({
    'status': {
      'code': 404,
      'description': 'Invalid user code'
    },
    'data': null,
  })
}
statusOk = {
  'code': 202,
  'description': 'ok'
}
appUser.get('/', async (req, res) => {
  try {
    // res.send(req.query)
    lineId = req.query.lineId ? req.query.lineId : null
    email = req.query.email ? req.query.email : null
    var user = ''
    if(lineId){
      user = await db.collection('users').doc(lineId).get()
    }
    if (user.empty || user === ''){
      if(email){
        user = await db.collection('users').doc(email).get()
      }
    }
    if(user === '' || user.empty){
      res404(res)
    }else{
      res.send({'status': statusOk ,'docsId':user.docs[0].id,'data':user.docs[0].data()})
    }


  } catch(error) {
    res404(res)
  }
})

appUser.post('/create', async (req, res) => {
  try {
    lineId = req.body.lineId ? req.body.lineId : null
    email = req.body.email ? req.body.email : null
    if (lineId) {
      await db.collection('users').doc(lineId).set({
        'addresses': req.body.addresses ? req.body.addresses : [],
        'phones' : req.body.phones ? req.body.phones : [],
        'defaultAdress' : req.body.defaultAdress ? Number(req.body.defaultAdress) : -1,
        'defaultPhone' : req.body.defaultPhone ? Number(req.body.defaultPhone) : -1,
        'name' : req.body.name ? req.body.name : '',
        'lineId' : lineId ,
        'email' : email ? email : ''
      })
      res.send('Created')
    } else if(email) {
      await db.collection('users').doc(email).set({
        'addresses': req.body.addresses ? req.body.addresses : [],
        'phones' : req.body.phones ? req.body.phones : [],
        'defaultAdress' : req.body.defaultAdress ? Number(req.body.defaultAdress) : -1,
        'defaultPhone' : req.body.defaultPhone ? Number(req.body.defaultPhone) : -1,
        'name' : req.body.name ? req.body.name : '',
        'lineId' : lineId ? lineId : '',
        'email' : email
      })
      res.send('Created')
    } else {
      res404(res)
    }
    // await db.collection('users').doc().set(req.body)
  } catch(error) {
    res404(res)
  }
})


appUser.post('/update', async (req, res) => {
  try {
    await db.collection('users').doc(req.body.idFireStore).update(req.body.dataForUpdate)
    res.send('Updated')
  } catch(error) {
    res404(res)
  }
})



appUser.post('/delete', async (req, res) => {
  try {
    await db.collection('users').doc(req.body.idFireStore).delete()
    res.send('Deleted')
  } catch(error) {
    res404(res)
  }
})


// Hub
appHub.get('/', (req, res) => {
  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  res.send({
    'status': {
      'code': 404,
      'description': 'Invalid hub code'
    },
    'data': null,
  })
})

// Hub
appHub.get('/:hub', async (req, res) => {
  const hubId = req.params.hub
  var hubData = {}
  res.statusCode = 401
  res.setHeader('Content-Type', 'application/json')

  try {
    const hubs = await readHubsFormFirestore(hubId)
    if (hubs.length > 0) {
      hubData = hubs[0]

      if (hubData) {
        res.statusCode = 200
      } else {
        res.statusCode = 401
      }
    }
  } catch (error) {
    res.statusCode = 500
  }

  var callback
  switch(res.statusCode) {
    case 200:
      callback = {
        'status': {
          'code': 200,
          'description': 'Success'
        },
        'data' : hubData
      }
      break
    case 401:
      callback = {
        'status': {
          'code': 401,
          'description': 'Database error'
        },
        'data' : hubData
      }
      break
    default:
      callback = {
        'status': {
            'code': res.statusCode,
            'description': 'Invalid hub code'
        },
        'data': null,
      }
  }
  res.send(callback)
});

// Shop
appShop.get('/', (req, res) => {
  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  res.send({
    'status': {
      'code': 404,
      'description': 'Invalid shop code'
    },
    'data': null,
  })
})

// Shop
appShop.get('/:shop', async (req, res) => {
  const lineId = req.params.shop
  var shopData = {}
  res.statusCode = 401
  res.setHeader('Content-Type', 'application/json')

  try {
    const shops = await readShopsFormFirestore(lineId)
    if (shops.length > 0) {
      const shop = shops[0]
      Object.entries(shop).forEach((element) => {
        shopData[element[0]] = element[1]
      })

      const sheetsData = await readFileFormStorage(shop.file)
      categories = []
      await sheetsData.forEach(async sheet => {
        var key = sheet[0].trim().toLowerCase().split(' ').join('_')
        var value = sheet[1]
        switch (key) {
          case 'payment':
          case 'delivery_fee':
            shopData[key] = value
            break
          default:
            categories.push({
              'name' : sheet[0],
              'menus' : value
            })
            break;
        }
      })
      shopData['categories'] = categories
      if (sheetsData) {
        res.statusCode = 200
      } else {
        res.statusCode = 401
      }
    }
  } catch (error) {
    res.statusCode = 500
  }

  var callback
  switch(res.statusCode) {
    case 200:
      callback = {
        'status': {
          'code': 200,
          'description': 'Success'
        },
        'data' : shopData
      }
      break
    case 401:
      callback = {
        'status': {
          'code': 401,
          'description': 'Database error'
        },
        'data' : shopData
      }
      break
    default:
      callback = {
        'status': {
            'code': res.statusCode,
            'description': 'Invalid shop code'
        },
        'data': null,
      }
  }
  res.send(callback)
});


async function readHubsFormFirestore(hubId) {
  try {
    const hub = await db.collection('hubs').where('id', '==', hubId).get()
    var list = []
    if (!hub.empty) {
      hub.forEach((doc) => {
        list.push(doc.data())
      })
    }
    return list
  } catch (error) {
    return []
  }
}

async function readShopsFormFirestore(lineId) {
  try {
    const shop = await db.collection('shops').where('line_id', '==', lineId).get()
    var list = []
    if (!shop.empty) {
      shop.forEach((doc) => {
        list.push(doc.data())
      })
    }
    return list
  } catch (error) {
    return []
  }
}

async function filterDataInSheet(rows){
  if (rows.length > 0) {
    const headers = rows[0]
    var list = []

    // Rows Data
    for (r = 1; r < rows.length; r++) {
      var row = rows[r]
      var temp = {}
      var isData = false
      // Column Data
      for (c = 0; c < headers.length; c++) {
        var header = headers[c]
        temp[header] = (row[c] || row[c] === 0) ? row[c] : ''
        if (temp[header]) {
          isData = true
        }
      }
      if (isData) {
        list.push(temp)
      }
    }
    return list
  } else {
    return []
  }
}

async function readFileFormStorage(fileName) {
  try {
    const filePath = 'data'
    const tempFilePath = path.join(os.tmpdir(), fileName);
    var datas = []

    // Read a file Form Storage
    var bucket = storage.bucket();
    await bucket.file(`${filePath}/${fileName}`).download({destination: tempFilePath})

    // Parse a file excel
    const sheets = xlsx.parse(tempFilePath);
    const promises = sheets.map(async (sheet) => {
      datas.push([sheet.name, await filterDataInSheet(sheet.data)])
    })
    await Promise.all(promises)
    return datas
  } catch (error) {
    return []
  }
}


// Expose Express API as a single Cloud Function:
// exports.widgets = functions.https.onRequest(app);
exports.user = functions.region(REGION).https.onRequest(appUser)
exports.hub = functions.region(REGION).https.onRequest(appHub)
exports.shop = functions.region(REGION).https.onRequest(appShop)
