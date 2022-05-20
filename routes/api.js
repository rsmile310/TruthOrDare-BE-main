import express from "express";
import room from "../controllers/room.js";
var router = express.Router();

router.post("/api/createRoom", (req, res) => {
  Promise.all([room.insert()]).then((result) => {
    req.session.save((err) => {
      if (!err) res.send(result);
    });
  });
});

router.get("/api/getRoom/:roomId", (req, res) => {
  console.log("trying to get room" + req.params.roomId);
  Promise.all([room.getById(req.params.roomId)])
    .then((result) => {
      req.session.save((err) => {
        if (!err) res.send(result[0].id);
      });
      //alternatively: res.send(result);
    })
    .catch((err) => {
      res.send(null);
    });
});
async function dd(req, res) {
  const payload = "test is success!";
  res.send(payload);
}

router.post("/test-section", dd);

export default router;
