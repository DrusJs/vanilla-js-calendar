const calendarSelectValueElements = document.querySelectorAll('.calendar-select-value')
const MONTH = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] 
const DATE = new Date()
const NOW_YEAR = DATE.getFullYear()
const LATE_YEAR = 1976
let isFirstDay = false
let isPeriod = false
let isTableToPath = false
let isLastDay = false

Date.prototype.daysInMonth = function() {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

if (calendarSelectValueElements.length) {
    for (let select of calendarSelectValueElements) {
        select.addEventListener('click', (event) => {
            event.currentTarget.closest('.calendar-select').classList.toggle('active')
        })
    }
}

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
    for (let i=0; i<6; i++) {
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
createMonthTable(DATE, 0)
createMonthTable(DATE, 1)

