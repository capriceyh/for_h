var doms = {
    audio: document.querySelector("audio"),
    ul: document.querySelector(".container ul"),
    container: document.querySelector(".container")
}

var lrcData = parseLrc(lyric)
createLrcElement()
var containerHeight = doms.container.clientHeight

var liHeight = doms.ul.children[0].clientHeight

/**
 * 将字符串歌词转为对象数组
 * { time: , words: }
 * @param {String} lrc 
 * @returns 
 */
function parseLrc(lrc) {

    var result = [] //存放歌词结果
    var lrcArr = lrc.split('\n')
    for(var i=0; i< lrcArr.length; i++){
        var lrcObjArr = lrcArr[i].split(']')
        var timeStr = lrcObjArr[0].substring(1)
        var time = parseTime(timeStr)
        var obj = {
            time: time,
            words: lrcObjArr[1]
        }
        result.push(obj)
    }
    return result
}

/**
 * 将【分：秒】转为【秒】
 * @param {String} timeStr 
 * @returns 
 */
function parseTime(timeStr) {

    var timeStrArr = timeStr.split(':')
    var minute = timeStrArr[0]
    var seconds = timeStrArr[1]
    var time = +minute*60 + +seconds

    return time
} 

/**
 * 计算出，在当前播放器播放到第几秒的情况下
 * lrcData数组中，应该高亮显示的歌词下标
 * 如果没有任何一句歌词需要显示，则得到-1
 * 查找当前播放时间所对应歌词位置
 * @returns 
 */
function findIndex() {
    var audioTime = doms.audio.currentTime
    for(var i=0;i < lrcData.length; i++){
        if(audioTime < lrcData[i].time){
            console.log(i-1)
            return i - 1
        }
    }
    // 找遍了都没找到（说明播放到最后一句）
    return lrcData.length - 1;
}

/**
 * 根据歌词创建li
 */
function createLrcElement() {
    var frags = document.createDocumentFragment()
    for(var i =0;i < lrcData.length;i++){
        var li = document.createElement('li')
        li.textContent = lrcData[i].words
        frags.appendChild(li)
    }
    doms.ul.appendChild(frags)
}

/**
 * 根据歌词偏移
 */
function setOffset() {
    var index = findIndex()
    var ulHeight = index * liHeight + liHeight / 2
    var offset = ulHeight - containerHeight/2
    //开头不偏移
    if(offset < 0){
        offset = 0
    }
    //结尾不偏移
    var maxHeight = doms.ul.clientHeight - containerHeight
    if(offset > maxHeight) {
        offset = maxHeight
    }
    
    //ul设置偏移
    doms.ul.style.transform = `translateY(-${offset}px)`

    //清除旧句样式
    var liActive = document.querySelector('.active')
    if(liActive){
        liActive.classList.remove('active')
    }
    //新句添加样式
    var li = doms.ul.children[index]
    if(li){
        li.classList.add('active')
    }
}

/**
 * 监听播放器
 * 每次时间变化就设置偏移
 */
doms.audio.addEventListener('timeupdate', setOffset)