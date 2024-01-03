const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/home", async ({ res }) => {
  let {
    data: { playlists },
  } = await (await fetch(`https://saavn.me/modules?language=hindi`)).json();
  res.json(playlists);
});

app.get("/search", async (req, res) => {
  let { q } = req.query;
  if (!q) return res.status(404).json({ message: "please enter a query" });
  let {
    data: { results },
  } = await (await fetch(`https://saavn.me/search/songs?query=${q}`)).json();
  res.json(results);
});

app.get("/playlist", async (req, res) => {
  let { id } = req.query;
  if (!id) return res.status(404).json({ message: "please enter a id" });
  let { data } = await (
    await fetch(`https://saavn.me/playlists?id=${id}`)
  ).json();
  res.json(data);
});

app.get("/song/:id", async (req, res) => {
  let { id } = req.params;
  if (!id) return res.status(404).json({ message: "please enter a id" });
  let {
    data: [song],
  } = await (await fetch(`https://saavn.me/songs?id=${id}`)).json();
  res.json(song);
});

app.listen(3000 || process.env.PORT);
