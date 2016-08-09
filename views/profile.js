function setupFollowButton(data) {
    var followButton = document.createElement('button')
    followButton.classList.add('button', 'follow-button')
    followButton.innerHTML = '<i class="ion ion-person"></i> Follow'
    followButton.addEventListener('click', function(ev) {
        if (followButton.classList.contains('working')) {
            ev.stopPropagation()
            return
        }
        followButton.classList.add('working')
        if (data['followed_by_you']) {
            window.ownUser.unfollowUser(data['username'], function() {
                data['followed_by_you'] = false
                data['followers'] -= 1
                window.ownData['following'] -= 1
                followButton.classList.remove('working')
                window.userDataChanged(data)
                window.userDataChanged(window.ownData)
            }, function(error) {
                console.log(error)
                alert('Something went wrong.\nThat\'s all we know.')
            })
        } else {
            window.ownUser.followUser(data['username'], function() {
                data['followed_by_you'] = true
                data['followers'] += 1
                window.ownData['following'] += 1
                followButton.classList.remove('working')
                window.userDataChanged(data)
                window.userDataChanged(window.ownData)
            }, function(error) {
                console.log(error)
                alert('Something went wrong.\nThat\'s all we know.')
            })
        }
        ev.stopPropagation()
    })
    if (data['followed_by_you']) {
        followButton.classList.add('following')
    }
    window.registerUserDataListener(function(newData) {
        if (newData['username'] == data['username'] &&
                'followed_by_you' in newData) {
            data['followed_by_you'] = newData['followed_by_you']
            if (data['followed_by_you']) {
                followButton.classList.add('following')
            } else {
                followButton.classList.remove('following')
            }
        }
    })
    return followButton
}

function generateProfileEl(dataOrUsername, buttonType) {
    var username, data = null
    if (typeof dataOrUsername == 'string') {
        username = dataOrUsername
    } else {
        username = dataOrUsername['username']
        data = dataOrUsername
    }
    var profileEl = document.createElement('div')
    profileEl.classList.add('profile', 'card', 'normal')
    profileEl.innerHTML = '<div class="username-row row">' +
        '<span class="username">' + username + '</span>' +
        (buttonType == 'settings' ?
            '<a href="#" class="settings-button">' +
                '<i class="ion ion-gear-a"></i>' +
            '</a>' : (buttonType == 'close' ?
            '<a href="#" class="close-button">' +
                '<i class="ion ion-close"></i>' +
            '</a>' : '')) +
    '</div><hr/><div class="information">' +
    '</div><div class="activity-graph"></div>'
    profileEl.innerHTML += '<code class="debug"></code>'
    var update = function() {
        if (data) {
            var usernameEl = profileEl.querySelector('.username')
            usernameEl.innerText = data['username']
            var informationEl = profileEl.querySelector('.information')
            informationEl.innerHTML =
                '<div class="row spacious">' +
                    '<span class="following">' + data['following'] + '</span>' +
                    '<span class="followers">' + data['followers'] + '</span>' +
                '</div>' +
                '<div class="row spacious misc-data"></div>' +
                '<code class="debug">' + JSON.stringify(data) + '</code>'
            var miscDataEl = profileEl.querySelector('.misc-data')
            if (data['follows_you']) {
                miscDataEl.innerHTML += '<span>Follows You</span>'
            }
            if (data['public']) {
                miscDataEl.innerHTML += '<span>Public</span>'
            }
            if (data != null && typeof data['followed_by_you'] != 'undefined') {
                var followButton = profileEl.querySelector('.follow-button')
                if (!followButton) {
                    profileEl.querySelector('.username-row').insertBefore(
                        setupFollowButton(data),
                        profileEl.querySelector('.username').nextSibling)
                }
            }
            if ('data' in data) {
                var activityEl = profileEl.querySelector('.activity-graph')
                generateGraph(activityEl, data['data'])
            }
            var spinner =
                profileEl.querySelector('.information ~ .spinner-wrapper')
            if (spinner) {
                profileEl.removeChild(spinner)
            }
        } else {
            if (!profileEl.querySelector('.information ~ .spinner-wrapper')) {
                profileEl.appendChild(createSpinner())
            }
        }
    }
    if (data === null) {
        window.ownUser.getUserProfile(username, function(newData) {
            data = newData
            update()
        }, function(error) {
            alert(JSON.parse(error).message)
        })
    }
    update()
    if (buttonType == 'settings') {
        var button = profileEl.querySelector('.settings-button')
        button.addEventListener('click', function() {
            showSettingsModal(function(newData) {
                data = newData
                update()
            })
        })
    }
    window.registerUserDataListener(function(newData) {
        if (newData['username'] == username) {
            if ('followed_by_you' in newData)
                data.followed_by_you = newData.followed_by_you
            if ('follows_you' in newData)
                data.follows_you = newData.follows_you
            if ('followers' in newData)
                data.followers = newData.followers
            if ('following' in newData)
                data.following = newData.following
            update()
        }
    })
    return profileEl
}
