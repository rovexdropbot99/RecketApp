const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

/* Owner Telegram ID */
const OWNER_ID = "5365191875";

let multiplier = 1.00;
let running = true;


/* Owner check */
function isOwner(userId) {
    return String(userId) === OWNER_ID;
}


/* Rocket auto run */
function updateRocket() {

    if (!running) {
        return;
    }

    multiplier = multiplier * 1.002;

    if (multiplier >= 300) {

        multiplier = 1.00;

        console.log("CRASH - New round");
    }
}


setInterval(updateRocket, 100);


/* Server */
const server = http.createServer(function(req, res) {

    /* Rocket API */

    if (req.url === "/api/rocket") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            running: running,
            multiplier: multiplier
        }));

        return;
    }


    /* Owner-only Admin API */

    if (req.url === "/api/admin") {

        const userId =
            req.headers["x-telegram-user-id"];

        if (!isOwner(userId)) {

            res.writeHead(403, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                success: false,
                message: "Owner only"
            }));

            return;
        }


        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            success: true,
            admin: true
        }));

        return;
    }


    /* Website */

    if (
        req.url === "/" ||
        req.url === "/index.html"
    ) {

        const filePath =
            path.join(
                __dirname,
                "index.html"
            );

        fs.readFile(
            filePath,
            function(error, data) {

                if (error) {

                    res.writeHead(500);

                    res.end(
                        "index.html not found"
                    );

                    return;
                }

                res.writeHead(200, {
                    "Content-Type":
                        "text/html"
                });

                res.end(data);
            }
        );

        return;
    }


    res.writeHead(404);

    res.end("Not Found");

});


server.listen(
    PORT,
    function() {

        console.log(
            "🚀 Rocket server running at http://localhost:" +
            PORT
        );

        console.log(
            "👑 Owner ID: " +
            OWNER_ID
        );

    }
);