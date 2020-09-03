// function sendCommand(cmd, cb){
// 	$.ajax({
//         url: "/",
//         type: 'POST',
//         data: cmd,
//         dataType: 'text',
//         success: function(result) {
//             // alert("success?");
//             // console.log(cb)
//             setTimeout(cb, 50)
//         },
//         error: function(){
//             cb()
//         }
//     });
// }

function sendCommand(cmd, cb) {
    xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.onload = function() {
        if (xhr.status === 200) {
            setTimeout(cb, 50)
        }
        else if (xhr.status !== 200) {
            setTimeout(cb, 50)
        }
    };
    xhr.send(cmd);
}

var events = []

function aggregateCommands(){
    var commands = ""
    var moving = false
    var movedx = 0
    var movedy = 0
    for(var i in events) {
        var ev = events[i]
        switch(ev[0]) {
            case "click" :
                {
                    commands += "xdotool mousedown " + ev[2] + " mouseup " + ev[2] + "\n"
                }
                break;
            case "swipe":
                {
                    movedx += ev[2]
                    movedy += ev[3]
                }

        }
    }
    if(movedy != 0 || movedx != 0) {
        commands += "xdotool mousemove_relative -- " + movedx + " " + movedy
        movedy = movedx = 0
    }
    events = []
    if(commands == ""){
        setTimeout(aggregateCommands, 250)
        return
    }
    sendCommand(commands, aggregateCommands)
}

var lastEvent = null
var lastEventType = ""
var swiping = false

function onbodyload(){
    // alert("starting")
    var ele = document.getElementById("pad")
    ele.ontouchstart = function(e) {
        lastEvent = e
        lastEventType = "start"
        // console.log("touchlen:", e.touches.length, e)
    }
    ele.ontouchend = function(e) {
        var tm = e.timeStamp
        if(lastEventType == "start"){
            var btn = 1
            if(lastEvent.touches.length == 2)
                btn = 3
            else if(lastEvent.touches.length == 3)
                btn = 2
            events.push(["click", tm, btn])
        }
        lastEvent = e
        lastEventType = "end"
        // console.log("touchlen:", e.touches.length, e)
    }
    ele.ontouchmove = function(e) {
        // var tm = new Date()
        try {
            events.push(["swipe", e.timeStamp, e.touches[0].clientX - lastEvent.touches[0].clientX, e.touches[0].clientY - lastEvent.touches[0].clientY])
        } catch(er) {
            console.log(e, er)
        }
        lastEvent = e
        lastEventType = "swipe"
        // console.log("touchlen:", e.touches.length, e)
    }
    ele.ontouchcancel = function(e){
        console.log(e)
    }
    aggregateCommands()
}