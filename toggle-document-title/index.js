var originTitle = document.title
var changeTitleTimeoutID
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    document.title = "Σ(っ °Д °;)っ喔哟，崩溃啦！"
    clearTimeout(changeTitleTimeoutID)
  } else {
    document.title = "φ(゜▽゜*)♪咦，又好了！"
    changeTitleTimeoutID = setTimeout(function () {
      document.title = originTitle
    }, 3000)
  }
})
