var count = ["0000","0000","0000","0000","0000"];
var old_count = ["0000","0000","0000","0000","0000"];
var count_variation = [0,0,0,0,0];
let old_count_variation = [0,0,0,0,0];
let normalColor = ["#4fc0e8", "#f34f96","#f5a800","#ff9119","#90c715"];
let overColor = ["#72afc5","#d46e9a","#c7972e","#cf8f49","#83a438"];
let frame;
let old_state = [0,0,0,0,0];
let new_code = ["0","0","0","0","0","0"];
let old_code = ["0","0","0","0","0","0"];
let current_badge = 0;
let old_badge = 0;
let sq_num = 0;
let last_send;
let last_code_minute = 0;
let device_name;

function initPage() {
    let divCodes = document.getElementById("listCodes");
    divCodes.style.display='none';
    resetWarnings();
    let divbadge = document.getElementById("div-badge");
    divbadge.style["margin-top"] = "2em";
    let divonde1 = document.getElementById("onde1");
    divonde1.style["display"] = "none";
    let divonde2 = document.getElementById("onde2");
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
        let objVar = "increment" + i.toString();
        let objCount = "counter" + i.toString();
        let divobj = document.getElementById(objCount);
        let divvar = document.getElementById(objVar);
        divobj.innerHTML = count[i-1];
        divvar.innerHTML = count_variation[i-1];
    }
    let objCode = document.getElementById("currentCode");
    objCode.innerHTML = "000000";

    let objOldCode = document.getElementById("lastCode");
    objCode.innerHTML = "000000";

    old_badge = 0;
    current_badge = 0;

    sq_num = 0;

    resetWarnings();
}

function resetWarnings() {
    let divWarningCode = document.getElementById("WarningCode");
    divWarningCode.style.display='none';
    let divWarningCount = document.getElementById("WarningCount");
    divWarningCount.style.display='none';
    let divCurrentBadge = document.getElementById("currentBadge");
    divCurrentBadge.innerHTML = "No";
    let divCurrentBadgeCode = document.getElementById("currentBadgeCode");
    divCurrentBadgeCode.innerHTML = "No";
    let divOldBadge = document.getElementById("oldBadge");
    divOldBadge = old_badge === 1 ? 'Yes' : 'No';
}

function selectMode() {
    let divCodes = document.getElementById("listCodes");
    let divRNM = document.getElementById("rnm");
    let divCounters = document.getElementById("listCounters");

    divCodes.style.display = divRNM.value === '02' ? 'block' : 'none';
    divCounters.style.display = divRNM.value === '02' ? 'none' : 'block';
    
    resetValues();
}

function incrementCount(counter) {
	counter = (parseInt(counter, 16) + 1).toString(16);
	let i;
	let limit = counter.length;
	for (i=0; i<(4 - limit); i++) {
		counter = "0" + counter;
	};
	return counter;
}

function sendFrame() {
    let divobj = document.getElementById("pushurl");
    //var http = new XMLHttpRequest();
    let divRNM = document.getElementById("rnm");
    let url = divobj.value;
    sq_num++;
    let divname = document.getElementById("deviceName");
    device_name = divname.value;
    let apiMessage = divRNM.value === '01' || divRNM.value === '03' ? countApiMessage() : codeApiMessage();
    let frameResult = document.getElementById("lastFrame");
    frameResult.innerHTML = JSON.stringify(apiMessage,null, 2);

    if (url !== "") {
        $.ajax({
            url:url,
            method:"POST", //First change type to method here
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(apiMessage),
            success: function() {
                let spanLastStatus = document.getElementById("lastStatus");
                spanLastStatus.innerHTML = "Request successfull";
                spanLastStatus.style.backgroundColor = "green";
                spanLastStatus.style.padding = "3px";
                spanLastStatus.style.color = "white";
            },
            error: function(xhr, status, text) {
                let spanLastStatus = document.getElementById("lastStatus");
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
        let objVar = "increment" + i.toString();
        let objCount = "counter" + i.toString();
        let divobj = document.getElementById(objCount);
        let divvar = document.getElementById(objVar);
        divobj.innerHTML = count[i-1];
        divvar.innerHTML = count_variation[i-1];
    }

    old_code = [new_code[0],new_code[1],new_code[2],new_code[3],new_code[4],new_code[5]];
    new_code = ["0","0","0","0","0","0"];
    let objCode = document.getElementById("currentCode");
    objCode.innerHTML = new_code.toString().split(',').join('');
    let objOldCode = document.getElementById("lastCode");
    objOldCode.innerHTML = old_code.toString().split(',').join('');

    old_badge = current_badge;
    current_badge = 0;
    resetWarnings();
    last_send = new Date();
}

function buttonpressed(button) {
    let divRNM = document.getElementById("rnm");
    if (((divRNM.value === "01") || (divRNM.value === "03")) && (current_badge === 0)) {
        clickButton();

        count[button-1] = incrementCount(count[button-1]);

        count_variation[button-1] = parseInt(count[button-1],16) - parseInt(old_count[button-1],16);

        let objVar = "increment" + button.toString();
        let objCount = "counter" + button.toString();
        let divobj = document.getElementById(objCount);
        let divvar = document.getElementById(objVar);
        divobj.innerHTML = count[button-1];
        divvar.innerHTML = count_variation[button-1];
    } else if (((divRNM.value === "01") || (divRNM.value === "03")) && (current_badge === 1)) {
        let divWarningCount = document.getElementById("WarningCount");
        divWarningCount.style.display='block';
        divWarningCount.innerHTML = "Warning: badge pressed, immediate send required";
    }

    if ((divRNM.value === "02") && (current_badge === 0)) {
        if (new_code[0] === "0"){
            clickButton();
            new_code.shift();
            new_code.push(button.toString());

            let objCode = document.getElementById("currentCode");
            objCode.innerHTML = new_code.toString().split(',').join('');
            count[button-1] = incrementCount(count[button-1]);
            count_variation[button-1] = parseInt(count[button-1],16) - parseInt(old_count[button-1],16);
        } else {
            let divWarningCode = document.getElementById("WarningCode");
            divWarningCode.style.display='block';
            divWarningCode.innerHTML = "Warning: you reached the maximum digit number";
        };
    } else if ((divRNM.value === "02") && (current_badge === 1)) {
        let divWarningCode = document.getElementById("WarningCode");
        divWarningCode.style.display='block';
        divWarningCode.innerHTML = "Warning: badge pressed, immediate send required";
    }
}

function badgeover() {
    let divbadge = document.getElementById("badgetop");
    divbadge.setAttribute("fill", "#5d98ba");
}

function badgeout() {
    let divbadge = document.getElementById("badgetop");
    divbadge.setAttribute("fill", "#4fc0e8");
}

function badgepressed() {
    if (current_badge === 0) {
        clickBadge();
        let divCurrentBadge = document.getElementById("currentBadge");
        let divCurrentBadgeCode = document.getElementById("currentBadgeCode");
        divCurrentBadge.innerHTML = current_badge === 1 ? 'Yes' : 'No';
        divCurrentBadgeCode.innerHTML = current_badge === 1 ? 'Yes' : 'No';

        let divOldBadge = document.getElementById("oldBadge");
        divOldBadge.innerHTML = old_badge === 1 ? 'Yes' : 'No';
    } else {
        let divWarningCode = document.getElementById("WarningCode");
        divWarningCode.style.display='block';
        divWarningCode.innerHTML = "Warning: badge already pressed, immediate send required";
        let divWarningCount = document.getElementById("WarningCount");
        divWarningCount.style.display='block';
        divWarningCount.innerHTML = "Warning: badge already pressed, immediate send required";
    }
}

function countApiMessage() {
    let frameType = current_badge === 1 ? '03' : '02';
    let currentTime = new Date();
    let apiMessage = {
        device:device_name,
        time:currentTime.toISOString(),
        sq_num: sq_num,
        frameType:frameType,
        data: {
            index:[parseInt(count[0],16),parseInt(count[1],16),parseInt(count[2],16),parseInt(count[3],16),parseInt(count[4],16)],
            increment:count_variation,
            ack: current_badge,
            button_1: count_variation[0],
            button_2: count_variation[1],
            button_3: count_variation[2],
            button_4: count_variation[3],
            button_5: count_variation[4]
        },
        'negativeValue': 0
    };
    return apiMessage;
}

function codeApiMessage() {
    let frameType = current_badge === 1 ? "3" : "1";
    frameType = old_badge === 1  ? `${frameType}3` : `${frameType}1`;
    
    let currentTime = new Date();
    if (sq_num > 1) {
        last_code_minute = Math.ceil((currentTime - last_send)/60000);
    }
    let apiMessage = {
        device:device_name,
        time:currentTime.toISOString(),
        dc_delay:0,
        sq_num: sq_num,
        frameType:frameType,
        data: {
            code:new_code.toString().split(',').join(''),
            increment:count_variation,
            ack: current_badge,
            button_1: count_variation[0],
            button_2: count_variation[1],
            button_3: count_variation[2],
            button_4: count_variation[3],
            button_5: count_variation[4]
        },
        previous: {
            code:old_code.toString().split(',').join(''),
            increment:old_count_variation,
            ack: old_badge,
            button_1: old_count_variation[0],
            button_2: old_count_variation[1],
            button_3: old_count_variation[2],
            button_4: old_count_variation[3],
            button_5: old_count_variation[4],
            previous_time:last_code_minute
        }
    };
    return apiMessage;
}

function buttonover(button) {
    let objCount = "button" + button.toString();
    let divobj = document.getElementById(objCount);
    divobj.setAttribute("fill", overColor[button-1]);
}

function buttonout(button) {
    let objCount = "button" + button.toString();
    let divobj = document.getElementById(objCount);
    divobj.setAttribute("fill", normalColor[button-1]);
}

function clickButton() {
    let greenLed = "#00f700";
    let blinkFreq = 100;
    let divobj;
    let led;
    let i;
    let divRNM = document.getElementById("rnm");
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
    let divbadge = document.getElementById("div-badge");
    divbadge.style["margin-top"] = "0.5em";
    let divonde1 = document.getElementById("onde1");
    divonde1.style["display"] = "block";
    let divonde2 = document.getElementById("onde2");
    divonde2.style["display"] = "block";
    setTimeout(function(){
        divbadge.style["margin-top"] = "2em";
        let divonde1 = document.getElementById("onde1");
        divonde1.style["display"] = "none";
        let divonde2 = document.getElementById("onde2");
        divonde2.style["display"] = "none";
    }, 1000);

    current_badge = 1;

    let greenLed = "red";
    let blinkFreq = 100;
    let divobj;
    let led;
    let i;
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
