var mysql = require("mysql");

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tiger123",
});

conn.connect(function (err) {
  if (err) {
    throw err;
  } else {
    console.log("Database Connection Successful...");
  }
});
