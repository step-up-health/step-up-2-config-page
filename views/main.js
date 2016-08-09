function mainView(data) {
    var mainEl = document.createElement('div')
    mainEl.classList.add('main-view')
    mainEl.appendChild(generateProfileEl(data, 'settings'))
    mainEl.appendChild(generateLazyFollowingList())
    mainEl.appendChild(generateLazyFollowerList())
    mainEl.appendChild(generateLazySuggestedList())
    return mainEl
}
