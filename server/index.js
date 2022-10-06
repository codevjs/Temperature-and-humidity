const mosca   = require("mosca");
const express = require("express");

const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

const broker  = new mosca.Server({
    port : 1883,
    http: {
        port: 1884,
        bundle: true,
        static: './'
    },
});

const app = express();

app.use(express.static(__dirname + '/build'));

const remote = async (entity) => {
    try {

        const purl = "https://smarthome.orderindonesia.com/api/services/scene/turn_on"

        const headers = new Headers();

        headers.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI5MjIyZDY5NWM3ODA0MDhmOTE2NDk0MjZjMWQ3YWNjZSIsImlhdCI6MTY2MjY0NTU0MiwiZXhwIjoxOTc4MDA1NTQyfQ.9EZJoB4jP_a8rmE2efhZtUYkTPQiKFlHvP3DGRHhcJ4");
        headers.append("Content-Type", "application/json");

        const raw = JSON.stringify({"entity_id" : entity});

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
        };

        const response = await fetch(purl, requestOptions)

        const result = await response.json();

        console.log(result);

        if (result.length < 1) {

            throw Error("Coba lagi")
        }
    }catch (e) {

        console.log(e.message);
    }
}

broker.on("ready", () => {

    console.log("Broker Ready");
});

broker.on("published", async (packet) => {

    const temp = Number(packet.payload.toString());

    console.log(temp)

    if (temp < 20 || temp > 30) {

        await remote(`scene.ac_21`);
    }
});

app.get("/", (req, res) => {

    res.render('index.html');
});

app.listen(8080, () => {

    console.log("Server run")
})