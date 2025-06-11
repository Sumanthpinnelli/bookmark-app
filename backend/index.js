const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;
const path = require('path');

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname,"data");
if(!fs.existsSync(DATA_DIR)) fs.writeFileSync(DATA_DIR,'[]')

app.get('/data/:qlid', (req, res) => {

  const userFile = path.join(DATA_DIR,`${req.params.qlid}.json`);
  const defaultFile = path.join(DATA_DIR,"data.json");
    if (fs.existsSync(userFile))
    {
        const data = fs.readFileSync(userFile);
        console.log(data);
        res.json(JSON.parse(data))
    }
    else{
        
        fs.copyFileSync(defaultFile,userFile);
        const data = fs.readFileSync(userFile);
        console.log(data);
        res.json(JSON.parse(data))
    }
});

app.post('/data/:qlid', (req, res) => {
  const userFile = path.join(DATA_DIR,`${req.params.qlid}.json`);
  fs.writeFileSync(userFile, JSON.stringify(req.body, null, 2));
  res.json({ message: 'Saved Successfully!' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));