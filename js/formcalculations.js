function hideDLFrame() {
  let divobj = document.getElementById('DLFrame');
  divobj.style.display='none';
}

function showDLFrame()
{
  let theForm = document.forms["smilioParameters"];
  let csc = theForm.elements["csc"].value;
  let eat = theForm.elements["eat"].value;
  let dutycycle = theForm.elements["dutycycle"].value;
  let backoff = theForm.elements["backoff"].value;
  let piggyback = theForm.elements["piggyback"].value;
  let ADR = theForm.elements["ADR"].value;
  let forceDR0 = theForm.elements["forceDR0"].value;
  let dtx = parseInt(theForm.elements["dtx"].value,10);
  let dtx_bin = (+dtx).toString(2);

  for (let i = dtx_bin.length; i < 11; i++) {
      dtx_bin = "0" + dtx_bin;
  }

  let concat_dl = parseInt(dutycycle + backoff + piggyback + forceDR0 + ADR + dtx_bin,2);
  concat_dl = concat_dl.toString(16);

  for (let i = concat_dl.length; i < 4; i++) {
    concat_dl =  `0${concat_dl}`;
  }

  let tpb = parseInt(theForm.elements["tpb"].value,10);
  let tpb_str = tpb.toString(16);

  if (tpb < 16) {
    tpb_str =  `0${tpb_str}`;
  }

  let rnm = theForm.elements["rnm"].value;
  let lwf = theForm.elements["lwf"].value;
  let tpbq = parseInt(theForm.elements["tpbq"].value,10);
  let tpbq_str = tpbq.toString(16);

  if (tpbq < 16) {
        tpbq_str = `0${tpbq_str}`;
  }

  let DLFrame = "05" + csc + eat + concat_dl + tpb_str + rnm + lwf + tpbq_str;
  let regex1 = RegExp("([A-F]|[0-9])([A-F]|[0-9])");
  let divobj = document.getElementById("DLFrame");

  divobj.style.display = 'block';

  if (tpb <= 60 && tpbq > 2 && tpbq <= 60 && dtx <= 1440 && regex1.test(lwf)) {
      divobj.style.backgroundColor = 'green';
      divobj.innerHTML = `Hex Frame: ${DLFrame.toUpperCase()}<br /><br />For base 64 Frame (Helium), use <a href='https://base64.guru/converter/encode/hex'>this converter</a>`
  } else {
      divobj.style.backgroundColor = 'red';
    divobj.innerHTML = "Invalid parameters";
  }
}
