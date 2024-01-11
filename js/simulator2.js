// Variables
let svg;

// Functions
function initPage() {
    svg = document.getElementById("keyboard").getSVGDocument();
    // Listeners on buttons
    svg.getElementById("button1").addEventListener("click", function () { clickButton("1") });
    svg.getElementById("button1").style.cursor = "pointer";

    svg.getElementById("button2").addEventListener("click", function () { clickButton("2") });
    svg.getElementById("button2").style.cursor = "pointer";
    
    svg.getElementById("button3").addEventListener("click", function () { clickButton("3") });
    svg.getElementById("button3").style.cursor = "pointer";
    
    svg.getElementById("button4").addEventListener("click", function () { clickButton("4") });
    svg.getElementById("button4").style.cursor = "pointer";

}


function clickButton(id) {
    let deviceID = document.getElementById("smilioDeviceId").value;
    let locationType = document.getElementById("locationType").value;

    // If no deviceID is given, then no request is sent
    if (!deviceID) {
        showStatus("Please set Device ID.", "orange")
        document.getElementById("smilioDeviceId").focus();
        return;
    }
    let link = `https://www.86percent.co/prototypes/skiply/index.php?device=${deviceID}&button=${id}&type=${locationType}`;

    $.ajax({
        url: link,
        method: "GET", //First change type to method here
        success: function () {
            showStatus("Request successful.", "green");
        },
        error: function (xhr, status, text) {
            showStatus("The endpoint replied with an error.", "red");
        },
    })

    display("#00ff00");
    setTimeout(display, 250);
}

function showStatus(text, bgColor) {
    let spanLastStatus = document.getElementById("lastStatus");
    spanLastStatus.innerHTML = text;
    spanLastStatus.style.backgroundColor = bgColor;
    spanLastStatus.style.padding = "3px";
    spanLastStatus.style.color = "white";
}

function display(color) {
    if (!color) { // No colors are provided => The default color is set
        color = "#767675";
    }
    svg.getElementById("display1").style.fill = color;
    svg.getElementById("display2").style.fill = color;
    svg.getElementById("display3").style.fill = color;
}