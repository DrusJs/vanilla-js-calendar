const MONTH = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const MONTH_ENDING = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
const WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] 
const NOW_DATE = new Date()
const NOW_YEAR = NOW_DATE.getFullYear()
const LATE_YEAR = 1996
const ERROR_MESSAGES = ['Дата начала периода превышает дату окончания', 'Выберите дату не позднее сегодняшнего дня']

const calendarElement = document.querySelector('.drusjs-calendar')
const calendarFrom = document.querySelector('.js-from')
const calendarTo = document.querySelector('.js-to')
const errorElement = document.querySelector('.calendar-error-field')


let dateFrom = ['','','']
let dateTo = NOW_DATE
let tempInputValue
let yearArray = new Array(), tempArray = new Array()

Date.prototype.daysInMonth = function() {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate()
}

const calendarSelectValueElements = document.querySelectorAll('.calendar-select-value')
if (calendarSelectValueElements.length) {
    for (let select of calendarSelectValueElements) {
        select.addEventListener('click', (event) => {
            if (event.currentTarget.closest('.month-select') && event.currentTarget.closest('.calendar').querySelector('.input.year').value == "") {return}
            let cont = event.currentTarget.closest('.calendar-select')
            if (cont.classList.contains('active')) {
                cont.classList.remove('active')
            } else {
                if (document.querySelector('.calendar-select.active')) {
                    document.querySelector('.calendar-select.active').classList.remove('active')
                }
                cont.classList.add('active')
            }
            if (event.currentTarget.closest('.month-select')) {
                document.querySelector('.calendar-top-text').innerHTML = 'Выберите месяц'
            } else {
                document.querySelector('.calendar-top-text').innerHTML = 'Выберите год'
            }
        })
    }
}

function isTO(calendar) {
    return calendar.classList.contains('js-to')
}

function isTOElement(element) {
    return calendarTo.contains(element)
}

function clearDateField(element, isDateFrom) {
        let container = element.closest('.calendar')
        container.classList.remove('complete')
        container.classList.remove('clear')
        isDateFrom?dateFrom=['','','']:dateTo=['','','']
        container.querySelector('.calendar-table').innerHTML = ''
        container.querySelector('.year-select .calendar-select-value').innerHTML = 'Выберите год'
        container.querySelector('.month-select .calendar-select-value').innerHTML = 'Выберите месяц'
        clearInputs(container)
        errorElement.classList.remove('active')
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
        if (isTO(calendar)) {dateTo = date} else {dateFrom = date}
        setDate(calendar, date)
        if (document.querySelectorAll('.calendar.complete').length == 2) {
            if (dateFrom.getTime()>dateTo.getTime()) {
                console.log(dateFrom, dateTo, dateFrom.getTime()> dateTo.getTime());
                errorElement.classList.add('active')
                errorElement.lastElementChild.innerHTML = ERROR_MESSAGES[0]
                return
            }
        }
        if (calendarTo.classList.contains('complete')) {
            if (dateTo > NOW_DATE) {
                errorElement.classList.add('active')
                errorElement.lastElementChild.innerHTML = ERROR_MESSAGES[1]
            }
        }
    } else {
        calendar.classList.remove('active')
        calendar.querySelector('.calendar-table').innerHTML = ''
        calendar.querySelector('.year-select .calendar-select-value').innerHTML = 'Выберите год'
        calendar.querySelector('.month-select .calendar-select-value').innerHTML = 'Выберите месяц'
        clearInputs(calendar)
        isTO(calendar)?dateTo=['','','']:dateFrom=['','','']
    }    
}

function setDate(element, date) {
    if (Array.isArray(date)) {
        element.querySelector('.input.day').value = setTwoDigitsValue(date[2])
        element.querySelector('.input.month').value = setTwoDigitsValue(date[1])
        element.querySelector('.input.year').value = date[0]
        element.querySelector('.complete-date').innerHTML = ''
    } else {
        element.querySelector('.input.day').value = setTwoDigitsValue(date.getDate())
        element.querySelector('.input.month').value = setTwoDigitsValue(+date.getMonth()+1)
        element.querySelector('.input.year').value = date.getFullYear()
        element.querySelector('.complete-date').innerHTML = createCompleteDate(date)
        element.classList.add('complete')
    }
}

function createCompleteDate(date) {
    return `${setTwoDigitsValue(date.getDate())}  ${MONTH_ENDING[date.getMonth()]}  ${date.getFullYear()}`
}

function setTwoDigitsValue(date) {
    if (date=='') {return ''}
    return +date<10?'0'+date:date
}

setDate(calendarTo, NOW_DATE)

function clearCalendar(table) {
    table.querySelectorAll('.calendar-table-cell.active').forEach(el=>{
        el.classList.remove('active')
    })
    table.querySelectorAll('.calendar-table-cell.path').forEach(el=>{
        el.classList.remove('path')
    })
}

function setPath(isFirst) {
    if (isFirst) {
        let table = calendarFrom.querySelector('.calendar-table')
        let day = table.querySelector('.active')
        let counter = +day.dataset.day + 1
        let temp = table.querySelector(`[data-day="${counter}"]`)
        table.querySelectorAll('.calendar-table-cell.path').forEach(el=>{
            el.classList.remove('path')
        })
        while (temp) {
            temp.classList.add('path')
            counter++
            temp = table.querySelector(`[data-day="${counter}"]`)
        }
    } else {
        let table = calendarTo.querySelector('.calendar-table')
        let day = table.querySelector('.active')
        let counter = 1
        let temp = table.querySelector(`[data-day="${counter}"]`)
        table.querySelectorAll('.calendar-table-cell.path').forEach(el=>{
            el.classList.remove('path')
        })
        while (temp!=day) {
            temp.classList.add('path')
            counter++
            temp = table.querySelector(`[data-day="${counter}"]`)
        }
    }
}

function calendarTableCellAction(element) {
    if (element.classList.contains('active')) { return }
    let table = element.closest('table.calendar-table')   
    let activeCell = table.querySelector('.calendar-table-cell.active')
    if (activeCell) {
        activeCell.classList.remove('active')
    }
    if (document.querySelector('.calendar-table-cell.active')) {
        element.classList.add('active')
        element.closest('.calendar').querySelector('input.day').value = setTwoDigitsValue(element.innerHTML)
        setPath(true)
        setPath(false)
    } else {
        element.classList.add('active')
        element.closest('.calendar').querySelector('input.day').value = setTwoDigitsValue(element.innerHTML)
    } 
    eventSetActiveBar(element.closest('.calendar'))

}

function eventCalendarChangeTable(calendar) {
    let d = calendar.querySelector('.input.day').value
    let m = calendar.querySelector('.input.month').value
    let y = calendar.querySelector('.input.year').value
    if (m && y) {
        clearCalendar(calendar.querySelector('.calendar-table'))
        isTO(calendar)?createMonthTable(new Date(y, m-1), 1):createMonthTable(new Date(y, m-1), 0)
        if (d) {
            if (d[0]==0) {d=d[1]}
            calendar.querySelector(`[data-day="${d}"]`).click()
        }
    }
}

function eventSetActiveBar(calendar) {
    let d = calendar.querySelector('.input.day').value
    let m = calendar.querySelector('.input.month').value
    let y = calendar.querySelector('.input.year').value
    if (isTO(calendar)) {
        let temp = Array.isArray(dateTo)?dateTo:[dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate()]
        let checkDate = [y, m-1, d]
        for (let i=0; i<3; i++) {
            if (temp[i] != checkDate[i]) {
                document.querySelector('.calendar-action-bar').classList.add('active')
                return
            }
        }
        document.querySelector('.calendar-action-bar').classList.remove('active')
    } else {
        let temp = Array.isArray(dateFrom)?dateFrom:[dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate()]
        let checkDate = [y, m-1, d]
        for (let i=0; i<3; i++) {
            if (temp[i] != checkDate[i]) {
                document.querySelector('.calendar-action-bar').classList.add('active')
                return
            }
        }
        document.querySelector('.calendar-action-bar').classList.remove('active')
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
                eventSetActiveBar(event.currentTarget.closest('.calendar'))
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
                eventSetActiveBar(event.currentTarget.closest('.calendar'))
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
        yearArray = []
        for (let i=0; i<=to-from; i++) {
            let element = document.createElement('div')
            element.classList.add('calendar-select-dropdown__item')
            element.innerHTML = to - i
            yearArray.push(to-i)
            el.append(element)
        }
    })
    document.querySelectorAll('.year-select').forEach(el => {
        el.querySelector('.calendar-select-swap.left').addEventListener('click', (event)=> {
            if (+event.currentTarget.nextElementSibling.innerHTML>=0) {
                event.currentTarget.nextElementSibling.innerHTML = +event.currentTarget.nextElementSibling.innerHTML - 1
                event.currentTarget.closest('.calendar').querySelector('.input.year').value = event.currentTarget.nextElementSibling.innerHTML     
                eventCalendarChangeTable(event.currentTarget.closest('.calendar'))
                eventSetActiveBar(event.currentTarget.closest('.calendar'))
                event.currentTarget.nextElementSibling.nextElementSibling.classList.remove('disabled-hide')
                if (+event.currentTarget.nextElementSibling.innerHTML==0) {
                    event.currentTarget.classList.add('disabled-hide')
                } 
            } else {
                event.currentTarget.classList.add('disabled-hide')
            }
      
        })
        el.querySelector('.calendar-select-swap.right').addEventListener('click', (event)=> {
            if (+event.currentTarget.previousElementSibling.innerHTML<NOW_DATE.getFullYear()) {
                event.currentTarget.previousElementSibling.innerHTML = +event.currentTarget.previousElementSibling.innerHTML + 1
                event.currentTarget.closest('.calendar').querySelector('.input.year').value = event.currentTarget.previousElementSibling.innerHTML 
                eventCalendarChangeTable(event.currentTarget.closest('.calendar'))
                eventSetActiveBar(event.currentTarget.closest('.calendar'))
                event.currentTarget.previousElementSibling.previousElementSibling.classList.remove('disabled-hide')
                if (+event.currentTarget.previousElementSibling.innerHTML>=NOW_DATE.getFullYear()) {
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
                document.querySelector('.calendar-top-text').innerHTML = 'Выберите период'
                dropdown.parentElement.querySelector('.calendar-select-value').innerHTML = event.currentTarget.innerHTML
                dropdown.parentElement.firstElementChild.classList.remove('none-select')             
                event.currentTarget.closest('.calendar-select').classList.remove('active')
                if (dropdown.parentElement.classList.contains('year-select')) {
                    dropdown.closest('.calendar').querySelector('.input.year').value = event.currentTarget.innerHTML
                } else {
                    dropdown.closest('.calendar').querySelector('.input.month').value = setTwoDigitsValue(+MONTH.indexOf(event.currentTarget.innerHTML)+1)
                }
                eventCalendarChangeTable(dropdown.closest('.calendar'))
                eventSetActiveBar(dropdown.closest('.calendar'))
            })
        })
    }
}

const calendarTableElements = document.querySelectorAll('.calendar-table')

function createMonthTable(date, num) {
    let table = calendarTableElements[num]
    let temp = new Date(date.getFullYear(), date.getMonth(), 1)
    let firstDay = +temp.getDay()-1
    if (firstDay==-1) {firstDay = 6}
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
            errorElement.classList.remove('active')
            document.querySelector('.calendar-action-bar').classList.remove('active')
            let calendar = event.currentTarget.parentElement
            let self = event.currentTarget
            if (!self.classList.contains('active')) {
                calendar.classList.add('active')
                if (calendar.classList.contains('complete')) {
                    calendar.classList.remove('complete')
                    calendar.classList.add('clear')
                    calendar.querySelector('.year-select .calendar-select-value').innerHTML = isTO(calendar)?dateTo.getFullYear():dateFrom.getFullYear()
                    calendar.querySelector('.month-select .calendar-select-value').innerHTML = isTO(calendar)?MONTH[dateTo.getMonth()]:MONTH[dateFrom.getMonth()]
                    createMonthTable(isTO(calendar)?dateTo:dateFrom, isTO(calendar)?1:0)
                    calendar.querySelector(`[data-day="${isTO(calendar)?dateTo.getDate():dateFrom.getDate()}"]`).click()
                }
            }
            if (window.matchMedia('(min-width: 640px)').matches) {
                isTO(calendar)?calendarFrom.firstElementChild.click():calendarTo.firstElementChild.click()
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
            if (+this.value>31) {this.value = 31}
            this.value = this.value.length==1?setTwoDigitsValue(this.value):this.value
            eventSetActiveBar(this.closest('.calendar'))
            if (+this.nextElementSibling.nextElementSibling.value<1 || +this.nextElementSibling.nextElementSibling.value>12) {return}
            if (+this.parentElement.lastElementChild.value<0 || +this.parentElement.lastElementChild.value>NOW_YEAR) {return}
            eventCalendarChangeTable(this.closest('.calendar'))
        })
    })
    document.querySelectorAll('.input.month').forEach(el=>{
        el.addEventListener('keydown', function(event) {            
            
        })  
        el.addEventListener('input', function(event) { 
            if (+el.value>=1 && +el.value<=12) {
                el.closest('.calendar').querySelector('.month-select').firstElementChild.classList.remove('none-select')
                el.closest('.calendar').querySelector('.month-select .calendar-select-value').innerHTML = MONTH[+el.value-1]
            } else {
                if (+el.value>12) {el.value = 12}
                el.closest('.calendar').querySelector('.month-select').firstElementChild.classList.add('none-select')
                el.closest('.calendar').querySelector('.month-select .calendar-select-value').innerHTML = 'Выберите месяц'
            }          
            if (el.value.length == 2) {
                el.nextElementSibling.nextElementSibling.focus()
            }
        }) 
        el.addEventListener('blur', function() {
            if (+this.value>12) {this.value = 12}
            this.value = this.value.length==1?setTwoDigitsValue(this.value):this.value
            if (+this.value<1 || +this.value>12) {return}
            eventSetActiveBar(this.closest('.calendar'))
            if (+this.nextElementSibling.nextElementSibling.value<0 || +this.nextElementSibling.nextElementSibling.value>NOW_YEAR) {return}            
            eventCalendarChangeTable(this.closest('.calendar'))
        })
    })

    document.querySelectorAll('.input.year').forEach(el=>{
        el.addEventListener('input', function(event) {            
            if (+el.value>=0 && +el.value<=NOW_YEAR) {
                el.closest('.calendar').querySelector('.year-select').firstElementChild.classList.remove('none-select')
                el.closest('.calendar').querySelector('.year-select').querySelector('.calendar-select-value').innerHTML = el.value
            } else {
                el.closest('.calendar').querySelector('.year-select').firstElementChild.classList.add('none-select')
                el.closest('.calendar').querySelector('.year-select').querySelector('.calendar-select-value').innerHTML = 'Выберите год'
            }
            if (el.value.length == 4) {
                el.blur()
            }
        }) 
        el.addEventListener('keydown', function(event) { 
                      
            if (el.value == '') {
                if (event.key != 1 || event.key != 2) {return}
            }
            if (el.value == 1) {
                if (event.key != 9) { return }
            }
        }) 
        el.addEventListener('blur', function() {
            if (+this.value<0 || +this.value>NOW_YEAR) {return}
            eventSetActiveBar(this.closest('.calendar'))
            if (+this.previousElementSibling.previousElementSibling.value<1 || +this.previousElementSibling.previousElementSibling.value>12) {return}
            eventCalendarChangeTable(this.closest('.calendar'))
        })
    })
}

document.querySelectorAll('.input-search').forEach(element=>{
    element.addEventListener('input', function() {
        let filter = this.parentElement.previousElementSibling
        tempArray = []
        console.log();
        if (this.value.length == 4 && (!String(this.value).indexOf(2) || !String(this.value).indexOf(19))) {
            document.querySelector('.calendar-action-bar').classList.add('active')
        } else {            
            document.querySelector('.calendar-action-bar').classList.remove('active')
        }
        yearArray.forEach(el=>{
            if (String(el).indexOf(this.value) == 0) {
                tempArray.push(el)
            }
        })
        filter.innerHTML = ''
        for (let i=0; i<tempArray.length; i++) {
            let element = document.createElement('div')
            element.classList.add('calendar-select-dropdown__item')
            element.innerHTML = tempArray[i]
            filter.append(element)
        }
        filter.querySelectorAll('.calendar-select-dropdown__item').forEach(el => {
            el.addEventListener('click', (event) => {
                document.querySelector('.calendar-top-text').innerHTML = 'Выберите период'
                filter.parentElement.querySelector('.calendar-select-value').innerHTML = event.currentTarget.innerHTML
                filter.parentElement.firstElementChild.classList.remove('none-select')             
                event.currentTarget.closest('.calendar-select').classList.remove('active')
                if (filter.parentElement.classList.contains('year-select')) {
                    filter.closest('.calendar').querySelector('.input.year').value = event.currentTarget.innerHTML
                } else {
                    filter.closest('.calendar').querySelector('.input.month').value = setTwoDigitsValue(+MONTH.indexOf(event.currentTarget.innerHTML)+1)
                }
                eventCalendarChangeTable(filter.closest('.calendar'))
                eventSetActiveBar(filter.closest('.calendar'))
            })
        })
    })
})

document.querySelector('.accept-changes').addEventListener('click', function () {
    if (document.querySelector('.year-select.active')) {
        let val = document.querySelector('.year-select.active .input-search').value
        document.querySelector('.year-select.active').closest('.calendar').querySelector('.input.year').value = val
        document.querySelector('.year-select.active').querySelector('.calendar-select-value').innerHTML = val
        document.querySelector('.year-select.active').classList.remove('active')
    } else {
        errorElement.classList.remove('active')
        document.querySelectorAll('.calendar').forEach(calendar => {
            calendar.classList.remove('active')
            calendar.classList.remove('clear')
            checkToSetDate(calendar)
        })
    }
})

document.querySelector('.reset-changes').addEventListener('click', function () {
    if (document.querySelector('.year-select.active')) {
        document.querySelector('.year-select.active').classList.remove('active')
    } else {
        errorElement.classList.remove('active')
        document.querySelectorAll('.calendar').forEach(calendar => {
            calendar.classList.remove('active')
            calendar.classList.remove('clear')
            setDate(calendar, isTO(calendar)?dateTo:dateFrom)
        })
    }
})

document.querySelectorAll('.button-close, .button-back').forEach(el=>{
    el.addEventListener('click', ()=>{
        document.querySelector('.calendar-select.active').classList.remove('search')
        document.querySelector('.calendar-select.active').classList.remove('active')
        document.querySelector('.calendar-top-text').innerHTML = 'Выберите период'
    })
})

window.addEventListener('click', (event)=> {
    if (!calendarElement.contains(event.target)) {
        if (document.querySelector('.calendar.active')) {
            document.querySelector('.reset-changes').click()
        }
    }
})