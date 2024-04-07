'use strict'

const product_div = document.getElementById('catalog')

const cartspan = document.getElementById('cartspan')

let smartphoneCounter = 0

let ordersList = []

const storageOrders = localStorage.getItem("orders")

if(storageOrders) {
    ordersList = JSON.parse(storageOrders)
    if (ordersList.length > 0) {
        for (let i = 0; i < ordersList.length; i++)
            smartphoneCounter += ordersList[i].number
    }
    cartspan.innerText = smartphoneCounter
}

const pageName = getPageName()

function getPageName() {
    const URL = location.href.split('?')[0]
    return URL.split('/').pop().split('.')
}

// функция обновления заказа в памяти программы и локального хранилища
function checkOrder( phoneBrandAndName, action = null ) {
    for (let i = 0; i < ordersList.length; i++) { // перебираем все что уже было заказано
        if (ordersList[i].name === phoneBrandAndName) { // ищем заказ с названием phoneBrandAndName

            if (action === '+') { // если это было добавление заказа
                ordersList[i].number++ // увеличиваем счетчик
                localStorage.setItem("orders", JSON.stringify(ordersList)) // обновляем хранилище
            }

            if (action === '-') { // если это было удаление заказа
                ordersList[i].number-- // уменьшаем счетчик
                if (ordersList[i].number === 0) { // если число заказов данной модели = 0
                    // оставляем в массиве заказов все заказы кроме этого (фильтруем)
                    ordersList = ordersList.filter( phone => phone.name !== phoneBrandAndName)
                    localStorage.setItem("orders", JSON.stringify(ordersList)) // обновляем хранилище
                    return 0 // возвращаем число заказов данной модели
                }
            }

            return ordersList[i].number // возвращаем число заказов данной модели
        }
    }

    // если это запрос на получение числа заказов и заказов данной модели нет - возвращаем 0
    if (action === null) return 0

    // если этой модели нет в заказах и action != null - значит это новый заказ
    ordersList.push({name: phoneBrandAndName, number: 1}) // добавляем объект с заказом в массив заказов
    localStorage.setItem("orders", JSON.stringify(ordersList)) // обновляем хранилище
    return 1 // возвращаем число заказов данной модели
}


function addSmartphoneToDiv(smartphone){
    
    console.log(smartphone, div)

    const numberOfOrdered = checkOrder( smartphone.brand + ' ' + smartphone.model) // определяем полное название товара

    // если мы на странице 'cart' (корзина) и товар не заказан - выходим из функции
    if (pageName === 'cart' && numberOfOrdered < 1) return

    let div_bg = document.createElement('div')
    div_bg.className = 'phone-bg'

    let div_img = document.createElement('div')
    div_img.className = 'phone-img'
    div_bg.append(div_img)

    let image = document.createElement('img')
    image.src = smartphone.image
    div_img.append(image)

    let div_description = document.createElement('div')
    div_description.className = 'phone-description'
    div_bg.append(div_description)

    let name = document.createElement('h3')
    name.innerHTML = `${smartphone.name} <span>${smartphone.model}</span>`
    div_description.append(name)

    let ROM = document.createElement('p')
    ROM.innerHTML = `встроенная память: <span>${smartphone.ROM} Гб</span>`
    div_description.append(ROM)

    let RAM = document.createElement('p')
    RAM.innerHTML = `оперативная память: <span>${smartphone.RAM} Гб</span>`
    div_description.append(RAM)

    let battery = document.createElement('p')
    battery.innerHTML = `батарея: <span>${smartphone.battery} Мл/ч</span>`
    div_description.append(battery)

    let weight = document.createElement('p')
    weight.innerHTML = `вес: <span>${smartphone.weight} Г</span>`
    div_description.append(weight)

    let camera = document.createElement('p')
    camera.innerHTML = `камера: <span>${smartphone.camera} Мп</span>`
    div_description.append(camera)

    let screen = document.createElement('p')
    screen.innerHTML = `экран: <span>${smartphone.weight} "</span>`
    div_description.append(screen)

    let order = document.createElement('div')
    order.className = 'order'
    div_description.append(order)

    let price = document.createElement('div')
    price.innerHTML = `${smartphone.price} $`
    order.append(price)

    const orderButtonContainer = document.createElement('div')
    // вызываем функцию, заполняющую информацию о заказе (кнопку "ЗАКАЗАТЬ" или счетчик и редактор заказа модели)
    updatePhoneCardOrder(orderButtonContainer, numberOfOrdered)

    order.append(orderButtonContainer)

    product_div.append(div_bg)
}

// функция заполнения информации о заказе в карточке товара (кнопка "ЗАКАЗАТЬ" или счетчик и редактор заказа модели)
function updatePhoneCardOrder(orderButtonContainer, numberOfOrdered) {
    // очищаем тег от предыдущих элементов
    orderButtonContainer.innerHTML = ''

    // если товар еще не заказан - создаем кнопку "ЗАКАЗАТЬ"
    if (numberOfOrdered === 0) {
        const button = document.createElement('button')
        button.className = 'add-to-cart-first'
        button.innerText = 'Купить'
        button.onclick = addToCartClicked
        orderButtonContainer.append(button)
    } else {
        // если товар уже заказан - добавляем счетчик и кнопки для редактирования заказа
        const orderTitle = document.createElement('span')
        orderTitle.className = 'order-title'
        orderTitle.innerText = 'В КОРЗИНЕ :'
        orderButtonContainer.append(orderTitle)

        const addButton = document.createElement('button')
        addButton.className = 'add-to-cart'
        addButton.innerText = '+'
        addButton.onclick = addToCartClicked
        orderButtonContainer.append(addButton)

        const orderCounter = document.createElement('span')
        orderCounter.className = 'order-counter'
        orderCounter.innerText = numberOfOrdered
        orderButtonContainer.append(orderCounter)

        const removeButton = document.createElement('button')
        removeButton.className = 'remove-from-cart'
        removeButton.innerText = '-'
        removeButton.onclick = removeFromCartClicked
        orderButtonContainer.append(removeButton)
    }
}

// функция, вызываемая при клике на добавление (увеличение) заказа
function addToCartClicked( event ) {
    const button = event.target
    const orderButtonContainer = button.parentElement
    const phoneCard = orderButtonContainer.parentElement.parentElement.parentElement.parentElement
    const h3 = phoneCard.querySelector('h3')
    const name = h3.innerText
    const numberOfOrdered = checkOrder( name, '+' )

    smartphoneCounter++
    headerCartCounter.innerText = smartphoneCounter

    updatePhoneCardOrder(orderButtonContainer, numberOfOrdered)
}

// функция, вызываемая при клике на удаление (уменьшение) заказа
function removeFromCartClicked( event ) {
    const button = event.target
    const orderButtonContainer = button.parentElement
    const phoneCard = orderButtonContainer.parentElement.parentElement.parentElement.parentElement
    const h3 = phoneCard.querySelector('h3')
    const name = h3.innerText
    const numberOfOrdered = checkOrder( name, '-' )

    smartphoneCounter--
    headerCartCounter.innerText = smartphoneCounter

    if (pageName === 'cart' && numberOfOrdered === 0) {
        phoneCard.remove() // если мы в корзине и заказ полностью удален - удаляем его карточку
        if (smartphoneCounter === 0) {
            const info = `<h4 style="text-align: center">У вас нет заказов. Перейдите <a href="./catalog.html">в каталог</a> для выбора смартфонов.</h4>`
            catalog.innerHTML = info
        }
    }
    else {
        updatePhoneCardOrder(orderButtonContainer, numberOfOrdered)
    }
}

// если мы на странице 'cart' и заказов нет - выводим текст сл ссылкой на каталог
if (pageName === 'cart' && smartphoneCounter < 1) {
    const info = `<h4 style="text-align: center">У вас нет заказов. Перейдите <a href="./catalog.html">в каталог</a> для выбора смартфонов.</h4>`
    catalog.innerHTML = info
    console.log('test 2')
}
else {
    if (pageName === 'cart' || pageName === 'index')
    // если мы в каталоге или на странице 'cart' с заказами - заполняем каталог товарами
    phones.forEach( addSmartphoneToDiv ) // для каждого смартфона вызывается функция добавления в каталог
    console.log('test 3', phones)
}