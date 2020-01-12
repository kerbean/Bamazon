/*
bamazonCustomer.js
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
        vamanosCustomer();
    });
}

function vamanosCustomer() {
    //console.log("START - vamanosCustomer()");
    inq.prompt([
        {
            name: "choice",
            type: "list",
            message: "Choose action: ",
            choices: ["Show List and Buy Something", "Exit"]
        }
    ]).then(function (answer) {
        if (answer.choice == "Show List and Buy Something") {
            buySomething();
        }
        else {
            connection.end();
        }
    })
}

function buySomething() {
    //console.log("START - buySomething()");

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

            customerPrompt(res);


        });
}

function customerPrompt(res) {
    //console.log("START - customerPrompt()");

    inq.prompt([
        {
            name: "choice",
            type: "input",
            message: "Input ID number of the desired item to purchase: ",
            validate: function (value) {
                if (isNaN(value) === false) {
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
                customerPromptQuantity(chosenItem);
            }
            else {
                errorNaN();
                customerPrompt(res);
            }
        });
}

function customerPromptQuantity(item) {
    //console.log("START - customerPromptQuantity()");

    inq.prompt([
        {
            name: "quantity",
            type: "input",
            message: "We have " + item.stock_quantity + " pcs. in stock. How many " + item.product_name + " you want to buy?: "
        }
    ]).then(function (answer) {
        if (!isNaN(answer.quantity)) {
            if (item.stock_quantity < answer.quantity) {
                insuf(item.stock_quantity);
                customerPromptQuantity(item);
            }
            else if (item.stock_quantity >= answer.quantity) {
                updateItem(item.item_id, item.price, item.stock_quantity, answer.quantity);
            }
        }
        else {
            errorNaN();
            customerPromptQuantity(item);
        }
    });
}

function updateItem(id, price, stock, quantity) {
    //console.log("START - updateItem()");

    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: stock - quantity
            },
            {
                item_id: id
            }
        ],
        function (err, res) {
            if (err) throw err;
            //console.log(res.affectedRows + " products updated!\n");
            textFormatter("\nPlease transfer " + price * quantity + " aud to our bank account to complete order.\n");
            vamanosCustomer();
        }
    );

}


function errorNaN() {
    textFormatter("Please only input numbers.");
}

function insuf(no) {
    textFormatter("Sorry, insufficient quantity!\n"
        + "We only have " + no + " pcs. left.");
}

function textFormatter(text) {
    console.log("\n======================================\n");
    console.log("= = = = = " + text + " = = = = =");
    console.log("\n======================================\n");
}

start();