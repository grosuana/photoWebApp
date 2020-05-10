const secret = require('./secret.js');
const mytoken = secret.token;
const fs = require('fs');
const pathJoin = require('path').join;
const dropboxV2Api = require('dropbox-v2-api');
const dropbox = dropboxV2Api.authenticate({
	token: mytoken
});


dropbox({
	resource: 'users/get_current_account'
}, (err, result /*, response*/ ) => {
	if (err) {
		console.log(result);
		return console.log('err:', err);
	}
	//console.log(result);
});

function listFolder(path = '', callback = console.log) { //listFolder('folderul fata de rootul din dropBox'); 'callback' trebuie sa fie o functie careia eu
	//ii transmit calea completa fisier i + nume fisier ; defaults to console.log
	dropbox({
		resource: 'files/list_folder',
		parameters: {
			path: path
		}
	}, (err, result, /*response*/ ) => {
		if (err) console.log(err);
		result.entries.forEach(entry => {
			callback(entry.path_display, entry.name);
		});
	});
}

function createFolder(path) { 
	return new Promise(function(resolve, reject){
		//console.log('in create folder ' + path)
		dropbox({
			resource: 'files/create_folder',
			parameters: {
				path: path
			}
		}, (err, result, /*response*/ ) => {
			if (err) {
				console.log(err);
				reject(err);
			}
			//console.log(result);
			resolve(result)
		});
	})
	
}

function uploadFile(dropboxPath, localPath) {
	dropbox({
		resource: 'files/upload',
		parameters: {
			path: dropboxPath
		},
		readStream: fs.createReadStream(localPath)
	}, (err /*, result, response*/ ) => {
		if (err) console.log(err);
	});
}

function downloadFile(folderPath, filePath, name) {
	return new Promise((resolve, reject) => {
		let path = pathJoin('./', folderPath, name);
		let s = fs.createWriteStream(path);
		dropbox({
			resource: 'files/download',
			parameters: {
				path: filePath
			}
		}, (err/*, result, response*/) => {

			if (err) reject();
		})
			.pipe(s);
		s.on('finish', function () {
			resolve();
		});
	});
	//console.log(folderPath + ' ' + name);
}


// listFolder('/APP1001/'); // afiseaza continut folder /APP1001
// createFolder('/anaaremere'); //adauga folder anaaremere
// uploadFile('/anaaremere/ana.txt', './ana.txt');

module.exports.listFolder = listFolder;
module.exports.createFolder = createFolder;
module.exports.uploadFile = uploadFile;
module.exports.downloadFile = downloadFile;