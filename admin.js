let globalTable = {};

function modifyRow() {
    let modifyRow = document.getElementById("rowModify");
    let tableName = globalTable.name;
    let rowNum = modifyRow.value - 1;
    let query = "UPDATE `mobilaComanda`.`" + tableName + "` SET ";
    globalTable.columns.forEach(function(column, index) {
        let inputValue = document.getElementById("input" + index);
        query = query + "`" + column.toString() + "` = '" + inputValue.value.toString() + "', ";
    })
    query = query.slice(0, -2);
    query = query + " WHERE `" + tableName + "`.`" + globalTable.columns[0].toString() + "` = " + globalTable.data[rowNum][0] + ";";
    //UPDATE `mobilaComanda`.`salarii` SET `codSalariu` = '5000', `valoare` = '1501' WHERE `salarii`.`codSalariu` = 600;
    //UPDATE `mobilaComanda`.`masini` SET `codMasina` = '1000', `ocupata` = 'DA' WHERE `masini`.`codMasina` = 1001
    //console.log(query);
    axios.get('/query?name=' + tableName + '&query=' + query)
        .then(function(response) {
            showTable(globalTable);
            //console.log(response);
        })
}

function deleteRow() {
    let deleteRow = document.getElementById("rowDelete");
    let tableName = globalTable.name;
    let rowNum = deleteRow.value - 1;
    let query = "DELETE FROM `mobilaComanda`.`" + tableName + "` WHERE `" + tableName + "`.`" + globalTable.columns[0] + "` = " + globalTable.data[rowNum][0];
    // "DELETE FROM `mobilaComanda`.`salarii` WHERE `salarii`.`codSalariu` = 900"
    //console.log(query);
    axios.get('/query?name=' + tableName + '&query=' + query)
        .then(function(response) {
            showTable(globalTable);
            //console.log(response);
        })
}

function myFunction() {
    var table = document.getElementById("t01");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = "NEW CELL1";
    cell2.innerHTML = "NEW CELL2";
    cell3.innerHTML = "ad"
}

function addRow() {
    //INSERT INTO `mobilaComanda`.`salarii` (`codSalariu`, `valoare`) VALUES ('900', '034567');
    let tableName = globalTable.name;
    let columnNames = "";
    globalTable.columns.forEach(function(column) {
        columnNames = columnNames + "`" + column + "`, ";
    })
    columnNames = columnNames.slice(0, -2);
    columnNames += ") VALUES ";
    let values = "(";

    for (var j = 0; j < globalTable.columns.length; j++) {
        let inputField = document.getElementById("input" + j).value;
        values = values + "'" + inputField.toString() + "', "
    }
    values = values.slice(0, -2);

    let query = "INSERT INTO `mobilaComanda`.`" + tableName + "` (" + columnNames + values + ");";
    // console.log(query);
    //console.log(globalTable);

    axios.get('/query?name=' + tableName + '&query=' + query)
        .then(function(response) {
            showTable(globalTable);
            // console.log(response);
        })
}

function getTables() {
    let dropdown = document.getElementById("dropdown");
    axios.get('/databaseNames')
        .then(function(response) {
            //console.log(response)
            response.data.forEach(function(tableName) {
                let option = document.createElement("option");
                option.text = tableName.toString();
                dropdown.add(option);
                //console.log(option)
            })
            showTable();
        })
        .catch(function(error) {
            console.error(error);
        });
}

function showTable(object) {
    //console.log("tableName")
    let tableName = document.getElementById("dropdown").value;
    // console.log(tableName);
    axios.get('/table?name=' + tableName.toString())
        .then(function(response) {
            globalTable = response.data;
            //console.log(response.data);
            let table = document.getElementById("t01");
            let addRow = document.getElementById("toAdd");
            let deleteRow = document.getElementById("rowDelete");
            let modifyRow = document.getElementById("rowModify");
            table.innerHTML = "";
            addRow.innerHTML = "";
            deleteRow.innerHTML = "";
            modifyRow.innerHTML = "";

            let header = table.createTHead();
            let row1 = table.insertRow(0);
            let toInsert = addRow.insertRow(0);
            let toInsertButton = addRow.insertRow(1);


            for (let j = 0; j < response.data.columns.length; j++) {
                let cell = row1.insertCell(j);
                let inputField = toInsert.insertCell(j);
                cell.innerHTML = response.data.columns[j].toString();
                inputField.innerHTML = '<input type="text" id="input' + j + '">';
            }


            for (let i = 1; i <= response.data.rows; i++) {
                let row = table.insertRow(i);
                for (let j = 0; j < response.data.columns.length; j++) {
                    let cell = row.insertCell(j);
                    //console.log(response.data.data[i - 1][j] == null);
                    if (response.data.data[i - 1][j] != null) {
                        cell.innerHTML = response.data.data[i - 1][j].toString();
                    } else {
                        cell.innerHTML = "'Null'";
                    }
                }

            }

            let titluTabel = document.getElementById("nume");
            titluTabel.innerHTML = tableName;
            //console.log(titluTabel);

             console.log(globalTable);
            for (var i = 0; i < globalTable.rows; i++) {
                let option = document.createElement("option");
                option.text = (i + 1).toString();
                deleteRow.add(option);

                let option1 = document.createElement("option");
                option1.text = (i + 1).toString();
                modifyRow.add(option1);
            }
        })
        .catch(function(error) {
            console.error(error)
        });
}


let button = document.getElementById("butonas");
button.onclick = addRow;
let dropdown = document.getElementById("dropdown");
dropdown.onchange = showTable;
let deleteB = document.getElementById("cancelBut");
deleteB.onclick = deleteRow;
let modifyB = document.getElementById("modify");
modifyB.onclick = modifyRow;


getTables();