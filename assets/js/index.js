const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const resultDisplay = $('.result-display')
const numberBtns = $$('button[data-number]')
const operationBtns = $$('button[data-operation]')
const undoBtn = $('button[value="Backspace"]')
const cleanBtn = $('button[value="Delete"]')
const calculateBtn = $('button[value="Enter"]')
const logHistory = $('#log-history')
const listOfMathOperations = ['+', '-', '*', '/']

const app = {
    history: [],
    variable: {
        expression: '',
        calculatedResult: '',
    },
    
    appendNumber(total, number) {
        return (total.endsWith('.') && number === '.') ? total : total += number
    },

    showThousandSeparator(exp, res) {
        // Xu li expression
        const splitMathOperationsArray = exp.split(/(?=[-+*/()])/)
        splitMathOperationsArray.forEach((value, index) => {
            splitMathOperationsArray[index] = (listOfMathOperations.includes(value[0])) ? value.trim().split(' ') : value.trim()
        })
        const floatConverter = [].concat(...splitMathOperationsArray)
        floatConverter.forEach((value, index) => {
            floatConverter[index] = (listOfMathOperations.includes(value)) ? value : new Intl.NumberFormat().format(parseFloat(value))
        })

        const handleTextExpression = floatConverter.join(' ')

        // Xu li result
        let newRes = res
        const lengthOfNumber = 12
        if (res === parseFloat(res) && res.toFixed().toString().length < lengthOfNumber) {
            newRes = parseFloat(res.toFixed(lengthOfNumber - res.toFixed().toString().length))
        }
        const handleTextResult = (newRes.toString().length < 15) ? new Intl.NumberFormat('en-US', { maximumSignificantDigits: 15, maximumFractionDigits: 9 }).format(newRes) : newRes.toExponential(9)

        return { expResult: handleTextExpression, calResult: handleTextResult }
    },

    scrollToLast() {
        const listHistory = logHistory.querySelectorAll("li");
        let last = listHistory[listHistory.length-1];
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
                <span onclick="event.stopPropagation()" class="previous-expression">${item.expression} = </span>
                <span onclick="event.stopPropagation()" class="previous-result">${item.result}</span>
            </li>
            `
        })
        logHistory.innerHTML = log
    },

    handleEvents() {
        const _this = this
        const buttons = $$('button')
        const clearHistoryBtn = $('.clear-history')
        const themeChangeBtn = $('input[name="theme-change"]')
        
        document.onkeydown = function(event) {
            buttons.forEach(function(button){
                if (button.value === event.key) {
                    button.click()
                }
            })
        }
        
        document.addEventListener('click' , event => {
            const isInputThemeBtnChecked = $('input[name="history-window"]').checked
            const expandHistoryBtn = $('#history-btn')
            const clearTrashBtn = $('.clear-history')

            if (isInputThemeBtnChecked && 
                event.target !== $('.toggle-btn-base') && 
                event.target.type === undefined && 
                event.target.localName !== 'i' && 
                event.target.localName !== 'label' && 
                event.target !== expandHistoryBtn && 
                event.target !== clearTrashBtn) 
                {
                    expandHistoryBtn.click()
            }

            if (this.history.length) {
                this.scrollToLast()
            }
        })


        themeChangeBtn.onchange = event => {
            if (event.target.checked) {
                document.documentElement.dataset.theme = 'dark'
                $('.theme-change-text h1').textContent = 'light'
            } else {
                document.documentElement.dataset.theme = 'light'
                $('.theme-change-text h1').textContent = 'dark'
            }
        }

        clearHistoryBtn.onclick = () => {
            this.history = []
            this.showHistory()
        }

        numberBtns.forEach(button => {
            button.addEventListener('click', function () {
                _this.variable.calculatedResult = _this.appendNumber(_this.variable.calculatedResult, this.value)
                _this.render()
            })
        })

        operationBtns.forEach(button => {
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
            this.variable.expression = ''
            this.variable.calculatedResult = ''
            this.render()
        }

        calculateBtn.onclick = (e) => {
            const expPreHandle = resultDisplay.textContent.trim()
            
            if (listOfMathOperations.includes(expPreHandle.charAt(0))) {
                console.log(123)
            }

            if (expPreHandle.includes(' ')) {
                let preRes
                try {
                    eval(expPreHandle)
                } catch {
                    resultDisplay.classList.add('error')
                    setTimeout(() => {
                        resultDisplay.classList.remove('error')
                    }, 1000)
                } finally {
                    preRes = eval(expPreHandle)
                }

                const { expResult, calResult } = this.showThousandSeparator(expPreHandle, preRes)
                
                this.variable.expression = expResult
                this.variable.calculatedResult = calResult

                if (expResult != calResult) {
                    _this.history.push({ expression: expResult, result: calResult })
                }
            }
            this.showHistory()
            this.render()
            this.variable.calculatedResult = ''
        }

    },

    render() {
        const expressionDisplay = $('.expression-display')
        resultDisplay.textContent = this.variable.calculatedResult;
        expressionDisplay.textContent = this.variable.expression
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