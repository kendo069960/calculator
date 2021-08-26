const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const resultDisplay = $('.result-display')
const numberBtns = $$('button[data-number]')
const operationBtns = $$('button[data-operation]')
const undoBtn = $('button[value="Backspace"]')
const cleanBtn = $('button[value="Delete"]')
const calculateBtn = $('button[value="Enter"]')
const logHistory = $('#log-history')

const app = {
    history: [],
    variable: {
        preResult: '',
        calculatedResult: '',
    },
    
    appendNumber(total, number) {
        if (number === '.' && resultDisplay.textContent.includes('.')) {
            return total
        } else {
            return total += number
        }
    },

    scrollToLast() {
        let listHistory = logHistory.querySelectorAll("li");
        last = listHistory[listHistory.length-1];
        last.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
    },

    showHistory() {
        let log = ''
        this.history.forEach(function(item) {
            log += `
            <li>
                <div class="previous-expression">${item.expression} = </div>
                <div class="previous-result">${item.result}</div>
            </li>
            `
        })
        logHistory.innerHTML = log
    },

    handleEvents() {
        const _this = this
        const buttons = $$('button')
        const clearBtn = $('.clear-history')
        const themeChangeBtn = $('input[name="theme-change"]')
        const iTags = $$('i')

        document.onkeyup = function(event) {
            buttons.forEach(function(button){
                if (button.value === event.key) {
                    button.click()
                }
            })
        }

        document.addEventListener('click' , event => {
            let isChecked = $('input[name="history-window"]').checked
            const expandHistoryBtn = $('#history-btn')
            const clearTrashBtn = $('.clear-history')
            if (isChecked && 
                event.target.className !== 'toggle-btn-base' && 
                event.target !== expandHistoryBtn && 
                event.target.type === undefined && 
                event.target.localName !== 'i' && 
                event.target !== clearTrashBtn) {
                    expandHistoryBtn.click()
            }
        })

        themeChangeBtn.onchange = event => {
            if (event.target.checked) {
                document.documentElement.dataset.theme = 'dark'
                $('.theme-change-text').textContent = 'Swith to light theme'
            } else {
                document.documentElement.dataset.theme = 'light'
            }
        }

        clearBtn.onclick = () => {
            if (this.history.length) {
                this.scrollToLast()
            }
            this.history = []
            this.showHistory()
        }

        numberBtns.forEach((button) => {
            button.addEventListener('click', function () {
                _this.variable.calculatedResult = _this.appendNumber(_this.variable.calculatedResult, this.value)
                _this.render()
            })
        })

        operationBtns.forEach((button) => {
            button.addEventListener('click', function () {
                _this.variable.calculatedResult += ` ${this.value} `
                _this.render()
            })
        })

        undoBtn.onclick = () => {
            let result = resultDisplay.textContent
            this.variable.calculatedResult = result.substring(0, result.length - 1)
            this.render()
        }

        cleanBtn.onclick = () => {
            this.variable.preResult = ''
            this.variable.calculatedResult = ''
            this.render()
        }

        calculateBtn.onclick = (e) => {
            let result = resultDisplay.textContent
            if (result.includes(' ')) {
                this.variable.calculatedResult = eval(result).toLocaleString('en')
                this.variable.preResult = result
                if (this.variable.preResult != this.variable.calculatedResult) {
                    _this.history.push({ expression: this.variable.preResult, result: this.variable.calculatedResult})
                }
            }
            this.showHistory()
            this.render()
            this.variable.calculatedResult = ''
            this.scrollToLast()
        }

    },

    render() {
        const expressionDisplay = $('.expression-display')
        resultDisplay.textContent = this.variable.calculatedResult;
        expressionDisplay.textContent = this.variable.preResult
    },
    start() {

        this.showHistory()

        this.handleEvents()

        this.render()
    } 
}

app.start()


// const calculator = $('.calculator')



// const listActionElements = Array.from(buttons).filter(symbol => symbol.getAttribute('action'))
// const listActions = listActionElements.map(symbol => symbol.textContent)
// let printedArray = []
// let calculationArray = []
// let temArray = []

// document.onkeyup = function(event) {
//     buttons.forEach(function(button){
//         if (button.value === event.key) {
//             button.click()
//         }
//     })
// }

// buttons.forEach((button) => {
//     button.onclick = event => {
        

//         printedArray.push(event.target.textContent)
//         temArray.push(event.target.textContent)

//         // if (button.value === 'clear') {
//         //     printedArray.pop()
//         //     printedArray = []
//         //     temArray = []
//         //     calculationArray = []
//         // }
        
//         // if (button.value === 'Backspace') {
//         //     // pop lan 1 de bo gia tri Backspace
//         //     printedArray.pop()
//         //     printedArray.pop()
//         //     temArray.pop()
//         //     temArray.pop()
//         // }
        
                
//         if (event.target.getAttribute('action')) {
//             temArray.pop()

//             while (true) {
//                 if (temArray[0] == 0) {
//                     temArray.shift()
//                 } else {
//                     break
//                 }
//             }

//             console.log(temArray)
//             let isDuplicated = parseFloat(temArray.join('')).toString().length !== temArray.join('').length 

//             if (isDuplicated && temArray.length > 0) {
//                 display.style.backgroundColor = 'red'
//             }

//             calculationArray.push(parseFloat(temArray.join('')))
//             calculationArray.push(event.target.getAttribute('action'))
//             temArray = []
//         }
        
        
//         // if (button.value === 'Enter') {

//         //     console.log(calculationArray)
//         //     // printedArray.pop()
//         //     // temArray.forEach((symbol, index) => {
//         //     //     if (listActions.includes(symbol)) {    
//         //     //         const symbolElement = listActionElements.filter(button => button.textContent === symbol)[0]
//         //     //         temArray[index] = symbolElement.getAttribute('action')
//         //     //     }
//         //     // })
//         // }    


        
//         if (printedArray.length > 0) {
//             display.textContent = printedArray.join('')
//         } else {
//             display.textContent = "0"
//         }


//     }    
// })    


// buttons.forEach((button) => {
//     button.addEventListener('click', function () {
//         display.textContent += this.value
//     })
// })



// const handleCalculator = {
//     sum: (a, b) => {a + b},
//     subtract: (a, b) => {a - b},
//     multiply: (a, b) => {a * b},
//     divide: (a, b) => {a / b},
//     clean() {
//         console.log('clean')
//         display.textContent = ""
//     },
//     undo() {
//         console.log('undo')
//         let result = display.textContent
//         display.textContent = result.substring(0, result.length - 1)
//     },
//     calculate() {
//         let result = display.textContent
//         console.log(eval(result))
//         display.textContent = eval(result)
//     },

// }