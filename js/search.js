'use strict'
const input = document.getElementById('input')
const input_button = document.getElementById('search')
input_button.onclick = search
function search(){
    let words = input.value.split(' ')
    words = words.filter( (word) => word.length > 0 )
    words = words.map( (word) => {return word.toLowerCase()} )

    phones.forEach( (phone) => {
        let isGet = false
        words.forEach( (word) => {
            if (phone.name.indexOf(word) >= 0) {
                if  (isGet == false ) {
                    isGet = true
                    result.push(phone)
                }
            }
        } )


        if (isGet === false) {
            words.forEach( (word) => {
                if (phone.model.indexOf(word) >= 0) {
                    if  (isGet == false ) {
                        isGet = true
                        result.push(phone)
                    }
                }
            } )
        }


        console.log(result)
    })
}
let result = []