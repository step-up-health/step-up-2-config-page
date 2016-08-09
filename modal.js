function updateShade(fadeOut) {
    var modals = document.querySelector('#modals')
    if (fadeOut) {
        modals.classList.add('fading-out')
    } else if (modals.childNodes.length > 0) {
        modals.classList.remove('fading-out')
        modals.classList.add('has-content')
        document.body.classList.add('frozen')
    } else {
        modals.classList.remove('fading-out')
        modals.classList.remove('has-content')
        document.body.classList.remove('frozen')
    }
}

function hideModal(el) {
    window.setTimeout(function() {
        el.parentNode.removeChild(el)
        updateShade()
    }, 200)
    el.classList.add('removed')
    updateShade(true)
}

function showModal(el) {
    var modals = document.querySelector('#modals')
    modals.appendChild(el)
    el.querySelector('.close-button').addEventListener('click', function() {
        hideModal(el)
    })
    updateShade()
}

function showTextModal(el) {
    var wrapper = document.createElement('div')
    wrapper.classList.add('text-modal')
    var scrollable = document.createElement('div')
    scrollable.appendChild(el)
    scrollable.classList.add('wrapper')
    wrapper.innerHTML = '<div class="header-row">' +
        '<a href="#" class="close-button">' +
            '<i class="ion ion-close"></i>' +
        '</a></div><hr/>'
    wrapper.appendChild(scrollable)
    showModal(wrapper)
}
