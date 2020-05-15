// LIFF have to Init already
function sendMessage (
  liff,
  counter,
  total,
  categories,
  shopName,
  shipping,
  note,
  reciveType,
  customerName,
  address,
  tel
) {
  var items = []
  for (let i = 0; i < counter.length; i++) {
    for (let j = 0; j < counter[i].length; j++) {
      if (counter[i][j] > 0) {
        items.push({
          type: 'box',
          layout: 'baseline',
          contents: [
            {
              type: 'text',
              text: counter[i][j].toString() + 'x ',
              flex: 0,
              margin: 'sm',
              weight: 'regular'
            },
            {
              type: 'text',
              text: categories[i].menus[j].name,
              margin: 'lg',
              flex: 4,
              weight: 'bold',
              wrap: true
            },
            {
              type: 'text',
              text: (
                categories[i].menus[j].price * counter[i][j]
              ).toString(),
              size: 'sm',
              align: 'end',
              color: '#AAAAAA'
            }
          ]
        })
      }
    }
  }
  var contentsBodyPart1 = [
    {
      type: 'separator',
      margin: 'lg'
    },
    {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      margin: 'xl',
      contents: items
    },
    {
      type: 'separator',
      margin: 'lg',
      color: '#FFFFFF'
    }
  ]
  if (!(note === '' || note === null)) {
    contentsBodyPart1.push({
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'โน้ต',
          weight: 'bold'
        },
        {
          type: 'text',
          text: note,
          wrap: true
        },
        {
          type: 'spacer'
        }
      ]
    })
  }
  var contentsBodyPart2 = [
    {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'spacer'
        },
        {
          type: 'box',
          layout: 'baseline',
          contents: [
            {
              type: 'text',
              text: 'ค่าอาหาร',
              margin: 'lg',
              weight: 'bold',
              wrap: true
            },
            {
              type: 'text',
              text: total.toString(),
              size: 'sm',
              align: 'end',
              weight: 'bold',
              color: '#AAAAAA'
            }
          ]
        }
      ]
    },
    {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'box',
          layout: 'baseline',
          contents: [
            {
              type: 'text',
              text: 'ค่าจัดส่ง',
              margin: 'lg',
              weight: 'bold',
              wrap: true
            },
            {
              type: 'text',
              text: shipping.toString(),
              size: 'sm',
              align: 'end',
              weight: 'bold',
              color: '#AAAAAA'
            }
          ]
        }
      ]
    },
    {
      type: 'separator',
      margin: 'lg'
    },
    {
      type: 'box',
      layout: 'vertical',
      spacing: 'lg',
      margin: 'lg',
      contents: [
        {
          type: 'box',
          layout: 'baseline',
          contents: [
            {
              type: 'text',
              text: 'รวม',
              margin: 'xl',
              size: 'lg',
              align: 'start',
              gravity: 'center',
              weight: 'bold',
              wrap: true
            },
            {
              type: 'text',
              text: (shipping + total).toString(),
              size: 'sm',
              align: 'end',
              weight: 'bold',
              color: '#AAAAAA'
            }
          ]
        }
      ]
    }
  ]
  var contactBox = [
    {
      type: 'spacer'
    }
  ]
  if (!(address === '' || address === null)) {
    contactBox.push({
      type: 'text',
      text: address,
      wrap: true
    })
  }
  var contentsBody = contentsBodyPart1.concat(contentsBodyPart2)
  var headerBoxContents = [
    {
      'type': 'text',
      'text': 'Your Order',
      'size': 'lg',
      'gravity': 'center',
      'weight': 'bold',
      'color': '#3DC85B'
    }
  ]
  if (!(reciveType === '' || reciveType === null)) {
    headerBoxContents.push({
      'type': 'text',
      'text': reciveType,
      'align': 'end',
      'color': '#AAAAAA'
    })
  }
  var message = [
    {
      type: 'flex',
      altText: "You've got new order from Order2go",
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              contents: headerBoxContents
            },
            {
              type: 'text',
              text: shopName,
              margin: 'md',
              size: 'xl',
              weight: 'bold'
            },
            {
              type: 'text',
              text: customerName,
              margin: 'md',
              size: 'md',
              align: 'start',
              gravity: 'center',
              weight: 'regular',
              color: '#727070'
            },
            {
              type: 'box',
              layout: 'vertical',
              contents: contactBox.concat([
                {
                  type: 'text',
                  text: tel
                }
              ])
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: contentsBody
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Powered by Tiny POS',
              size: 'xxs',
              align: 'center',
              gravity: 'center',
              weight: 'regular',
              color: '#A5A2A2'
            }
          ]
        }
      }
    }
  ]
  liff
    .sendMessages(message)
    .then(function () {
      liff.closeWindow()
    })
    .catch(function () {
      liff.closeWindow()
    })
}

export default { sendMessage }
