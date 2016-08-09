function generateSettingsForm(data, userDataChangedCallback) {
    var el = document.createElement('div')
    el.classList.add('wrapper')
    el.classList.add('appeared')
    var usernameLabel = document.createElement('label')
    usernameLabel.innerText = 'Username'
    usernameLabel.setAttribute('for', 'username')
    el.appendChild(usernameLabel)
    var usernameIssueList = document.createElement('ul')
    usernameIssueList.classList.add('username-issues')
    var usernameInputBar = document.createElement('div')
    usernameInputBar.classList.add('input-bar')
    var usernameInput = document.createElement('input')
    usernameInput.value = data['username']
    usernameInput.type = 'text'
    usernameInput.name = 'username'
    usernameInput.setAttribute('autocomplete', 'off')
    usernameInput.setAttribute('autocorrect', 'off')
    usernameInput.setAttribute('autocapitalize', 'off')
    usernameInput.setAttribute('maxlength', '12')
    usernameInput.pattern = '[a-z0-9-]{3,12}'
    usernameInputBar.appendChild(usernameInput)
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
        usernameRevertButton.classList.remove('hidden')
        usernameSubmitButton.classList.remove('hidden')
        if (usernameInput.value == data['username']) {
            usernameRevertButton.classList.add('hidden')
            usernameSubmitButton.classList.add('hidden')
        } else if (issues.length == 0) {
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
                        usernameRevertButton.classList.remove('disabled')
                        usernameSubmitButton.classList.remove('disabled')
                    } else {
                        availableEl.classList.add('issue')
                        availableEl.innerText = 'Taken—Try another username.'
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
        }
        usernameSubmitButton.classList.add('disabled')
    }
    usernameInput.addEventListener('keyup', validateUsername)
    var usernameSubmitButton = document.createElement('button')
    usernameSubmitButton.innerHTML = '<i class="ion ion-checkmark"></i>'
    usernameSubmitButton.classList.add('button')
    usernameSubmitButton.classList.add('done-button')
    usernameSubmitButton.classList.add('hidden')
    usernameSubmitButton.type = 'button'
    usernameInputBar.appendChild(usernameSubmitButton)
    var usernameRevertButton = document.createElement('button')
    usernameRevertButton.innerHTML = '<i class="ion ion-close"></i>'
    usernameRevertButton.classList.add('button')
    usernameRevertButton.classList.add('cancel-button')
    usernameRevertButton.classList.add('hidden')
    usernameRevertButton.type = 'button'
    usernameInputBar.appendChild(usernameRevertButton)
    usernameSubmitButton.addEventListener('click', function() {
        if (validUsernameInputValue) {
            var newUsername = validUsernameInputValue
            usernameInputBar.classList.add('working')
            var spinner = createSpinner()
            usernameInput.disabled = 'disabled'
            usernameSubmitButton.classList.add('hidden')
            usernameRevertButton.classList.add('hidden')
            usernameInputBar.appendChild(spinner)
            window.ownUser.setUsername(newUsername, function() {
                usernameInputBar.removeChild(spinner)
                usernameInput.disabled = null
                usernameInput.value = newUsername
                data['username'] = newUsername
                validateUsername()
                userDataChangedCallback(data)
            }, function(error) {
                console.log(error)
                alert('Looks like something went wrong. Reloading...')
                window.location.reload()
            })
            validUsernameInputValue = null
        }
    })
    usernameRevertButton.addEventListener('click', function() {
        usernameInput.value = data['username']
        validateUsername()
    })
    el.appendChild(usernameInputBar)
    el.appendChild(usernameIssueList)

    var privacyLabel = document.createElement('label')
    privacyLabel.innerText = 'Privacy'
    el.appendChild(privacyLabel)
    var privacyInputBar = document.createElement('div')
    privacyInputBar.classList.add('input-bar')
    var publicInput = document.createElement('input')
    publicInput.type = 'checkbox'
    publicInput.name = 'public'
    publicInput.checked = data['public']
    privacyInputBar.appendChild(publicInput)
    var publicLabel = document.createElement('label')
    publicLabel.classList.add('inline')
    publicLabel.innerText = 'Public Profile'
    publicLabel.setAttribute('for', 'public')
    privacyInputBar.appendChild(publicLabel)
    publicInput.addEventListener('change', function() {
        privacyInputBar.classList.add('working')
        var spinner = createSpinner()
        publicInput.disabled = 'disabled'
        privacyInputBar.appendChild(spinner)
        window.ownUser.setPublic(publicInput.checked, function() {
            data['public'] = publicInput.checked
            privacyInputBar.removeChild(spinner)
            publicInput.disabled = null
            userDataChangedCallback(data)
        }, function(error) {
            console.log(error)
            alert('Looks like something went wrong. Reloading...')
            window.location.reload()
        })
    })
    el.appendChild(privacyInputBar)
    var privacyHint = document.createElement('label')
    privacyHint.classList.add('hint')
    privacyHint.innerText = texts['public']
    el.appendChild(privacyHint)
    return el
}

function showSettingsModal(userDataChangedCallback) {
    var el = document.createElement('div')
    el.innerHTML = '<div class="header-row">' +
        '<span class="modal-title">Settings</span>' +
        '<a href="#" class="close-button">' +
            '<i class="ion ion-close"></i>' +
        '</a></div><hr/>'
    el.appendChild(createSpinner())
    window.ownUser.getOwnProfile(function(data) {
        userDataChangedCallback(data)
        el.removeChild(el.querySelector('.spinner-wrapper'))
        el.appendChild(generateSettingsForm(data, userDataChangedCallback))
    }, function() {
        // TODO
    })
    showModal(el)
}
