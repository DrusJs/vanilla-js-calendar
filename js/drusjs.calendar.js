const calendarSelectValueElements = document.querySelectorAll('.calendar-select-value')
const calendarFrom = document.querySelector('.js-from')
const calendarTo = document.querySelector('.js-to')
const MONTH = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const MONTH_ENDING = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
const WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] 
const DATE = new Date()
const NOW_YEAR = DATE.getFullYear()
const LATE_YEAR = 1976

let DATE_TO = DATE, DATE_FROM = null
let isFirstDay = false
let isPeriod = false
let isTableToPath = false
let isLastDay = false
let tempDate
let dateFrom, dateTo = DATE



Date.prototype.daysInMonth = function() {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate()
}

if (calendarSelectValueElements.length) {
    for (let select of calendarSelectValueElements) {
        select.addEventListener('click', (event) => {
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
    clearInputs(container)
}


function clearInputs(element) {
    element.querySelector('.input.day').value = ""
    element.querySelector('.input.month').value = ""
    element.querySelector('.input.year').value = ""
    element.querySelector('.complete-date').innerHTML = ""
}

function setDate(element, date) {
    element.classList.add('complete')
    element.querySelector('.input.day').value = setTwoDigitsValue(date.getDate())
    element.querySelector('.input.month').value = date.getMonth()+1
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
    while (document.querySelector('.calendar-table-cell.active')) {
        document.querySelector('.calendar-table-cell.active').classList.remove('active')
    }
    while (document.querySelector('.calendar-table-cell.path')) {
        document.querySelector('.calendar-table-cell.path').classList.remove('path')
    }
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
                if (element.dataset.last) { isLastDay=true; return }
                isFirstDay = true
                if (table.dataset.ind==1) { isTableToPath = true }
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
}
createYearFields(LATE_YEAR, NOW_YEAR)

const calendarSelectDropdownElements = document.querySelectorAll('.calendar-select-dropdown')
if (calendarSelectDropdownElements.length) {
    for (let dropdown of calendarSelectDropdownElements) {
        dropdown.querySelectorAll('.calendar-select-dropdown__item').forEach(el => {
            el.addEventListener('click', (event) => {
                dropdown.parentElement.querySelector('.calendar-select-value').innerHTML = event.currentTarget.innerHTML
                event.currentTarget.closest('.calendar-select').classList.remove('active')
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
// createMonthTable(DATE, 0)
// createMonthTable(DATE, 1)

const calendarMainElements = document.querySelectorAll('.calendar-main')
if (calendarMainElements.length) {
    for (let item of calendarMainElements) {
        item.addEventListener('click', (event) => {
            let calendar =  event.currentTarget.parentElement
            let self = event.currentTarget
            if (!self.classList.contains('active')) {
                calendar.classList.add('active')
                if (calendar.classList.contains('complete')) {
                    calendar.classList.remove('complete')
                    calendar.querySelector('.year-select').querySelector('.calendar-select-value').innerHTML = isTO(calendar)?DATE_TO.getFullYear():DATE_FROM.getFullYear()
                    calendar.querySelector('.month-select').querySelector('.calendar-select-value').innerHTML = isTO(calendar)?MONTH[DATE_TO.getMonth()]:MONTH[DATE_FROM.getMonth()]
                    createMonthTable(isTO(calendar)?DATE_TO:DATE_FROM, isTO(calendar)?1:0)
                    calendar.querySelector(`[data-day="${isTO(calendar)?DATE_TO.getDate():DATE_FROM.getDate()}"]`).click()
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
}

