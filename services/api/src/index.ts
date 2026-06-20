import http from "node:http";
import { sampleLesson } from "@blp/schema";
import { validateGridworld } from "@blp/engine";

const server = http.createServer((req, res) => {
  res.setHeader("content-type", "application/json");
  if (req.url === "/health") return res.end(JSON.stringify({ ok: true }));
  if (req.url === "/content") return res.end(JSON.stringify({ lesson: sampleLesson }));
  if (req.url === "/validate") return res.end(JSON.stringify(validateGridworld(sampleLesson.problem, [sampleLesson.problem.solution])));
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "not_found" }));
});

const port = Number(process.env.PORT || 4010);
server.listen(port, () => console.log(`API service listening on ${port}`));
