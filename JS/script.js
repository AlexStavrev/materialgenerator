var item = new Object();

function generate() {
  item.id = document.querySelector('[name="id"]').value;
  item.name = camelize(document.querySelector('[name="name"]').value);
  if (document.querySelector('[name="description"]').value != "") {item.description = document.querySelector('[name="description"]').value.split('\n');}
  else {item.description = []}
  item.rarity = document.querySelector('[name="rarity"]').value.toUpperCase();
  item.type = document.querySelector('[name="type"]').value.toUpperCase();
  item.tags = document.querySelector('[name="tags"]').value.split('\n');
  if (document.querySelector('[name="foodValue"]').value != "") item.food_value = parseFloat(document.querySelector('[name="foodValue"]').value)
  item.material = document.querySelector('[name="material"]').value.toUpperCase();
  item.skin_value = document.querySelector('[name="skinValue"]').value;
  item.protected = JSON.parse(document.querySelector('[name="protected"]').value);
  item.finite = JSON.parse(document.querySelector('[name="finite"]').value);
  item.model = parseInt(document.querySelector('[name="model"]').value, 10);


  var newItem = JSON.stringify(item, null, "\t");
    let allAreFilled = true;
    document.getElementById("new").querySelectorAll("[required]").forEach(function(i) {
    if (!allAreFilled) return;
    if (!i.value) allAreFilled = false;
    if (i.type === "radio") {
      let radioValueCheck = false;
      document.getElementById("new").querySelectorAll(`[name=${i.name}]`).forEach(function(r) {
        if (r.checked) radioValueCheck = true;
      })
      allAreFilled = radioValueCheck;
    }
  })
  if (!allAreFilled) {
    alert('Fill all the fields');
    return;
  }

  document.getElementById('previewJson').value = newItem;
  auto_grow(document.getElementById('previewJson'))
}

function camelize(str){
  return  (" " + str).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function(match, chr)
      {
          return chr.toUpperCase();
      });
}


function showFile(input) {
  generate();
  let file = input.files[0];
  var jsonFile;
  let reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function() {

    if (reader.result === "") {
      jsonFile = item;
      console.log(jsonFile);
    }
    else {
      try {
          JSON.parse(reader.result);
      } catch (e) {
          alert("Invalid file! Make sure it contains JSON objects or that it's empty!");
          return;
      }
      jsonFile = JSON.parse(reader.result);
      jsonFile.push(item);
      console.log(jsonFile);
  }
  download(JSON.stringify(jsonFile, null, "\t"), file.name, 'text/plain');

  };
  reader.onerror = function() {
    console.log(reader.error);
  };
}

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
  }

function skinPreview(id) {
  var headSides = document.getElementsByClassName("customHead");
  var urlString = 'url(http://textures.minecraft.net/texture/' + id + ')';

  for (var i = 0, max = headSides.length; i < max; i++) {
      headSides[i].style.backgroundImage = urlString;
  }
}

function preview() {
  var previewBox = document.getElementById("preview");
  var name = camelize(document.querySelector('[name="name"]').value) + "\n";
  var description = document.querySelector('[name="description"]').value;
  var rarity = camelize(document.querySelector('[name="rarity"]').value);
  var type = camelize(document.querySelector('[name="type"]').value) + "\n";
  var skin = document.querySelector('[name="skinValue"]').value;

  if (description != "") {
    description += "\n";
  }

  previewBox.value = name + description + "\nType: " +  type + "Rarity: " + rarity;
  if (skin) skinPreview(skin)

  auto_grow(previewBox);
}

auto_grow(document.getElementById('previewJson'));
auto_grow(document.getElementById("preview"));
preview();

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}


function download(strData, strFileName, strMimeType) {
var D = document,
    A = arguments,
    a = D.createElement("a"),
    d = A[0],
    n = A[1],
    t = A[2] || "text/plain";

//build download link:
a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


if (window.MSBlobBuilder) { // IE10
    var bb = new MSBlobBuilder();
    bb.append(strData);
    return navigator.msSaveBlob(bb, strFileName);
} /* end if(window.MSBlobBuilder) */



if ('download' in a) { //FF20, CH19
    a.setAttribute("download", n);
    a.innerHTML = "downloading...";
    D.body.appendChild(a);
    setTimeout(function() {
        var e = D.createEvent("MouseEvents");
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
        D.body.removeChild(a);
    }, 66);
    return true;
}; /* end if('download' in a) */



//do iframe dataURL download: (older W3)
var f = D.createElement("iframe");
D.body.appendChild(f);
f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
setTimeout(function() {
    D.body.removeChild(f);
}, 333);
return true;
}
