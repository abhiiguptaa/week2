const express = require("express");
const uuid = require("uuid");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
app.use(bodyParser.json());
// this to do will have the id and the correspoiding value
function searchById(Id, array) {
  for (let idx in array) {
    if (array[idx]._id === Id) {
      return idx;
    }
  }

  return -1;
}
app.get("/todos", (req, res) => {
  // read teh data  from the file and send to
  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("internal server error");
    }
    if (data) {
      const newData = JSON.parse(data);
      res.json(newData);
    } else {
      res.status(404).send("No data found ");
    }
  });
});
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (data) {
      const newData = JSON.parse(data);
      const dataId = searchById(id, newData);
      if (dataId !== -1) {
        res.json(newData[dataId]);
      } else {
        res.status(404).send("Data not found");
      }
    } else {
      res.status(404).send("No data found");
    }
  });
});
async function addData(req, res) {
  // first i will take the data from the body
  const obj = {
    _id: uuid.v4(),
    title: req.body.title,
    status: req.body.status,
    content: req.body.content,
  };
  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) console.error(err);
    let todos = [];
    if (data) {
      todos.push(...JSON.parse(data));
    }
    todos.push(obj);
    fs.writeFile("./data.json", JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("datat writtern succesfully ");
      }
    });
    // I will write theta
  });
  res.send("succes");
}

app.post("/todos", addData);
app.put("/todos/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) throw err;
    if (data) {
      const newData = JSON.parse(data);
      const prevDataIdx = searchById(id, newData);
      if (prevDataIdx != -1) {
        Object.assign(newData[prevDataIdx], body);
      }
      fs.writeFile("./data.json", JSON.stringify(newData, null, 2), (err) => {
        if (err) throw err;
        else {
          res.json(newData);
        }
      });
    }
  });
  res.send("sucess");
});
// add all the data excep
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  // delete teh specific record
  // delete the todo item and delete it by the id and find the
  // first read the file and then delete and then write the data to the file and
  fs.readFile("./data.json", "utf8", (err, data) => {
    if (data) {
      // if the data exist
      const newData = JSON.parse(data);
      // got the data in the form of the array
      // get the index id
      const dataId = searchById(id, newData);
      if (dataId != -1) {
        newData.splice(dataId, 1);
        // aftere deleteing the tdata
      }
      fs.writeFile("./data.json", JSON.stringify(newData, null, 2), (err) => {
        if (err) throw err;
        else {
          console.log("data delted sucess");
        }
      });
    }
  });
  res.send("sucess");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server running at http://localhost:${PORT}`);
  }
});
