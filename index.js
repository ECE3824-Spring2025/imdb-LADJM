// MIS3502 - Web Service Template
// Created by: Jeremy Shafer
// Fall 2024
// REMINDER - Don't forget to change your database connection
// timeout from 3 seconds to 3 minutes.
// Look under Configuration / General Configuration

// declarations (not all are needed) *****************************************
import qs from 'qs'; //for parsing URL encoded data
import axios from 'axios'; // for calling another API
import mysql from 'mysql2/promise'; //for talking to a database
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const dboptions = {
    'user': 'admin',
    'password': 'Boles123',
    'database': 'ladjm',
    'host': 'ladjm.cfi0omccgora.us-east-1.rds.amazonaws.com'
};

//await axios.get('https://xyz123.execute-api.us-east-1.amazonaws.com/dev/movies')
//global connection variable
let connection;

const features = [
    "Issue a GET against datetime.  The response will be the current date and time in Philadelphia in JSON.",
    "Issue a GET against myname.  The response will be my name in JSON.",
    "Issue a POST against sug and provide the key suggestion. The response will be the id of the new suggestion",
    "Created by Ladjm",
    "Last modified by The Ladjm Group",
];

// supporting functions ******* STUDENT MAY EDIT ***********
let getMovies = async (res, query) => {
    const genre = query.genre || '';
    const sortBy = query.sort || 'rating';
    
    let txtSQL = `
        SELECT m.primaryTitle, m.genres, m.startYear, 
               r.averageRating, r.numVotes 
        FROM movies m
        JOIN ratings r ON m.tconst = r.tconst
        ${genre ? `WHERE m.genres LIKE '%${genre}%'` : ''}
        ORDER BY ${sortBy === 'votes' ? 'r.numVotes' : 'r.averageRating'} DESC
        LIMIT 30`;  // ← Always return only top 30
    
    let [result] = await connection.execute(txtSQL);
    return formatres(res, result, 200);
};

let getRatings = async (res) => {
    let txtSQL = `SELECT * FROM ratings limit 1`;
    let [result] = await connection.execute(txtSQL);
    return formatres(res, result, 200);
};

let getSmallItemReport = async (res) => {
    let txtSQL = `
        SELECT m.primaryTitle, m.genres, m.startYear, 
               r.averageRating, r.numVotes 
        FROM movies m
        JOIN ratings r ON m.tconst = r.tconst
        LIMIT 30`;
    let [result] = await connection.execute(txtSQL);
    return formatres(res, result, 200);
};

let reset = async (res, query) => {
    let txtSQL = `UPDATE smallitems SET quantity = 100`;
    let [result] = await connection.execute(txtSQL);
    let txtSQL2 = `DELETE FROM smallitemhistory`;
    let [result2] = await connection.execute(txtSQL2);
    return formatres(res, "The quantity of each small item has been set to 100, and all the smallitem history has been deleted.", 200);
};

let scancheck = async (res, body) => {
    // step 1) Get the data you need.
    let clientid = body.clientid;
    let userid = body.userid;
    let quantity = body.quantity;
    let itemcode = body.itemcode;

    //step 2) Validate the data (error trap).
    if (clientid == undefined) {
        return formatres(res, "The key clientid is required", 400);
    }
    if (userid == undefined) {
        return formatres(res, "The key userid is required", 400);
    }
    if (quantity == undefined) {
        return formatres(res, "The key quantity is required", 400);
    }
    if (itemcode == undefined) {
        return formatres(res, "The key itemcode is required", 400);
    }
    if (quantity <= 0) {
        return formatres(res, "The key quantity must be greater than 0", 400);
    }
    if (clientid == "") {
        return formatres(res, "The key clientid cannot be empty", 400);
    }
    if (userid == "") {
        return formatres(res, "The key userid cannot be empty", 400);
    }
    if (itemcode == "") {
        return formatres(res, "The key itemcode cannot be empty", 400);
    }
    if (isNaN(clientid)) {
        return formatres(res, "The key clientid must be a number", 400);
    }
    if (isNaN(userid)) {
        return formatres(res, "The key userid must be a number", 400);
    }
    if (isNaN(quantity)) {
        return formatres(res, "The key quantity must be a number", 400);
    }

    // step 3) Work and return the result.
    let txtSQL = `SELECT * FROM smallitems WHERE itemcode = ?`;
    let [result] = await connection.execute(txtSQL, [itemcode]);
    if (result.length == 0) {
        return formatres(res, "The item code was not found in inventory.", 400);
    }

    let aggestimatedvalue = quantity * result[0]["estimatedvalue"];
    let smallitemid = result[0]["smallitemid"];
    let txtSQL2 = `INSERT INTO smallitemhistory (smallitemid, clientid, estimatedvalue, quantity, userid)
                   VALUES (?, ?, ?, ?, ?)`;
    let [result2] = await connection.execute(txtSQL2, [smallitemid, clientid, aggestimatedvalue, quantity, userid]);

    let txtSQL3 = `UPDATE smallitems SET quantity = quantity - ? WHERE itemcode = ?`;
    let [result3] = await connection.execute(txtSQL3, [quantity, itemcode]);

    let txtSQL4 = `SELECT * FROM smallitems WHERE itemcode = ?`;
    let [result4] = await connection.execute(txtSQL4, [itemcode]);
    return formatres(res, result4, 200);
};

let getSmallItems = async (res, query) => {
    let [result] = await connection.execute("SELECT name FROM js85saturn.smallitems ORDER BY name;");
    return formatres(res, result, 200);
};

let auth = async (res, body) => {
    let username = body.username;
    let password = body.password;

    if (username == undefined) {
        return formatres(res, "The key username is required", 400);
    }
    if (password == undefined) {
        return formatres(res, "The key password is required", 400);
    }
    if (password == "") {
        return formatres(res, "The key password cannot be empty", 400);
    }
    if (username == "") {
        return formatres(res, "The key username cannot be empty", 400);
    }

    let txtSQL = `SELECT firstname, lastname, userid, admin FROM users WHERE username = ? AND password = ?`;
    let [result] = await connection.execute(txtSQL, [username, password]);
    return formatres(res, result, 200);
};

let getClients = async (res, query) => {
    let [result] = await connection.execute("SELECT * FROM js85saturn.clients where active ='Y';");
    return formatres(res, result, 200);
};

let theDatetimeFunction = async (res, query) => {
    let [result] = await connection.execute("select DATE_FORMAT(NOW(), '%m-%d-%Y %h:%i%p') AS the_date_and_time");
    return formatres(res, result[0]['the_date_and_time'], 200);
};

let myName = (res, query) => {
    return formatres(res, "NoName McHiggens", 200);
};

// do not delete this handy little supporting function
let formatres = async (res, output, statusCode) => {
    // kill the global database connection
    if (connection != undefined && typeof(connection) == 'object' && typeof(connection.end()) == 'object') {
        await connection.end();
    }
    res.statusCode = statusCode;
    res.body = JSON.stringify(output);
    return res;
};

// do not delete this handy little supportng function
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// My Routing Function ****** STUDENT MAY EDIT **********
let myRoutingFunction = (res, method, path, query, body) => {
    if (method == "GET" && path == "movies") {
        return getMovies(res, query);
    }
    if (method == "GET" && path == "ratings") {
        return getRatings(res, query);
    }
    if (method == "GET" && path == "") {
        return formatres(res, features, 200);
    }
    if (method == "GET" && path == "datetime") {
        return theDatetimeFunction(res, query);
    }
    if (method == "GET" && path == "myname") {
        return myName(res, query);
    }
    if (method == "GET" && path == "clients") {
        return getClients(res, query);
    }
    if (method == "POST" && path == "auth") {
        return auth(res, body);
    }
    if (method == "GET" && path == "smallitems") {
        return getSmallItems(res, query);
    }
    if (method == "POST" && path == "scancheck") {
        return scancheck(res, body);
    }
    if (method == "PATCH" && path == "reset") {
        return reset(res, query);
    }
    if (method == "GET" && path == "smallitemreport") {
        return getSmallItemReport(res, query);
    }
    return res;
};

// event handler **** DO NOT EDIT ***********
export const handler = async (event) => {
    try {
        connection = await mysql.createConnection(dboptions);
        
        // identify the method (it will be a string)
        let method = event["httpMethod"];
        
        // identify the path (it will also be a string)
        let fullpath = event["path"];
        if (fullpath == undefined || fullpath == null) { 
            fullpath = ""; 
        }
        let pathitems = fullpath.split("/");
        let path = pathitems[2];
        if (path == undefined || path == null) { 
            path = ""; 
        }
        
        // identify the querystring
        let query = event["queryStringParameters"];
        if (query == undefined || query == null) { 
            query = {}; 
        }
        
        // identify the body
        let body = qs.parse(event["body"]);
        if (body == undefined || body == null) { 
            body = {}; 
        }
        
        // Create the default response object
        let res = {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            'body': JSON.stringify("Feature not found.")
        };
        
        // run all the parameters through my routing function
        return await myRoutingFunction(res, method, path, query, body);
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 