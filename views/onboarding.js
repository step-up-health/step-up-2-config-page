function registrationView() {
    var mainEl = document.createElement('div')
    mainEl.classList.add('card')
    mainEl.classList.add('onboarding-view')
    mainEl.innerHTML = '<div class="card-img">'+
            '<h1>Welcome!</h1>' +
        '</div>' +
        '<p>Please choose a username:</p>' +
        '<div class="input-bar">' +
            '<input type="text" class="username" required autocomplete="off" ' +
                'autocorrect="off" autocapitalize="off" maxlength="12"' +
                'pattern="[a-z0-9-]{3,12}"/>' +
            '<button class="button next-button disabled">' +
                '<i class="ion ion-arrow-right-c"></i>' +
            '</button>' +
        '</div>' +
        '<ul class="username-issues"></ul>' +
        '<label class="hint">You can change your username later. ' +
        '<a class="privacy-link" href="#">Terms & Privacy</a></label>'
    mainEl.querySelector('.privacy-link').addEventListener('click', function() {
        el = document.createElement('div')
        el.innerHTML = texts.tos
        showTextModal(el)
    })
    var usernameIssueList = mainEl.querySelector('.username-issues')
    var usernameInputBar = mainEl.querySelector('.input-bar')
    var usernameInput = mainEl.querySelector('.username')
    var nextButton = mainEl.querySelector('.next-button')
    var validUsernameInputValue
    var validateUsername = function() {
        var issues = []
        if (usernameInput.value.length > 12) {
            issues.push('Username too long')
        }
        if (usernameInput.value.length < 3) {
            issues.push('Username too short')
        }
        if (! (/^[a-z0-9-]*$/.exec(usernameInput.value))) {
            issues.push('Only a-z, 0-9 and - (dash) allowed')
        }
        usernameIssueList.innerHTML = ''
        validUsernameInputValue = null
        nextButton.classList.remove('disabled')
        if (issues.length == 0) {
            var availableEl = document.createElement('li')
            availableEl.innerText = 'Checking availability...'
            usernameIssueList.appendChild(availableEl)
            var oldValue = usernameInput.value
            window.ownUser.usernameAvailable(usernameInput.value,
                function(value) {
                    availableEl.classList.remove('available')
                    availableEl.classList.remove('issue')
                    if (oldValue != usernameInput.value) {
                        return
                    }
                    if (value) {
                        availableEl.classList.add('available')
                        availableEl.innerText = 'Available'
                        validUsernameInputValue = oldValue
                        nextButton.classList.remove('disabled')
                    } else {
                        availableEl.classList.add('issue')
                        availableEl.innerText = 'Taken—Try another username.'
                        nextButton.classList.add('disabled')
                    }
                }, function(error) {
                    availableEl.innerText = 'Connection error.'
                })
        } else {
            for (var issue in issues) {
                var issueEl = document.createElement('li')
                issueEl.classList.add('issue')
                issueEl.innerText = issues[issue]
                usernameIssueList.appendChild(issueEl)
            }
            nextButton.classList.add('disabled')
        }
    }
    usernameInput.addEventListener('keyup', validateUsername)
    nextButton.addEventListener('click', function() {
        if (validUsernameInputValue) {
            var newUsername = validUsernameInputValue
            validUsernameInputValue = null
            usernameInputBar.classList.add('working')
            var spinner = createSpinner()
            usernameInput.disabled = 'disabled'
            nextButton.classList.add('hidden')
            usernameInputBar.appendChild(spinner)
            window.ownUser.register(newUsername, function() {
                window.ownUser.getOwnProfile(function(profile) {
                    window.ownData = profile
                    switchView('main', profile)
                }, function(error) {
                    console.log(error)
                    alert('Looks like something went wrong. Reloading... [2]')
                    window.location.reload()
                })
            }, function(error) {
                console.log(error)
                alert('Looks like something went wrong. Reloading... [1]')
                window.location.reload()
            })
        }
    })
    return mainEl
}

function onboardingView(data) {
    return registrationView()
}
