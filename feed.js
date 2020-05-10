async function likeButtonPressed(event) {
    let photoId = event.target.className;
    let userId = window.localStorage.getItem('id');
    let liked = await isLiked(photoId);
    if (!liked) {
        let query = "INSERT INTO `photoWebApp`.`likeuri` (`userid`, `pozaid`) VALUES ('" + userId + "', '" + photoId + "');";
        axios.get('/query?name=likeuri&query=' + query)
            .then(function(response) {
                let buttonLike = event.target;
                buttonLike.style.color = "#102310";
                buttonLike.style.backgroundColor = "#367c39";
                let likes = document.getElementById(photoId)
                likes.innerHTML = (Number(likes.innerHTML) + 1).toString();
            })
    } else {
        let query = "DELETE FROM `likeuri` WHERE `userid` = '" + userId + "' AND `pozaid` = '" + photoId + "'";
        axios.get('/query?name=likeuri&query=' + query)
            .then(function(response) {
                let buttonLike = event.target;
                buttonLike.style.color = "#ffffff";
                buttonLike.style.backgroundColor = "#4CAF50";
                let likes = document.getElementById(photoId)
                likes.innerHTML = (Number(likes.innerHTML) - 1).toString();
            })
    };

}

async function isLiked(idPoza) {
    let liked = 0;
    let userId = window.localStorage.getItem('id');
    let query = 'SELECT COUNT(*) FROM `likeuri` WHERE `pozaid` = "1000" OR (`userid` = "' + userId + '"AND `pozaid` = "' + idPoza + '")';
    await axios.get('/customquery?name=likeuri&query=' + query)
        .then(function(response) {
            liked = response.data.data[0][0];
            console.log(liked);
        })
        .catch(function(error) {
            console.error(error);
        });

    if (liked == 0) return false;
    else return true;
}

function commentButtonPressed(event) {
    let photoId = event.target.className;
    let userId = window.localStorage.getItem('id');
    let comment = document.getElementById("input" + photoId).value;
    document.getElementById("input" + photoId).value = "";

    axios.get('/uid')
        .then(function(response) {
            let uid = response.data.toString();
            let query = "INSERT INTO `photoWebApp`.`comentarii` (`comid`, `userid`, `pozaid`, `text`) VALUES ('" + uid + "', '" + userId + "', '" + photoId + "', '" + comment + "');";
            axios.get('/query?name=likeuri&query=' + query)
                .then(function(response) {
                	loadFeed();
                })
        })
}

function prettify(date) {
    let finalstr = "";
    finalstr = `${date[8]}${date[9]}/${date[5]}${date[6]}/${date[0]}${date[1]}${date[2]}${date[3]}, at ${date[11]}${date[12]}:${date[14]}${date[15]}.`
    return finalstr;
}

async function getLikes(photoId) { //counts likes per photo
    let totalLikes = 100;
    let query = 'SELECT COUNT(*) FROM `likeuri` WHERE `pozaid` = "' + photoId + '" OR `pozaid` = "1000"';
    await axios.get('/customquery?name=likeuri&query=' + query)
        .then(function(response) {
            totalLikes = (Number(response.data.data[0][0])).toString();
        })
        .catch(function(error) {
            console.error(error);
        });
    return totalLikes;
}

async function getUserName(userId) {
    let username = "ana";
    let query = 'SELECT `uname` FROM `users` WHERE `userid` = "' + userId + '"'
    await axios.get('/customquery?name=users&query=' + query)
        .then(function(response) {
            username = response.data.data[0][0];
        })
        .catch(function(error) {
            console.error(error);
        });
    // setTimeout(function(){console.log(username)}, 100);

    return username.toString();
}

async function createImgBox(path, user, date, titleText, idPoza, likes) {
    var div = document.createElement("div");
    div.classList.add("container");
    div.style.backgroundColor = "#f1f1f1";
    div.style.width = "50%"

    let intro = document.createElement("h2");
    intro.innerHTML = `Added by ${user} on ${date}`;
    div.appendChild(intro);

    let img = document.createElement("img");
    img.src = "/image?path=" + path;
    img.classList.add("center");
    img.setAttribute('alt', idPoza);
    div.appendChild(img);

    let title = document.createElement("h4");
    title.innerHTML = titleText;
    div.appendChild(title);

    let divMic = document.createElement("div");

    let buttonLike = document.createElement("button");
    buttonLike.style.width = "50%";
    buttonLike.style.fontSize = "25px";
    buttonLike.innerHTML = '👍&#8194&#8194';
    if (await isLiked(idPoza)) {
        buttonLike.style.color = "#102310";
        buttonLike.style.backgroundColor = "#367c39";
    } else {
        buttonLike.style.color = "#ffffff";
        buttonLike.style.backgroundColor = "#4CAF50";
    }


    buttonLike.style.textAlligh = "left"
    buttonLike.classList.add(idPoza);
    buttonLike.onclick = likeButtonPressed;
    divMic.appendChild(buttonLike);

    let like = document.createElement("b");
    like.id = idPoza;
    like.innerHTML = " " + likes
    like.style.color = "#4CAF50"

    divMic.appendChild(like);
    divMic.style.cssFloat = "right";
    divMic.style.backgroundColor = "#f1f1f1";
    div.appendChild(divMic);

    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    //adaugam comentariile pozei
    let divCom = document.createElement("div");
    divCom.classList.add("container");
    divCom.style.backgroundColor = "#e6e6e6";
    divCom.style.width = "80%";
    let queryCom = 'SELECT * FROM `comentarii` WHERE `pozaid` = "' + idPoza + '" OR `pozaid` = "1000" ORDER BY `data`';
    await axios.get('/customquery?name=comentarii&query=' + queryCom) //selectam toate caile pozelor de afisat
        .then(async function(response) {
            await response.data.data.forEach(async function(row, index) {
                if (row[0] != "1000") {
                    if (index == 1) {
                        let textCom = document.createElement("h3");
                        textCom.innerHTML = "Comments:";
                        divCom.appendChild(textCom);
                        divCom.appendChild(document.createElement("hr"));

                    }

                    let textCom = document.createElement("h4");
                    let username = await getUserName(row[1])
                    textCom.innerHTML = username.fontcolor("#004d00") + ": " + row[3].toString().bold();
                    await divCom.appendChild(textCom);
                    await divCom.appendChild(document.createElement("hr"));

                }
            });

        })

        .then(function(response) { //pune bara de adauga comentariu
            let sendDiv = document.createElement("div");
            let inputCom = document.createElement("input");
            inputCom.id = "input" + idPoza;
            inputCom.style.width = "100%";
            sendDiv.appendChild(inputCom);

            let butonSend = document.createElement("button");
            butonSend.innerHTML = 'Comment';
            butonSend.classList.add(idPoza);
            butonSend.onclick = commentButtonPressed;
            sendDiv.appendChild(butonSend);
            sendDiv.appendChild(document.createElement("hr"));
            divCom.appendChild(sendDiv);
            div.appendChild(divCom);
        })
        .catch(function(error) {
            console.error(error);
        });

    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("hr"));
    return div;
}


function loadFeed() {
    let tableName = "poze";
    let query = "SELECT * FROM `poze` ORDER BY `data` DESC";

    axios.get('/customquery?name=' + tableName + '&query=' + query) //selectam toate caile pozelor de afisat
        .then(function(response) {
            let div = document.getElementById("photos");
            div.innerHTML = "";
            response.data.data.forEach(async function(row, index) {
                //console.log(row)
                let username = await getUserName(row[1]);
                //console.log("user " + username)
                if (row[3] != "/pozaadmin") {
                    //                            cale,  user,    date,           titleText, idPoza, likes
                    let img = await createImgBox(row[3], username, prettify(row[2]), row[4], row[0], await getLikes(row[0]));
                    div.appendChild(img);

                }
            })

        })
        .catch(function(error) {
            console.error(error);
        });
}

loadFeed();