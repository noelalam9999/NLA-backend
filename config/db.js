import mysql from "mysql";

// var conn = mysql.createPool({
//   connectionLimit: 10,
//   host: "localhost",
//   user: "root",
//   password: "tiger123",
//   database: "nla_database",
// });

// =========================================================================

// mySQL Google cloud platform
// cloud_sql_proxy -instances=nlaanalytics:us-central1:nla-db=tcp:3306

// var conn = mysql.createConnection({
//   // socketPath: "/cloudsql/nlaanalytics:us-central1:nla-db",
//   host: "34.134.1.251",
//   user: "root",
//   password: "tiger123",
//   database: "nla_database",
// });

// conn.query("SELECT 1 + 3 AS solution", function (error, results, fields) {
//   if (error) {
//     throw error;
//   } else {
//     console.log(
//       "Database CONNECTED with Google Cloud Platform: ",
//       results[0].solution
//     );
//   }
// });

// =========================================================================

let conn;

if (process.env.JAWSDB_COBALT_URL) {
  console.log("I am in JawsDB");
  conn = mysql.createConnection(process.env.JAWSDB_COBALT_URL);
} else {
  conn = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "tiger123",
    database: "nla_database",
  });

  conn.query("SELECT 1 + 3 AS solution", function (error, results, fields) {
    if (error) {
      throw error;
    } else {
      console.log("Database CONNECTED with solution: ", results[0].solution);
      // var query = "INSERT INTO user (username, password) VALUES ?";
      // var values = [
      //   ["hammad", "asdf123"],
      //   ["ali", "12345"],
      // ];
      // conn.query(query, [values], function (err, result) {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log("Total number of rows inserted =", result.affectedRows);
      //   }
      // });
    }
  });
}

// var conn = mysql.createPool({
//   connectionLimit: 10,
//   host: "ebh2y8tqym512wqs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
//   user: "v0c2ossw46w6oj38",
//   password: "wqg8kch7gptia1u2",
//   port: "3306",
//   database: "	e4fum3snt275n7lx",
// });

export default conn;
