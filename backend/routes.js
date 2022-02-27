// const upload = require('./middleware/upload');
const express = require('express');
const router = express.Router();
// const { check, validationResult, matchedData } = require('express-validator');
// const csrf = require('csurf');
// const csrfProtection = csrf({ cookie: true });

// const formModel = require('./models/Form')
const Hadith = require('./models/Hadith')

router.get('/', (req, res) => {
  res.send('Welcome to Authentic Hadith');
});

// router.get('/contact', csrfProtection, (req, res) => {
//     res.render('contact', {
//         data: {},
//         errors: {},
//         csrfToken: req.csrfToken()
//     });
//   });


// router.post('/contact',  (req, res) => {
//   const name = req.body.name;
//   const message = req.body.message;
//   const email = req.body.email;
//   //    requesting form data to DB 
//   const formData = new formModel ({
//         name,
//         message,
//         email
//       });
//       formData.save()

//   const data = matchedData(req);
//   console.log('Sanitized:', data);

//     req.flash('success', "Thanks for the message! We'll be in touch :)");
//     // res.redirect('/');
//   });

  router.get('/hadith', (req, res, next) => {
    Hadith.find().then(result=>{
      res.status(200).json(
        result
      )
    }).catch(err => {
      console.log(err);
      res.status(err.status || 500).json({
        message: err.message,
        error:err
      })
    })
  })

  // router.get('/hadith/:iid', (req, res, next) => {
  //   // console.log(req.params.iid)
  //   Hadith.findOne({iid: req.params.iid}).then(result=>{
  //     res.status(200).json(
  //      result
  //       )
  //   }).catch(err => {
  //     console.log(err);
  //     res.status(err.status || 500).json({
  //       message: err.message,
  //       error:err
  //     })
  //   })
  // })


//  UPLOAD ROUTE
// router.post("/upload", upload.single("file"), (req,res) => {
//   if (req.file === undefined) return res.send("you must select")
//   const imgUrl = `http://localhost:3000/public/${req.file.filename}`;
//   return res.send(imgUrl)
// })

module.exports = router;