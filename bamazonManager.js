/*
bamazonManager.js
Author: Kervin Angelo B. Del Rosario
Purpose: To create a customer side CLI app that can let the user see the
        items for sale and buy items that will reflect the changes on the
        corresponding table in the database.
Date: 2020
*/

var mysql = require("mysql");
var inq = require("inquirer");


var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})

function start() {
    connection.connect(function (err) {
        if (err) {
            throw err;
        }
        textFormatter(" BAMAZON SHOP <===");
        textFormatter(" MANAGER ACC  <===");
        vamanosManager();
    });
}

function vamanosManager() {
    //console.log("START - vamanosManager()");
    inq.prompt([
        {
            name: "choice",
            type: "list",
            message: "Welcome back, Lazy Manager!\nChoose action: ",
            choices: ["View Products for Sale", "View Low Inventory",
                "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function (answer) {
        if (answer.choice == "View Products for Sale") {
            viewAllThings();
        } else if (answer.choice == "View Low Inventory") {
            viewLowNo();
        } else if (answer.choice == "Add to Inventory") {
            addStock();
        } else if (answer.choice == "Add New Product") {
            newProduct();
        }
        else {
            textFormatter("Bye, Lazy Manager! I hope you help your colleagues today.");
            connection.end();
        }
    })
}

function viewAllThings() {
    //console.log("START - viewAllThings()");

    connection.query("SELECT * from products",
        function (err, res) {
            if (err) throw err;
            console.log("\n------- BAMAZON'S ITEM LIST --------\n");
            for (let i = 0; i < res.length; i++) {
                console.log(res[i].item_id + " | "
                    + res[i].product_name + " | "
                    + res[i].department_name + " | "
                    + res[i].price + " aud | "
                    + res[i].stock_quantity + " pcs.");

            }
            console.log("\n-----------------------------------\n");

            vamanosManager();
        });
}

function viewLowNo() {
    //console.log("START - viewLowNo()");

    connection.query("SELECT * from products WHERE stock_quantity < 5",
        function (err, res) {
            if (err) throw err;
            console.log("\n------- BAMAZON'S ITEM LIST --------\n");
            for (let i = 0; i < res.length; i++) {
                console.log(res[i].item_id + " | "
                    + res[i].product_name + " | "
                    + res[i].department_name + " | "
                    + res[i].price + " aud | "
                    + res[i].stock_quantity + " pcs.");

            }
            if (res.length < 1) {
                textFormatter("ALL ITEMS STOCK QUANTITY IS 5 AND ABOVE.")
            }
            console.log("\n-----------------------------------\n");

            vamanosManager();
        });
}

function addStock() {
    //console.log("START - addStock()");

    connection.query("SELECT * from products",
        function (err, res) {
            if (err) throw err;
            console.log("\n------- BAMAZON'S ITEM LIST --------\n");
            for (let i = 0; i < res.length; i++) {
                console.log(res[i].item_id + " | "
                    + res[i].product_name + " | "
                    + res[i].department_name + " | "
                    + res[i].price + " aud | "
                    + res[i].stock_quantity + " pcs.");

            }
            console.log("\n-----------------------------------\n");

            managerPrompt(res);


        });
}

function managerPrompt(res) {
    //console.log("START - managerPrompt()");

    inq.prompt([
        {
            name: "choice",
            type: "input",
            message: "Input ID number of the desired item you want to add stock to: ",
            validate: function (value) {
                if ((isNaN(value) === false) && value !== "") {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answer) {
            if (!isNaN(answer.choice)) {

                // get the information of the chosen item
                let chosenItem;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].item_id == answer.choice) {
                        chosenItem = res[i];
                    }
                }
                managerPromptQuantity(chosenItem);
            }
            else {
                errorNaN();
                managerPrompt(res);
            }
        });
}

function managerPromptQuantity(item) {
    //console.log("START - managerPromptQuantity()");

    inq.prompt([
        {
            name: "quantity",
            type: "input",
            message: "We have " + item.stock_quantity + " pcs. in stock. How many " + item.product_name + " you want to add?: "
        }
    ]).then(function (answer) {
        if (!isNaN(answer.quantity)) {
            updateItem(item.item_id, item.product_name, item.price, item.stock_quantity, answer.quantity);
        }
        else {
            errorNaN();
            customerPromptQuantity(item);
        }
        //vamanosManager();
    });
}

function updateItem(id, name, price, stock, quantity) {
    //console.log("START - updateItem()");

    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: parseInt(stock) + parseInt(quantity)
            },
            {
                item_id: id
            }
        ],
        function (err, res) {
            if (err) throw err;
            //console.log(res.affectedRows + " products updated!\n");
            textFormatter("\nThe current stock of " + name + " is now  " + (parseInt(stock) + parseInt(quantity)) + " \n");
            vamanosManager();
        }
    );

}

function newProduct() {
    //console.log("START - newProduct()");

    inq.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the item to be added?: "
        },
        {
            name: "department",
            type: "input",
            message: "Which department should this item fall in?: "
        },
        {
            name: "price",
            type: "input",
            message: "What would be the price of this item?: ",
            validate: function (value) {
                if ((isNaN(value) === false) && value !== "") {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.name,
                    department_name: answer.department,
                    price: answer.price || 0,
                    stock_quantity: 0
                },
                function (err) {
                    if (err) throw err;
                    textFormatter("Item " + answer.name + "\nhas been added into "
                        + answer.department + " department\nwith a price of " + answer.price + " aud");
                    vamanosManager();
                }
            );
        });
}


function errorNaN() {
    textFormatter("Please only input numbers.");
}


function textFormatter(text) {
    console.log("\n======================================\n");
    console.log("= = = = = " + text + " = = = = =");
    console.log("\n======================================\n");
}

start();