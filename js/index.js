//import function from online firebase package
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//access html elements
const button = document.getElementById('add-button');
const input = document.getElementById('input-field');
const list = document.getElementById("list");

// app SETTINGS
const appSettings = {
    //constant var name used to identify database url : database url
    databaseURL: process.env.get("FIREBASE_DATABASE_URL"),
};

// initialize the app
const app = initializeApp(appSettings);

//get the database connection reference
const database = getDatabase(app);

//ref(database , referenceNAme) location of db collection
const itemsListInDB = ref(database, 'itemsList')

//add element to list
function addToList(item) {

    let itemID = item[0];
    let itemValue = item[1];

    let newElement = document.createElement('li');
    newElement.textContent = item[1];
    list.append(newElement)

    newElement.addEventListener('dblclick', () => {
        let location = ref(database, `itemsList/${itemID}`);
        remove(location);
    });
}


//clear input
function clearInput() {
    input.value = '';
}

//clear List
function clearList() {
    list.innerHTML = '';
}

//this function runs every time database changed
// snapshot var name is not constant you can change it
onValue(itemsListInDB, (snapshot) => {

    if (snapshot.exists()) {
        let arrayItems = Object.entries(snapshot.val());
        clearList();

        for (let i = 0; i < arrayItems.length; i++) {
            let currentItem = arrayItems[i];
            addToList(currentItem);
        }
    } else {
        list.innerHTML = "No items here... yet";
    }

})

button.addEventListener('click', () => {
    let inpValue = input.value;

    if (inpValue != '') {
        push(itemsListInDB, inpValue);
        clearInput();
    }
});






