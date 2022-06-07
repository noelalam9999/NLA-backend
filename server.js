import http from "http";
import app from "./app.js";

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// PORT
const port = process.env.PORT || 8080;
const server = http.createServer(app);
server.listen(port, () => console.log(`Server is running on ${port}..`));
