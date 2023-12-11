const calendarSelectValueElements = document.querySelectorAll('.calendar-select-value')

if (calendarSelectValueElements.length) {
    for (let select of calendarSelectValueElements) {
        select.addEventListener('click', (event) => {
            event.currentTarget.closest('.calendar-select').classList.toggle('active')
        })
    }
}

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