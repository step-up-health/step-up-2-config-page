window.userDataListeners = []

window.registerUserDataListener = function(callback) {
    window.userDataListeners.push(callback)
}

window.userDataChanged = function(data) {
    for (var listener in window.userDataListeners) {
        window.userDataListeners[listener](data)
    }
}

function createSpinner() {
    var el = document.createElement('div')
    el.classList.add('spinner-wrapper')
    el.innerHTML = '<i class="ion ion-load-c spinner"></i>'
    return el
}

function switchView(view, data) {
    document.querySelector('main').innerHTML = ''
    switch(view) {
        case 'main':
            document.querySelector('main').appendChild(mainView(data))
            break
        case 'onboarding':
            document.querySelector('main').appendChild(onboardingView(data))
            break
    }
}

window.addEventListener('load', function() {
    if (location.hash.substring(1).length > 10) {
        window.ownUser = new StepUp(location.hash.substring(1))
        window.ownUser.getOwnProfile(function(profile) {
            window.ownData = profile
            if (profile == null) {
                switchView('onboarding', profile)
            } else {
                switchView('main', profile)
            }
        }, function(result) {
            console.log(result)
        })
    }
})
