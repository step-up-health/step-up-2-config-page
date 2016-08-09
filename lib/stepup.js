////////////////////////////////////////////////////////////////////////////////
////             A library to interact with the StepUp2 server.             ////
////////////////////////////////////////////////////////////////////////////////

var api_root = 'https://version2-stepupforpebble.rhcloud.com/v2/'

function StepUp(uid) {
    this.uid = uid
}

StepUp.prototype.POST = function(url, data, fulfill, reject) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE && this.status == 200) {
            fulfill(JSON.parse(this.responseText))
        } else if (this.readyState == this.DONE) {
            reject(this.responseText)
        }
    }
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/jsoncharset=UTF-8')
    xhr.send(JSON.stringify(data))
}

StepUp.prototype.GET = function(url, fulfill, reject) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE && this.status == 200) {
            fulfill(JSON.parse(this.responseText))
        } else if (this.readyState == this.DONE) {
            reject(this.responseText)
        }
    }
    xhr.open('GET', url, true)
    xhr.send()
}

StepUp.prototype.DELETE = function(url, fulfill, reject) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE && this.status == 200) {
            fulfill(JSON.parse(this.responseText))
        } else if (this.readyState == this.DONE) {
            reject(this.responseText)
        }
    }
    xhr.open('DELETE', url, true)
    xhr.send()
}

StepUp.prototype.register = function(username, fulfill, reject) {
    this.POST(api_root + this.uid + '/register', username, fulfill, reject)
}

StepUp.prototype.getOwnProfile = function(fulfill, reject) {
    this.GET(api_root + this.uid, fulfill, reject)
}
StepUp.prototype.getUserProfile = function(name, fulfill, reject) {
    this.GET(api_root + this.uid + '/information/' + name, fulfill, reject)
}


StepUp.prototype.followUser = function(username, fulfill, reject) {
    this.POST(api_root + this.uid + '/following/' + username, '', fulfill,
              reject)
}
StepUp.prototype.unfollowUser = function(username, fulfill, reject) {
    this.DELETE(api_root + this.uid + '/following/' + username, fulfill, reject)
}

StepUp.prototype.getPublic = function(fulfill, reject) {
    this.GET(api_root + this.uid + '/public', fulfill, reject)
}
StepUp.prototype.setPublic = function(data, fulfill, reject) {
    this.POST(api_root + this.uid + '/public', data, fulfill, reject)
}

StepUp.prototype.getUsername = function(fulfill, reject) {
    this.GET(api_root + this.uid + '/username', fulfill, reject)
}
StepUp.prototype.setUsername = function(name, fulfill, reject) {
    this.POST(api_root + this.uid + '/username', name, fulfill, reject)
}
StepUp.prototype.usernameAvailable = function(name, fulfill, reject) {
    this.GET(api_root + this.uid + '/username_available/' + name,
    fulfill, reject)
}

StepUp.prototype.setTimelineToken = function(timelineToken, fulfill, reject) {
    this.POST(api_root + this.uid + '/timeline_token', timelineToken,
             fulfill, reject)
}

StepUp.prototype.getOwnFollowing = function(fulfill, reject) {
    this.GET(api_root + this.uid + '/following', fulfill, reject)
}
StepUp.prototype.getOwnFollowers = function(fulfill, reject) {
    this.GET(api_root + this.uid + '/followers', fulfill, reject)
}
StepUp.prototype.getSuggestedUsers = function(fulfill, reject) {
    this.GET(api_root + this.uid + '/suggestions', fulfill, reject)
}

StepUp.prototype.getOwnData = function(fulfill, reject) {
    this.GET(api_root + this.uid + '/activity_data', fulfill, reject)
}
StepUp.prototype.submitOwnData = function(data, fulfill, reject) {
    this.POST(api_root + this.uid + '/activity_data', data, fulfill, reject)
}

StepUp.prototype.getFollowingActivityData = function(fulfill, reject) {
    this.GET(api_root + this.uid + '/following_activity_data', fulfill, reject)
}

if (typeof module != 'undefined') {
    module.exports = StepUp
}
