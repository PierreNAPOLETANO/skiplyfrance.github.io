var count = ["0000","0000","0000","0000","0000"];
var old_count = ["0000","0000","0000","0000","0000"];
var count_variation = [0,0,0,0,0];
var old_count_variation = [0,0,0,0,0];
var normalColor = ["#6c9bb5", "#b04c7e","#90b232","#c7aa28","#cf7014"];
var overColor = ["#74a7c4","#bf5389","#9cc136","#d6b72b","#df7916"];
var frame;
var old_state = [0,0,0,0,0];
var new_code = ["0","0","0","0","0","0"];
var old_code = ["0","0","0","0","0","0"];
var current_badge = 0;
var old_badge = 0;
var sq_num = 0;
var last_send;
var last_code_minute = 0;
var device_name;

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function initPage() {
    var divCodes = document.getElementById("listCodes");
    divCodes.style.display='none';
    resetWarnings();
    var divbadge = document.getElementById("div-badge");
    divbadge.style["margin-top"] = "2em";
    var divonde1 = document.getElementById("onde1");
    divonde1.style["display"] = "none";
    var divonde2 = document.getElementById("onde2");
    divonde2.style["display"] = "none";
}

function resetValues() {
    count = ["0000","0000","0000","0000","0000"];
    old_state = [0,0,0,0,0];
    old_count = ["0000","0000","0000","0000","0000"];
    count_variation = [0,0,0,0,0];
    old_count_variation = [0,0,0,0,0];
    new_code = ["0","0","0","0","0","0"];
    old_code = ["0","0","0","0","0","0"];
    for (i = 1; i < 6; i++) {
        var objVar = "increment" + i.toString();
        var objCount = "counter" + i.toString();
        var divobj = document.getElementById(objCount);
        var divvar = document.getElementById(objVar);
        divobj.innerHTML = count[i-1];
        divvar.innerHTML = count_variation[i-1];
    }
    var objCode = document.getElementById("currentCode");
    objCode.innerHTML = "000000";

    var objOldCode = document.getElementById("lastCode");
    objCode.innerHTML = "000000";

    old_badge = 0;
    current_badge = 0;

    sq_num = 0;

    resetWarnings();
}

function resetWarnings() {
    var divWarningCode = document.getElementById("WarningCode");
    divWarningCode.style.display='none';
    var divWarningCount = document.getElementById("WarningCount");
    divWarningCount.style.display='none';
    var divCurrentBadge = document.getElementById("currentBadge");
    divCurrentBadge.innerHTML = "No";
    var divCurrentBadgeCode = document.getElementById("currentBadgeCode");
    divCurrentBadgeCode.innerHTML = "No";
    var divOldBadge = document.getElementById("oldBadge");
    if (old_badge === 1) {
        divOldBadge.innerHTML = "Yes";
    } else {
        divOldBadge.innerHTML = "No";  
    }
}

function selectMode() {
    var divCodes = document.getElementById("listCodes");
    var divRNM = document.getElementById("rnm");
    var divCounters = document.getElementById("listCounters");
    if (divRNM.value === "02") {
        divCodes.style.display='block';
        divCounters.style.display='none';
    } else {
        divCodes.style.display='none';
        divCounters.style.display='block';  
    }
    resetValues();
}

function incrementCount(counter) {
	counter = (parseInt(counter, 16) + 1).toString(16);
	var i;
	var limit = counter.length;
	for (i=0; i<(4 - limit); i++) {
		counter = "0" + counter;
	};
	return counter;
}

function sendFrame() {
    var divobj = document.getElementById("pushurl");
    //var http = new XMLHttpRequest();
    var divRNM = document.getElementById("rnm");
    var url = divobj.value;
    sq_num++;
    var divname = document.getElementById("deviceName");
    device_name = divname.value;
    if (divRNM.value === "01" || divRNM.value === "03") {
        var apiMessage = countApiMessage();
    } else {
        var apiMessage = codeApiMessage();
    }

    var frameResult = document.getElementById("lastFrame");
    frameResult.innerHTML = JSON.stringify(apiMessage,null, 2);

    if (url !== "") {
        $.ajax({
            url:url,
            method:"POST", //First change type to method here
            dataType: 'json',
            contentType: "application/json",
            data:JSON.stringify(apiMessage),
            success: function() {
                var spanLastStatus = document.getElementById("lastStatus");
                spanLastStatus.innerHTML = "Request successfull";
                spanLastStatus.style.backgroundColor = "green";
                spanLastStatus.style.padding = "3px";
                spanLastStatus.style.color = "white";
            },
            error: function(xhr, status, text) {
                var spanLastStatus = document.getElementById("lastStatus");
                spanLastStatus.innerHTML = "The endpoint replied with an error";
                spanLastStatus.style.backgroundColor = "red";
                spanLastStatus.style.padding = "3px";
                spanLastStatus.style.color = "white";
            },
        })
    }

    old_count_variation = [count_variation[0],count_variation[1],count_variation[2],count_variation[3],count_variation[4]];
    count_variation = [0,0,0,0,0];
    if (divRNM.value === "03") {
        count = ["0000","0000","0000","0000","0000"];
    };
    old_count = [count[0],count[1],count[2],count[3],count[4]];

    for (i = 1; i < 6; i++) {
        var objVar = "increment" + i.toString();
        var objCount = "counter" + i.toString();
        var divobj = document.getElementById(objCount);
        var divvar = document.getElementById(objVar);
        divobj.innerHTML = count[i-1];
        divvar.innerHTML = count_variation[i-1];
    }

    old_code = [new_code[0],new_code[1],new_code[2],new_code[3],new_code[4],new_code[5]];
    new_code = ["0","0","0","0","0","0"];
    var objCode = document.getElementById("currentCode");
    objCode.innerHTML = new_code.toString().split(',').join('');
    var objOldCode = document.getElementById("lastCode");
    objOldCode.innerHTML = old_code.toString().split(',').join('');

    old_badge = current_badge;
    current_badge = 0;
    resetWarnings();
    last_send = new Date();
}

function buttonpressed(button) {
    var divRNM = document.getElementById("rnm");
    if (((divRNM.value === "01") || (divRNM.value === "03")) && (current_badge === 0)) {
        clickButton();

        count[button-1] = incrementCount(count[button-1]);

        count_variation[button-1] = parseInt(count[button-1],16) - parseInt(old_count[button-1],16);

        var objVar = "increment" + button.toString();
        var objCount = "counter" + button.toString();
        var divobj = document.getElementById(objCount);
        var divvar = document.getElementById(objVar);
        divobj.innerHTML = count[button-1];
        divvar.innerHTML = count_variation[button-1];
    } else if (((divRNM.value === "01") || (divRNM.value === "03")) && (current_badge === 1)) {
        var divWarningCount = document.getElementById("WarningCount");
        divWarningCount.style.display='block';
        divWarningCount.innerHTML = "Warning: badge pressed, immediate send required";
    }

    if ((divRNM.value === "02") && (current_badge === 0)) {
        if (new_code[0] === "0"){
            clickButton();
            new_code.shift();
            new_code.push(button.toString());

            var objCode = document.getElementById("currentCode");
            objCode.innerHTML = new_code.toString().split(',').join('');
            count[button-1] = incrementCount(count[button-1]);
            count_variation[button-1] = parseInt(count[button-1],16) - parseInt(old_count[button-1],16);
        } else {
            var divWarningCode = document.getElementById("WarningCode");
            divWarningCode.style.display='block';
            divWarningCode.innerHTML = "Warning: you reached the maximum digit number";
        };
    } else if ((divRNM.value === "02") && (current_badge === 1)) {
        var divWarningCode = document.getElementById("WarningCode");
        divWarningCode.style.display='block';
        divWarningCode.innerHTML = "Warning: badge pressed, immediate send required";
    }
}

function badgeover() {
    var divbadge = document.getElementById("badgetop");
    divbadge.setAttribute("fill", "#5d98ba");
}

function badgeout() {
    var divbadge = document.getElementById("badgetop");
    divbadge.setAttribute("fill", "#74a7c4");
}

function badgepressed() {
    if (current_badge === 0) {
        clickBadge();
        var divCurrentBadge = document.getElementById("currentBadge");
        var divCurrentBadgeCode = document.getElementById("currentBadgeCode");
        if (current_badge === 1) {
            divCurrentBadge.innerHTML = "Yes";
            divCurrentBadgeCode.innerHTML = "Yes";
        } else {
            divCurrentBadge.innerHTML = "No";
            divCurrentBadgeCode.innerHTML = "No";  
        }
        var divOldBadge = document.getElementById("oldBadge");
        if (old_badge === 1) {
            divOldBadge.innerHTML = "Yes";
        } else {
            divOldBadge.innerHTML = "No";  
        }
    } else {
        var divWarningCode = document.getElementById("WarningCode");
        divWarningCode.style.display='block';
        divWarningCode.innerHTML = "Warning: badge already pressed, immediate send required";
        var divWarningCount = document.getElementById("WarningCount");
        divWarningCount.style.display='block';
        divWarningCount.innerHTML = "Warning: badge already pressed, immediate send required";
    }
}

function countApiMessage() {
    if (current_badge === 1) {
        var frameType = "03";
    } else {
        var frameType = "02";
    }
    var currentTime = new Date();
    var apiMessage = {
        'device':device_name,
        'time':currentTime,
        'sq_num': sq_num,
        'frameType':frameType,
        'data': {
            'index':[parseInt(count[0],16),parseInt(count[1],16),parseInt(count[2],16),parseInt(count[3],16),parseInt(count[4],16)],
            'increment':count_variation,
            'ack': current_badge,
            'button_1': count_variation[0],
            'button_2': count_variation[1],
            'button_3': count_variation[2],
            'button_4': count_variation[3],
            'button_5': count_variation[4]
        },
        'negativeValue': 0
    };
    return apiMessage;
}

function codeApiMessage() {
    if (current_badge === 1) {
        var frameType = "3";
    } else {
        var frameType = "1";
    };
    if (old_badge === 1) {
        frameType = frameType + "3";
    } else {
        frameType = frameType + "1";
    };
    var currentTime = new Date();
    if (sq_num > 1) {
        last_code_minute = Math.ceil((currentTime - last_send)/60000);
    }
    var apiMessage = {
        'device':device_name,
        'time':currentTime,
        'dc_delay':0,
        'sq_num': sq_num,
        'frameType':frameType,
        'data': {
            'code':new_code.toString().split(',').join(''),
            'increment':count_variation,
            'ack': current_badge,
            'button_1': count_variation[0],
            'button_2': count_variation[1],
            'button_3': count_variation[2],
            'button_4': count_variation[3],
            'button_5': count_variation[4]
        },
        'previous': {
            'code':old_code.toString().split(',').join(''),
            'increment':old_count_variation,
            'ack': old_badge,
            'button_1': old_count_variation[0],
            'button_2': old_count_variation[1],
            'button_3': old_count_variation[2],
            'button_4': old_count_variation[3],
            'button_5': old_count_variation[4],
            'previous_time':last_code_minute
        }
    };
    return apiMessage;
}

function buttonover(button) {
    var objCount = "button" + button.toString();
    var divobj = document.getElementById(objCount);
    divobj.setAttribute("fill", normalColor[button-1]);
}

function buttonout(button) {
    var objCount = "button" + button.toString();
    var divobj = document.getElementById(objCount);
    divobj.setAttribute("fill", overColor[button-1]);
}

function clickButton() {
    var greenLed = "#00f700";
    var blinkFreq = 100;
    var divobj;
    var led;
    var i;
    var divRNM = document.getElementById("rnm");
    for (i = 1; i < 4; i++) {
        led = "led" + i.toString();
        divobj = document.getElementById(led);
        divobj.setAttribute("fill", greenLed);
    }

    setTimeout(function(){
        for (i = 1; i < 4; i++) {
            led = "led" + i.toString();
            divobj = document.getElementById(led);
            divobj.setAttribute("fill", "white");
        }
    }, blinkFreq);
    if (divRNM.value !== "02") {
        setTimeout(function(){
            for (i = 1; i < 4; i++) {
                led = "led" + i.toString();
                divobj = document.getElementById(led);
                divobj.setAttribute("fill", greenLed);
            }
        }, blinkFreq * 3);
        setTimeout(function(){
            for (i = 1; i < 4; i++) {
                led = "led" + i.toString();
                divobj = document.getElementById(led);
                divobj.setAttribute("fill", "white");
            }
        }, blinkFreq * 4);
    }
}

function clickBadge() {
    var divbadge = document.getElementById("div-badge");
    divbadge.style["margin-top"] = "0.5em";
    var divonde1 = document.getElementById("onde1");
    divonde1.style["display"] = "block";
    var divonde2 = document.getElementById("onde2");
    divonde2.style["display"] = "block";
    setTimeout(function(){
        divbadge.style["margin-top"] = "2em";
        var divonde1 = document.getElementById("onde1");
        divonde1.style["display"] = "none";
        var divonde2 = document.getElementById("onde2");
        divonde2.style["display"] = "none";
    }, 1000);

    current_badge = 1;

    var greenLed = "red";
    var blinkFreq = 100;
    var divobj;
    var led;
    var i;
    for (i = 1; i < 4; i++) {
        led = "led" + i.toString();
        divobj = document.getElementById(led);
        divobj.setAttribute("fill", greenLed);
    }

    setTimeout(function(){
    for (i = 1; i < 4; i++) {
        led = "led" + i.toString();
        divobj = document.getElementById(led);
        divobj.setAttribute("fill", "white");
    }
    }, blinkFreq);
    setTimeout(function(){
        for (i = 1; i < 4; i++) {
            led = "led" + i.toString();
            divobj = document.getElementById(led);
            divobj.setAttribute("fill", greenLed);
        }
    }, blinkFreq * 3);
    setTimeout(function(){
        for (i = 1; i < 4; i++) {
            led = "led" + i.toString();
            divobj = document.getElementById(led);
            divobj.setAttribute("fill", "white");
        }
    }, blinkFreq * 4);
}
