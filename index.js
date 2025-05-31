const express = require("express");
const axios = require('axios');
const { MemcacheClient } = require("memcache-client");

const app = express();

const cacheClient = new MemcacheClient({
  server: "inovact-user-profiles.jexcqs.0001.aps1.cache.amazonaws.com:11211",
});

app.use(express.json());

app.get("/status", (_, res) => {
  res.end("OK")
})

app.post("/elasticache/write", async (req, res) => {
  const { key, value } = req.body;
  
  const result = await cacheClient.set(key, value);

  console.log(result);

  res.json(result);
  res.end();
})

app.get("/elasticache/read", async (req, res) => {
  const { key } = req.query;

  const result = await cacheClient.get(key);

  console.log(result);

  res.json(result);
  res.end();
})

// {
//   "method": "",
//   "host": "",
//   "port": 80,
//   "path": "",
//   "headers": {},
//   "querystring": "",
//   "body": {}
// }
app.post("/", async (req, res) => {
  const { method, host, port, path, headers, querystring, body } = req.body;

  const result = await axios[method](`http://${host}:${port}${path}?${querystring}`, body, {
    headers: {
      'Access-Control-Allow-Origin': '8',
      ...headers
    }
  }).then((response) => {
    return {
      status: response.status,
      code: response.code,
      message: response.message,
      data: response.data
    }
  }).catch(err => {
    return {
      status: err.status,
      code: err.code,
      message: err.message,
      data: err.data
    }
  })

  console.log(result);

  res.json(result);
  res.end();
})

app.listen(5000, () => {
  console.log("Server is listening on port 5000.")
})
