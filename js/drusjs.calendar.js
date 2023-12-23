const calendarSelectValueElements = document.querySelectorAll('.calendar-select-value')
const calendarFrom = document.querySelector('.js-from')
const calendarTo = document.querySelector('.js-to')
const calendarElement = document.querySelector('.drusjs-calendar')
const MONTH = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const MONTH_ENDING = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
const WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] 
const DATE = new Date()
const NOW_YEAR = DATE.getFullYear()
const LATE_YEAR = 1976

let isFirstDay = false
let isPeriod = false
let isTableToPath = false
let isLastDay = false
let isEdit = false
let tempDate
let dateFrom, dateTo = DATE



Date.prototype.daysInMonth = function() {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate()
}

if (calendarSelectValueElements.length) {
    for (let select of calendarSelectValueElements) {
        select.addEventListener('click', (event) => {
            if (event.currentTarget.closest('.month-select') && event.currentTarget.closest('.calendar').querySelector('.input.year').value == "") {return}   
            event.currentTarget.closest('.calendar-select').classList.toggle('active')         
        })
    }
}

function isTO(calendar) {
    return calendar.classList.contains('js-to')
}

function clearDateField(element, isDateFrom) {
    let container = element.closest('.calendar')
    container.classList.remove('complete')
    isDateFrom?dateFrom=null:dateTo=null
    container.querySelectorAll('.calendar-table').innerHTML = ''
    clearInputs(container)
    container.querySelectorAll('.calendar-select-head').forEach(el=>{
        el.classList.add('none-select')
    })
}



function clearInputs(element) {
    element.querySelector('.input.day').value = ""
    element.querySelector('.input.month').value = ""
    element.querySelector('.input.year').value = ""
    element.querySelector('.complete-date').innerHTML = ""
}

function checkToSetDate(calendar) {
    let d = calendar.querySelector('.input.day').value
    let m = calendar.querySelector('.input.month').value
    let y = calendar.querySelector('.input.year').value
    if (d && m && y) {
        let date = new Date(y,m-1,d)
        setDate(calendar, date)
    } else {
        calendar.classList.remove('active')
    }
    // if (isTO(calendar)) {dateTo = new Date(y, m, d)} else {dateFrom = new Date(y, m, d)}
    // console.log(dateFrom, y, m, d);
}

function setDate(element, date) {
    element.classList.add('complete')
    element.querySelector('.input.day').value = setTwoDigitsValue(date.getDate())
    element.querySelector('.input.month').value = setTwoDigitsValue(+date.getMonth()+1)
    element.querySelector('.input.year').value = date.getFullYear()
    element.querySelector('.complete-date').innerHTML = createCompleteDate(date)
}

function createCompleteDate(date) {
    return `${setTwoDigitsValue(date.getDate())}  ${MONTH_ENDING[date.getMonth()]}  ${date.getFullYear()}`
}
function setTwoDigitsValue(date) {
    return +date<10?'0'+date:date
}

setDate(calendarTo, DATE)

function clearCalendars() {
    document.querySelectorAll('.calendar-table-cell.active').forEach(el=>{
        el.classList.remove('active')
    })
    document.querySelectorAll('.calendar-table-cell.path').forEach(el=>{
        el.classList.remove('path')
    })

    isFirstDay = false 
    isPeriod = false
    isTableToPath = false 
}

function setPath(table, day, isFirst) {
    if (isFirst) {
        let counter = +day.dataset.day + 1
        let temp = table.querySelector(`[data-day="${counter}"]`)
        while (temp) {
            temp.classList.add('path')
            counter++
            temp = table.querySelector(`[data-day="${counter}"]`)
        }
    } else {
        let counter = 1
        let temp = table.querySelector(`[data-day="${counter}"]`)
        while (temp!=day) {
            temp.classList.add('path')
            counter++
            temp = table.querySelector(`[data-day="${counter}"]`)
        }
    }
}

function calendarTableCellAction(element) {
    if (element.classList.contains('active')) { return }
    if (isPeriod) { clearCalendars() }
    if (isLastDay) { isLastDay=false; document.querySelector('.calendar-table-cell.active').classList.remove('active') }
    let table = element.closest('table.calendar-table')
    let activeCell = table.querySelector('.calendar-table-cell.active')
    if (isFirstDay && isTableToPath && table.dataset.ind==0) { throw new Error('Начальный день больше конечного!') }
    if (activeCell) {
        let pathLength = element.dataset.day - activeCell.dataset.day
        if (pathLength<0) { throw new Error('Начальный день больше конечного!') }
        for (let i=1; i<pathLength; i++) {
            table.querySelector(`[data-day="${+activeCell.dataset.day + i}"]`).classList.add('path')
        }
        element.classList.add('active')
        isPeriod = true
    } else if (isFirstDay) {
                isPeriod = true
                element.classList.add('active')
                let pathTables = document.querySelectorAll('.calendar-table')
                setPath(pathTables[0], pathTables[0].querySelector('.calendar-table-cell.active'), true)
                setPath(pathTables[1], element, false)
            } else {
                element.classList.add('active')
                element.closest('.calendar').querySelector('input.day').value = setTwoDigitsValue(element.innerHTML)
                if (element.dataset.last) { isLastDay=true; return }
                isFirstDay = true
                if (table.dataset.ind==1) { isTableToPath = true }
            }
}
function eventCalendarChangeTable(calendar, isInput = false) {
    let d = calendar.querySelector('.input.day').value
    let m = calendar.querySelector('.input.month').value
    let y = calendar.querySelector('.input.year').value
    if (m && y) {
        clearCalendars()
        isTO(calendar)?createMonthTable(new Date(y, m-1), 1):createMonthTable(new Date(y, m-1), 0)
        if (d) {
            calendar.querySelector(`[data-day="${d}"]`).click()
        }
    }
}

function createMonthFields(month) {
    document.querySelectorAll('.month-select .calendar-select-dropdown').forEach(el => {
        for (let item of month) {
            let element = document.createElement('div')
            element.classList.add('calendar-select-dropdown__item')
            element.innerHTML = item
            el.append(element)
        }
    })
    document.querySelectorAll('.month-select').forEach(el => {
        el.querySelector('.calendar-select-swap.left').addEventListener('click', (event)=> {
            if (MONTH.indexOf(event.currentTarget.nextElementSibling.innerHTML)>0) {
                event.currentTarget.nextElementSibling.innerHTML = MONTH[MONTH.indexOf(event.currentTarget.nextElementSibling.innerHTML)-1]
                event.currentTarget.closest('.calendar').querySelector('.input.month').value = setTwoDigitsValue(+MONTH.indexOf(event.currentTarget.nextElementSibling.innerHTML)+1)
                eventCalendarChangeTable(event.currentTarget.closest('.calendar'))
                event.currentTarget.nextElementSibling.nextElementSibling.classList.remove('disabled-hide')
                if (MONTH.indexOf(event.currentTarget.nextElementSibling.innerHTML)==0) {
                    event.currentTarget.classList.add('disabled-hide')
                } 
            } else {
                event.currentTarget.classList.add('disabled-hide')
            }

        })
        el.querySelector('.calendar-select-swap.right').addEventListener('click', (event)=> {
            if (MONTH.indexOf(event.currentTarget.previousElementSibling.innerHTML)<11){
                event.currentTarget.previousElementSibling.innerHTML = MONTH[MONTH.indexOf(event.currentTarget.previousElementSibling.innerHTML)+1]
                event.currentTarget.closest('.calendar').querySelector('.input.month').value = setTwoDigitsValue(+MONTH.indexOf(event.currentTarget.previousElementSibling.innerHTML)+1)
                eventCalendarChangeTable(event.currentTarget.closest('.calendar'))
                event.currentTarget.previousElementSibling.previousElementSibling.classList.remove('disabled-hide')
                if (MONTH.indexOf(event.currentTarget.previousElementSibling.innerHTML)==11) {
                    event.currentTarget.classList.add('disabled-hide')
                } 
            } else {
                event.currentTarget.classList.add('disabled-hide')
            }      
        })
    })
    
}
createMonthFields(MONTH)


function createYearFields(from, to) {
    document.querySelectorAll('.year-select .calendar-select-dropdown').forEach(el => {
        for (let i=0; i<=to-from; i++) {
            let element = document.createElement('div')
            element.classList.add('calendar-select-dropdown__item')
            element.innerHTML = to - i
            el.append(element)
        }
    })
    document.querySelectorAll('.year-select').forEach(el => {
        el.querySelector('.calendar-select-swap.left').addEventListener('click', (event)=> {
            if (+event.currentTarget.nextElementSibling.innerHTML>LATE_YEAR) {
                event.currentTarget.nextElementSibling.innerHTML = +event.currentTarget.nextElementSibling.innerHTML - 1
                event.currentTarget.closest('.calendar').querySelector('.input.year').value = event.currentTarget.nextElementSibling.innerHTML     
                eventCalendarChangeTable(event.currentTarget.closest('.calendar'))
                event.currentTarget.nextElementSibling.nextElementSibling.classList.remove('disabled-hide')
                if (+event.currentTarget.nextElementSibling.innerHTML==LATE_YEAR) {
                    event.currentTarget.classList.add('disabled-hide')
                } 
            } else {
                event.currentTarget.classList.add('disabled-hide')
            }
      
        })
        el.querySelector('.calendar-select-swap.right').addEventListener('click', (event)=> {
            if (+event.currentTarget.previousElementSibling.innerHTML<DATE.getFullYear()) {
                event.currentTarget.previousElementSibling.innerHTML = +event.currentTarget.previousElementSibling.innerHTML + 1
                event.currentTarget.closest('.calendar').querySelector('.input.year').value = event.currentTarget.previousElementSibling.innerHTML 
                eventCalendarChangeTable(event.currentTarget.closest('.calendar'))
                event.currentTarget.previousElementSibling.previousElementSibling.classList.remove('disabled-hide')
                if (+event.currentTarget.previousElementSibling.innerHTML>=DATE.getFullYear()) {
                    event.currentTarget.classList.add('disabled-hide')
                } 
            } else {
                event.currentTarget.classList.add('disabled-hide')
            }
         
        })
    })
}
createYearFields(LATE_YEAR, NOW_YEAR)

const calendarSelectDropdownElements = document.querySelectorAll('.calendar-select-dropdown')
if (calendarSelectDropdownElements.length) {
    for (let dropdown of calendarSelectDropdownElements) {
        dropdown.querySelectorAll('.calendar-select-dropdown__item').forEach(el => {
            el.addEventListener('click', (event) => {
                dropdown.parentElement.querySelector('.calendar-select-value').innerHTML = event.currentTarget.innerHTML
                dropdown.parentElement.firstElementChild.classList.remove('none-select')             
                event.currentTarget.closest('.calendar-select').classList.remove('active')
                if (dropdown.parentElement.classList.contains('year-select')) {
                    dropdown.closest('.calendar').querySelector('.input.year').value = event.currentTarget.innerHTML
                } else {
                    dropdown.closest('.calendar').querySelector('.input.month').value = setTwoDigitsValue(+MONTH.indexOf(event.currentTarget.innerHTML)+1)
                }
                eventCalendarChangeTable(dropdown.closest('.calendar'))
            })
        })
    }
}

const calendarTableElements = document.querySelectorAll('.calendar-table')

function createMonthTable(date, num) {
    let table = calendarTableElements[num]
    let temp = new Date(date.getFullYear(), date.getMonth(), 1)
    let firstDay = WEEK.indexOf(WEEK[temp.getDay()-1])
    let cellCount = 1
    let dayCount = date.daysInMonth()
    table.innerHTML = ''
    for (let i=0; i<7; i++) {
        let row = document.createElement('tr')
        row.classList.add('calendar-table-row')
        if (!i) {row.classList.add('head')}
        for (let j=0; j<7; j++) {
            let element = !i?document.createElement('th'):document.createElement('td')
            element.classList.add('calendar-table-cell')
            if (!i) { element.innerHTML = WEEK[j]; row.append(element); continue }
            if ((i==1 && j<firstDay) || cellCount>dayCount) { element.classList.add('empty'); row.append(element); continue }
            element.innerHTML = cellCount
            element.dataset.day = cellCount
            if (num==1 && cellCount==dayCount) { element.dataset.last = true }
            element.onclick = () => { calendarTableCellAction(element) }
            row.append(element)
            cellCount++
        }
        table.append(row)      
    }
}

const calendarMainElements = document.querySelectorAll('.calendar-main')
if (calendarMainElements.length) {
    for (let item of calendarMainElements) {
        item.addEventListener('click', (event) => {
            if (!isEdit){
                let calendar =  event.currentTarget.parentElement
                let self = event.currentTarget
                isEdit = true
                if (!self.classList.contains('active')) {
                    calendar.classList.add('active')
                    if (calendar.classList.contains('complete')) {
                        calendar.classList.remove('complete')
                        calendar.querySelector('.year-select').querySelector('.calendar-select-value').innerHTML = isTO(calendar)?dateTo.getFullYear():dateFrom.getFullYear()
                        calendar.querySelector('.month-select').querySelector('.calendar-select-value').innerHTML = isTO(calendar)?MONTH[dateTo.getMonth()]:MONTH[dateFrom.getMonth()]
                        createMonthTable(isTO(calendar)?dateTo:dateFrom, isTO(calendar)?1:0)
                        calendar.querySelector(`[data-day="${isTO(calendar)?dateTo.getDate():dateFrom.getDate()}"]`).click()
                    }
                }
            }
        })
    }
}

const inputElements = document.querySelectorAll('.input')
if (inputElements.length) {
    for (let item of inputElements) {
        item.addEventListener('keydown', function(event) {
            if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
                (event.keyCode == 65 && event.ctrlKey === true) ||
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                return;
            } else {
                if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                    event.preventDefault();
                }
            }
        });
    }

    document.querySelectorAll('.input.day').forEach(el=>{
        el.addEventListener('keydown', function(event) {
            
        })
        el.addEventListener('input', function(event) {            
            if (el.value.length == 2) {
                el.nextElementSibling.nextElementSibling.focus()
            }
        }) 
        el.addEventListener('blur', function() {
            this.value = this.value.length==1?setTwoDigitsValue(this.value):this.value
            eventCalendarChangeTable(this.closest('.calendar'))
        })
    })
    document.querySelectorAll('.input.month').forEach(el=>{
        el.addEventListener('keydown', function(event) {            
            
        })  
        el.addEventListener('input', function(event) {            
            if (el.value.length == 2) {
                el.nextElementSibling.nextElementSibling.focus()
            }
        }) 
        el.addEventListener('blur', function() {
            this.value = this.value.length==1?setTwoDigitsValue(this.value):this.value
            eventCalendarChangeTable(this.closest('.calendar'))
        })
    })

    document.querySelectorAll('.input.year').forEach(el=>{
        el.addEventListener('blur', function() {
            eventCalendarChangeTable(this.closest('.calendar'))
        })
    })


}

// window.addEventListener('click', (event)=> {
//     if (!calendarElement.contains(event.target)) {
//         calendarFrom.classList.remove('active')
//         calendarTo.classList.remove('active')
//         setDate(calendarTo, DATE)
//     }
// })


document.querySelector('.accept-changes').addEventListener('click', function () {
    let calendar = document.querySelector('.calendar.active')
    calendar.classList.remove('active')
    isEdit = false
    checkToSetDate(calendar)
})
