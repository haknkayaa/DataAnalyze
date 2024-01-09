document.getElementById('myTextarea').addEventListener('input', function () {
    // Burada istediğiniz fonksiyonu çağırın
    editLiveText();
});


let idList = [];

// create random light color without white, black and gray
let randomColor = ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9', '#BBDEFB', '#B3E5FC', '#B2EBF2', '#B2DFDB', '#C8E6C9', '#DCEDC8', '#F0F4C3', '#FFF9C4', '#FFECB3', '#FFE0B2', '#FFCCBC', '#D7CCC8', '#F5F5F5', '#CFD8DC'];



function editLiveText() {
    // metni iki karakterli aralarına boşluk koyarak yazdır
    // örnek: "me rh ab a"
    var myText = document.getElementById('myTextarea').value;

    var newText = twoDigitEdit(myText);

    // change text
    document.getElementById('myTextarea').value = newText;

    analyze();
}

function twoDigitEdit(myText) {
    // metinde boşluk varsa kaldır
    myText = myText.replace(/\s/g, '');

    var myTextArray = myText.split('');
    var myTextArrayLength = myTextArray.length;
    var newText = '';

    for (var i = 0; i < myTextArrayLength; i++) {
        if (i % 2 == 1) {
            newText += myTextArray[i] + ' ';
        }
        else {
            newText += myTextArray[i];
        }
    }

    return newText;
}


// create add new identifier function
function addNewIdentifier() {
    console.log('[+] add new identifier');


    // Get the table element
    var table = document.getElementById('highlightTable');

    // Insert a new row at the end of the table
    var newRow = table.insertRow(-1);

    // Insert new cells in the row
    var cell_no = newRow.insertCell(0);
    var cell_label = newRow.insertCell(1);
    var cell_color = newRow.insertCell(2);
    var cell_startIndex = newRow.insertCell(3);
    var cell_endIndex = newRow.insertCell(4);
    var cell_dataType = newRow.insertCell(5);
    var cell_converted = newRow.insertCell(6);
    var cell_action = newRow.insertCell(7);

    // Add some text to the new cells
    cell_no.innerHTML = table.rows.length - 1;
    cell_label.innerHTML = '<input type="text" id="label" name="head" value="label" style="width: 100%; height: 28px;">';
    cell_color.innerHTML = '<input type="color" id="color" name="head" value="' + randomColor[Math.floor(Math.random() * randomColor.length)] + '" style="width: 100%; height: 28px;">';
    cell_startIndex.innerHTML = '<input type="number" id="startIndex" name="head" value="0" style="width: 40px; height: 28px;">';
    cell_endIndex.innerHTML = '<input type="number" id="endIndex" name="head" value="0" style="width: 40px; height: 28px;">';
    cell_dataType.innerHTML = '<select name="cars" id="valueType" style="height: 28px;"> \
                                        <option value="int">int</option> \
                                        <option value="char">char</option>\
                                        <option value="float">float</option>\
                                        <option value="ascii">ascii</option>\
                                    </select>';
    cell_converted.innerHTML = '<input type=" text" id="convertedValue" name="head" value="0" style="width: 100%; height: 28px;">';
    cell_action.innerHTML = '<button type="button" class="btn btn-outline-danger" onclick="removeCurrentRow(this)" style="width: 100%; height: 28px; line-height: 8px;">Remove</button>';



    // Add an event listener for the change event
    cell_color.getElementsByTagName('input')[0].addEventListener('change', function () {
        changedValuesApplyChanges();
    });
    cell_startIndex.getElementsByTagName('input')[0].addEventListener('input', function () {
        changedValuesApplyChanges();
    });
    cell_endIndex.getElementsByTagName('input')[0].addEventListener('input', function () {
        changedValuesApplyChanges();
    });
    cell_dataType.getElementsByTagName('select')[0].addEventListener('change', function () {
        changedValuesApplyChanges();
    });
}

function removeCurrentRow(row) {
    var i = row.parentNode.parentNode.rowIndex;
    document.getElementById("highlightTable").deleteRow(i);
    console.log("Row deleted: " + i);
}

function highlightText() {
    var text = document.getElementById('myTextarea').value;
    var characters = text.split(' ');
    var newText = '';

    for (var i = 0; i < characters.length; i++) {
        var color = '';
        var label = '';
        for (var j = 0; j < idList.length; j++) {
            if (i >= idList[j].startIndex && i < idList[j].endIndex) {
                color = idList[j].color;
                label = idList[j].label;
                break;
            }
        }
        if (color) {
            newText += '<span style="color:' + color + ';" title="' + label + '">' + characters[i] + '</span>';
        } else {
            newText += characters[i];
        }
        newText += ' ';
    }

    document.getElementById('resultContainer').innerHTML = newText;
}

function updateConvertedValue() {

    // current text 
    var text = document.getElementById('myTextarea').value;
    var textArray = text.split(' ');

    for (var i = 0; i < idList.length; i++) {
        var valueType = idList[i].dataType;

        // substring
        var willConvertedValue = textArray.slice(idList[i].startIndex, idList[i].endIndex);
        var convertedValue = '';

        if (valueType == 'int') { // example 65 e5 = 26085
            for (var j = 0; j < willConvertedValue.length; j++) {
                convertedValue += willConvertedValue[j];
            }
            console.log("willConvertedValue: " + willConvertedValue);
            convertedValue = parseInt(convertedValue, 16);
        }
        else if (valueType == 'float') {
            for (var j = 0; j < willConvertedValue.length; j++) {
                convertedValue += willConvertedValue[j];
            }

            var int = parseInt(convertedValue, 16);
            var buffer = new ArrayBuffer(4);
            var view = new DataView(buffer);
            view.setUint32(0, int);
            convertedValue = view.getFloat32(0);
        }
        else if (valueType == 'char') {
            convertedValue = convertedValue.charAt(0);
        }
        else if (valueType == 'ascii') {
            // example 41 42 = AB
            for (var j = 0; j < willConvertedValue.length; j++) {
                convertedValue += String.fromCharCode(parseInt(willConvertedValue[j], 16));
            }
        }

        idList[i].convertedValue = convertedValue;
        console.log("converted value:" + idList[i].convertedValue)
    }

    // update table
    var table = document.getElementById('highlightTable');
    var rowCount = table.rows.length;

    for (var i = 1; i < rowCount; i++) {
        table.rows[i].cells[6].children[0].value = idList[i - 1].convertedValue;
    }
}

function analyze() {
    console.log('[+] Analyze function');

    // tabloyara göre idList oluştur
    idList = [];

    var table = document.getElementById('highlightTable');
    var rowCount = table.rows.length;

    for (var i = 1; i < rowCount; i++) {
        var id = {
            no: i,
            label: table.rows[i].cells[1].children[0].value,
            color: table.rows[i].cells[2].children[0].value,
            startIndex: table.rows[i].cells[3].children[0].value,
            endIndex: table.rows[i].cells[4].children[0].value,
            dataType: table.rows[i].cells[5].children[0].value,
            convertedValue: table.rows[i].cells[6].children[0].value
        }
        idList.push(id);
    }

    highlightText();
    updateConvertedValue();
}

function clearContent() {
    console.log('[+] Clear');

    // clear table
    var table = document.getElementById('highlightTable');
    var rowCount = table.rows.length;

    for (var i = 1; i < rowCount; i++) {
        table.deleteRow(1);
    }

    // clear textarea
    document.getElementById('myTextarea').value = '';

    // clear result
    document.getElementById('resultContainer').innerHTML = '';
}

function test() {
    console.log('test');

}


function changedValuesApplyChanges() {
    console.log('[+] changedValuesApplyChanges');

    analyze();
}

// call function when page loaded
window.onload = function () {

    console.log('Page loaded');

    setTimeout(function () {
        console.log('Timeout');
         // show content
         document.getElementsByClassName('content')[0].style.display = 'block';
         // hide loading
         document.getElementsByClassName('loader')[0].style.display = 'none';
    }, 2000);
}