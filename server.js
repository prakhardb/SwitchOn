const express = require('express'); 
const jwt    = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt  = require('bcrypt');
const UserModel = require('./models/users');
const Parts = require('./models/parts');
mongoose.connect("mongodb://user:user123@dbh84.mlab.com:27847/switchon",{ useNewUrlParser: true });

app.use(cors({credentials: true, origin: true}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.post('/api/signup', (req, res) => {
  var salt = bcrypt.genSaltSync(10);
  const user = {
    username:  req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
  };
      UserModel.create(user, err => {
        if (err) {
          res.status(500).json({ errors: { global: err } });
          return;
        }

        res.json({});
      });
      });

 app.post('/api/auth',(req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  UserModel.findOne({ username }, (err, doc) => {
    if (err) {
      res.status(500).json({ errors: { global: err } });
      return;
    }

    if (doc) {
      if (bcrypt.compareSync(password, doc.password)) {
        const token = jwt.sign({ user: { _id: doc._id, username: doc.username, } }, "any secret");
        res.status(200).json({ token });
      } 
    } 
    else {
      console.log(err);
      res.status(500).json({ errors: { global: err } });
    }
  });
 });     

  var authenticate =  (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if (token) {
    jwt.verify(token,"any secret", (err, decoded) => {
      if (err) {
        console.log(decoded);
        res.status(401).json({ errors: { global: 'You must be authenticated to do that' } });
      } else {
        console.log(decoded);
        req.userId = new mongoose.Types.ObjectId(decoded.user._id);
        next();
      }
    });
  } else {
    res.status(403).json({
      errors: { global: 'You must be authenticated to do that' },
    });
  }
};

app.get('/api/parts',(req,res) => {
  Parts.find({}, (err,data) => {
    if(err)
    {
      res.json({error: err});
    }
    else{
      var d = []
      data.forEach(data => 
        d.push([data.TimeStamp,data.numberofpart])
        )
      res.json(d);
    }
  });
});

app.post('/api/parts',(req,res) => {
  Parts.create({numberofpart: req.body.numberofpart}, (err,success) => {
    if(err){
      console.log(err);
    }
    else {
      res.json(success);
    }
  });
});

app.get('/api',authenticate, function(req, res) {
 res.json({
     message : "Authentication Api"
 });
});



app.listen(3001, function(){ console.log('Node server listening on port 3001');});