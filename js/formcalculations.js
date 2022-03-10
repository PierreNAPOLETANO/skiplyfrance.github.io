function hideDLFrame() {
    var divobj = document.getElementById('DLFrame');
    divobj.style.display='none';
}

function showDLFrame()
{
    //Here we get the total price by calling our function
    //Each function returns a number so by calling them we add the values they return together
    var theForm = document.forms["smilioParameters"];
    var csc = theForm.elements["csc"].value;
    var eat = theForm.elements["eat"].value;

    var dutycycle = theForm.elements["dutycycle"].value;
    var backoff = theForm.elements["backoff"].value;
    var piggyback = theForm.elements["piggyback"].value;
    var ADR = theForm.elements["ADR"].value;
    var forceDR0 = theForm.elements["forceDR0"].value;
    var dtx = parseInt(theForm.elements["dtx"].value,10);

    var dtx_bin = (+dtx).toString(2);

		for (var i = dtx_bin.length; i < 11; i++) {
			dtx_bin = "0" + dtx_bin;
		};

		var concat_dl = parseInt(dutycycle + backoff + piggyback + forceDR0 + ADR + dtx_bin,2);
		concat_dl = concat_dl.toString(16);

		for (var i = concat_dl.length; i < 4; i++) {
			concat_dl = "0" + concat_dl;
		};

		var tpb = parseInt(theForm.elements["tpb"].value,10);
		var tpb_str = tpb.toString(16);
		if (tpb < 16) {
			tpb_str = "0" + tpb_str;
		};
		var rnm = theForm.elements["rnm"].value;
		var lwf = theForm.elements["lwf"].value;
		var tpbq = parseInt(theForm.elements["tpbq"].value,10);
		var tpbq_str = tpbq.toString(16);
		if (tpbq < 16) {
			tpbq_str = "0" + tpbq_str;
		};

    var DLFrame = "05" + csc + eat + concat_dl + tpb_str + rnm + lwf + tpbq_str;
    
    var regex1 = RegExp("([A-F]|[0-9])([A-F]|[0-9])");

    //display the result
    var divobj = document.getElementById("DLFrame");
    divobj.style.display='block';
    if (tpb <= 60 && tpbq > 2 && tpbq <= 60 && dtx <= 1440 && regex1.test(lwf)) {
    	divobj.style.backgroundColor='green';
      divobj.innerHTML = "Hex Frame: "+ DLFrame.toUpperCase() + "<br /><br />For base 64 Frame (Helium), use <a href='https://base64.guru/converter/encode/hex'>this converter</a>"
    } else {
      divobj.style.backgroundColor='red';
    	divobj.innerHTML = "Invalid parameters";
    }
}
