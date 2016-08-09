function generateUserListEntry(data) {
    var username = (typeof data == 'object' ? data.username : data)
    var el = document.createElement('li')
    el.setAttribute('data-username', username)
    if (typeof data == 'object') {
        el.classList.add('has-follow-button')
        el.innerHTML = '<span class="username"></span>'
        var usernameEl = el.querySelector('.username')
        usernameEl.innerText = username
        el.appendChild(setupFollowButton(data))
    } else {
        el.innerText = username
    }
    var loading = false
    el.addEventListener('click', function() {
        showModal(generateProfileEl(this.getAttribute('data-username'),
                  'close'))
    })
    return el
}

function generateUserList(users, emptyEl, lastEl, field) {
    var el = document.createElement('ul')
    el.classList.add('user-list')
    if (users.length == 0) {
        if (emptyEl) {
            el.appendChild(emptyEl)
        }
    } else {
        for (var _user in users) {
            el.appendChild(generateUserListEntry(users[_user]))
        }
    }
    if (lastEl) {
        el.appendChild(lastEl)
    }

    if (field) {
        window.registerUserDataListener(function(data) {
            if (users.indexOf(data['username']) >= 0) {
                var userEl = el.querySelector('*[data-username="' +
                    data['username'] + '"]')
                if (data[field]) {
                    userEl.classList.remove('hidden')
                } else if (typeof data[field] != 'undefined') {
                    userEl.classList.add('hidden')
                }
            } else {
                if (data[field]) {
                    users.push(data['username'])
                    var userEl = generateUserListEntry(data['username'])
                    userEl.classList.add('appeared')
                    if (lastEl) {
                        lastEl.parentNode.insertBefore(userEl, lastEl)
                    } else {
                        el.appendChild(userEl)
                    }
                }
            }
        })
    }
    return el
}

function generateLazyList(title, callback, emptyEl, lastEl, field) {
    var el = document.createElement('div')
    el.classList.add('card')
    el.classList.add('collapsed')
    el.classList.add('empty')
    el.classList.add('lazy-list')
    var headerEl = document.createElement('div')
    headerEl.classList.add('list-title')
    var titleEl = document.createElement('span')
    titleEl.innerText = title
    headerEl.appendChild(titleEl)
    var arrowEl = document.createElement('i')
    arrowEl.classList.add('ion')
    arrowEl.classList.add('ion-chevron-left')
    arrowEl.classList.add('expando-toggle')
    headerEl.appendChild(arrowEl)
    el.appendChild(headerEl)
    el.appendChild(document.createElement('hr'))

    headerEl.addEventListener('click', function() {
        el.classList.toggle('collapsed')
        if (el.classList.contains('empty')) {
            el.classList.remove('empty')
            var spinner = createSpinner()
            headerEl.insertBefore(spinner, arrowEl)
            callback(function(data) {
                headerEl.removeChild(spinner)
                el.appendChild(generateUserList(data, emptyEl, lastEl, field))
            }, function(error) {
                headerEl.removeChild(spinner)
                console.log(error)
                alert('Something went wrong.\nThat\'s all we know.')
            })
        }
    })

    return el
}

// -------------------------------------------------------------------------- //

function showAddFollowingModal() {
    var el = document.createElement('div')
    el.innerHTML = '<div class="header-row">' +
        '<span class="modal-title">Follow User</span>' +
        '<a href="#" class="close-button">' +
            '<i class="ion ion-close"></i>' +
        '</a></div><hr/>' +
        '<div class="wrapper appeared">' +
            '<div class="input-bar">' +
                '<input type="text" class="add-username" required autocomplete="off" ' +
                    'autocorrect="off" autocapitalize="off" maxlength="12"' +
                    'pattern="[a-z0-9-]{3,12}"/>' +
                '<button class="button add-button disabled">' +
                    '<i class="ion ion-plus"></i>' +
                '</button>' +
            '</div>' +
            '<div class="result"></div>' +
        '</div>'
    var inputBar = el.querySelector('.input-bar')
    var addInput = el.querySelector('.add-username')
    var addButton = el.querySelector('.add-button')
    var resultEl = el.querySelector('.result')
    addInput.addEventListener('keyup',
        function() {
            addButton.classList.add('disabled')
            if (/^[a-z0-9-]{3,12}$/.exec(addInput.value)) {
                addButton.classList.remove('disabled')
            }
        }
    )
    addButton.addEventListener('click',
        function() {
            if (!addButton.classList.contains('disabled')) {
                addButton.classList.add('hidden')
                var spinner = createSpinner()
                inputBar.appendChild(spinner)
                var addUsername = addInput.value
                window.ownUser.followUser(addUsername, function(data) {
                    if (data['message'] == 'OK') { // Ignore if 'No Change'
                        window.ownData['following'] += 1
                        window.userDataChanged(window.ownData)
                    }
                    window.ownUser.getUserProfile(addUsername,
                        function(data) {
                            window.userDataChanged(data)
                            hideModal(el)
                        }, function(error) {
                            console.error(error)
                            hideModal(el)
                        }
                    )
                }, function(error) {
                    inputBar.removeChild(spinner)
                    addButton.classList.remove('hidden')
                    if (JSON.parse(error)['message'] == 'Username not found') {
                        resultEl.innerText = 'User ' + addUsername + ' not found'
                    } else if (JSON.parse(error)['message'] == 'User cannot follow themselves') {
                        resultEl.innerText = 'You can\'t follow yourself!'
                    }
                })
            }
        }
    )
    showModal(el)
}

function generateLazyFollowingList() {
    var addEl = document.createElement('li')
    addEl.classList.add('follow')
    addEl.innerHTML = '<button class="button add-button" type="button">' +
        '<i class="ion ion-plus"></i></button>'
    addEl.querySelector('.add-button')
        .addEventListener('click', showAddFollowingModal)
    return generateLazyList('Following',
        function(a, b) {window.ownUser.getOwnFollowing(a, b)}, null, addEl,
        'followed_by_you')
}

function generateLazyFollowerList() {
    var nobodyEl = document.createElement('li')
    nobodyEl.classList.add('nobody')
    nobodyEl.innerHTML = 'Nobody\'s following you. Invite some friends!'
    return generateLazyList('Followers',
        function(a, b) {window.ownUser.getOwnFollowers(a, b)}, nobodyEl, null,
        'follows_you')
}

function generateLazySuggestedList() {
    var nobodyEl = document.createElement('li')
    nobodyEl.classList.add('nobody')
    nobodyEl.innerHTML = 'There are no suggested users right now. <br/>' +
                         'Check back later!'
    return generateLazyList('Suggested Users',
        function(a, b) {window.ownUser.getSuggestedUsers(a, b)}, nobodyEl,
        null, null)
}
