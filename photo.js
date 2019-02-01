var input = document.querySelector('input');
var preview = document.querySelector('.preview');
let UserIdentity = "";
let userId = document.getElementById('userId');

input.style.opacity = 0;
input.addEventListener('change', updateImageDisplay);


function getUserIdentity(){
let query = 'SELECT `userid` FROM `users` WHERE `uname`="'+ window.localStorage.getItem('username') +'"';
	axios.get('/customquery?name=' + "users" + '&query=' + query)
        .then(function(response) {
            window.localStorage.setItem("id", response.data.data[0][0].toString());
            userId.value = response.data.data[0][0].toString();
        })
}

function updateImageDisplay() {
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }

    var curFiles = input.files;
    if (curFiles.length === 0) {
        var para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    } else {
        var list = document.createElement('ol');
        preview.appendChild(list);
        // for (var i = 0; i < curFiles.length; i++) {
        	let i = 0;
            var listItem = document.createElement('li');
            var para = document.createElement('p');
            if (validFileType(curFiles[i])) {
                para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';
                var image = document.createElement('img');
                image.src = window.URL.createObjectURL(curFiles[i]);

                listItem.appendChild(image);
                listItem.appendChild(para);

            } else {
                para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
                listItem.appendChild(para);
            }

            list.appendChild(listItem);
       // }
    }
}

var fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png'
]

function validFileType(file) {
    for (var i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
            return true;
        }
    }

    return false;

}

function returnFileSize(number) {
    if (number < 1024) {
        return number + 'bytes';
    } else if (number >= 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB';
    } else if (number >= 1048576) {
        return (number / 1048576).toFixed(1) + 'MB';
    }
}

let form = document.getElementById("myform");
let formbutton = document.getElementById("submitButton");

formbutton.onclick = function(event){
	if(form.image_uploads.value != "") {
		console.log(userId.value)
		console.log(form.submit());
	}
	else(window.alert("Must submit an image."))
}

if(!window.localStorage.getItem('id')) {
	getUserIdentity();
}else{
	UserIdentity = window.localStorage.getItem('id');
	userId.value = window.localStorage.getItem('id');
}