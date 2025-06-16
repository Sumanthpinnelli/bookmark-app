const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()
require('./keepAlive');
const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>console.log('MongoDB connected'))
.catch(err=>console.error('MongoDB connection error',err))

const userDataSchema = new mongoose.Schema({
  qlid: {type:String, required:true},
  data:{type:mongoose.Schema.Types.Mixed}
})

const UserData = mongoose.model('UserData',userDataSchema);

app.get('/data/:qlid',async (req,res)=>{
  const {qlid} = req.params
  let user = await UserData.findOne({qlid});

  if(!user)
  {
    const defaultData = require('./data/data.json');
    user = new UserData({qlid,data:defaultData});
    await user.save();
  }
  res.json(user.data);
});

app.post('/data/:qlid',async (req,res) =>{
  const {qlid} = req.params;
  const newData = req.body;
  const updated = await UserData.findOneAndUpdate(
    {qlid},
    {data: newData},
    {upsert: true, new:true}
  );
  res.json({message:"saved successfully"});
})

// const DATA_DIR = path.join(__dirname,"data");
// if(!fs.existsSync(DATA_DIR)) fs.writeFileSync(DATA_DIR,'[]')

// app.get('/data/:qlid', (req, res) => {

//   const userFile = path.join(DATA_DIR,`${req.params.qlid}.json`);
//   const defaultFile = path.join(DATA_DIR,"data.json");
//     if (fs.existsSync(userFile))
//     {
//         const data = fs.readFileSync(userFile);
//         console.log(data);
//         res.json(JSON.parse(data))
//     }
//     else{
        
//         fs.copyFileSync(defaultFile,userFile);
//         const data = fs.readFileSync(userFile);
//         console.log(data);
//         res.json(JSON.parse(data))
//     }
// });

// app.post('/data/:qlid', (req, res) => {
//   const userFile = path.join(DATA_DIR,`${req.params.qlid}.json`);
//   fs.writeFileSync(userFile, JSON.stringify(req.body, null, 2));
//   res.json({ message: 'Saved Successfully!' });
// });

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));