function generateGraph(el, data) {
    el.innerHTML = ''
    var history = {}
    for (var point in data) {
        history[data[point]['date']] = data[point]['steps']
    }
    var today = new Date()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    today -= today.getTimezoneOffset() * 60 * 1000
    var maximum = 0;
    for (var date = today - 24 * 60 * 60 * 1000 * 13;
         date <= today; date += 24 * 60 * 60 * 1000) {
        var datecode = new Date(date).toISOString().substring(0, 10)
        if (datecode in history && history[datecode] > maximum) {
            maximum = history[datecode];
        }
    }
    for (var date = today - 24 * 60 * 60 * 1000 * 13;
         date <= today; date += 24 * 60 * 60 * 1000) {
        var day = new Date(date)
        var datecode = day.toISOString().substring(0, 10)
        var dayEl = document.createElement('div')
        if (datecode in history) {
            dayEl.style.height = (100 * history[datecode] / maximum) + '%'
            if (history[datecode] >= maximum * 0.9) {
                var dayText = document.createElement('span')
                dayText.innerText = history[datecode]
                dayEl.appendChild(dayText)
            }
        } else {
            dayEl.style.height = '0%'
        }
        el.appendChild(dayEl)
    }
    el.classList.remove('empty')
    if (Object.keys(history).length == 0) {
        el.classList.add('empty')
    }
}
