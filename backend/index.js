const path = require('path');
const express = require("express");
const AdminBro = require('admin-bro');
const cors = require('cors');
const morgan = require('morgan');
const AdminBroMongoose = require('@admin-bro/mongoose');
const AdminBroExpress = require('@admin-bro/express');
const routes = require('./routes');

const bodyParser = require("body-parser");
const app = express();
app.use('/', routes);

// DATABASE
const connection = require('./config/db.config');
connection.once('open', ()=> {
  console.log('Database connected Successfully')
});
connection.on('error',()=>console.log('Error'));


// MODELS
const Hadith = require('./models/Hadith')
const User = require('./models/User')
const Emp = require('./models/Emp')

const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
const canEditEmp = ({ currentAdmin, record }) => {
  return currentAdmin && (
    currentAdmin.role === 'admin'
  )
}
const canEdithadith = ({currentAdmin, record}) => {
  return currentAdmin && (
    currentAdmin.role === 'admin'
  )
}

// ADMINBRO OPTIONS
AdminBro.registerAdapter(AdminBroMongoose)
const AdminBroOptions = {
  resources: 
  [ {
    resource: Emp,
    options: {
      properties: {
        ownerId: { isVisible: { edit: false, show: true, list: true, filter: true } }
      },
      actions: {
        edit: { isAccessible: canEditEmp },
        delete: { isAccessible: canEditEmp },
        new: { isAccessible: canEditEmp },
      },
   }},
   {
     resource: Hadith,
     options: {
      properties: {
        ownerId: { isVisible: { edit: false, show: true, list: true, filter: true } }
      },
     actions: {
      edit: { isAccessible: canEdithadith },
      delete: { isAccessible: canEdithadith },
      new: { isAccessible: canEdithadith },
    }
  },
   },
   {
    resource: User,  
    options: {
      properties: {
        encryptedPassword: { isVisible: false },
        password: {
          type: 'string',
          isVisible: {
            list: false, edit: true, filter: false, show: false,
          },
        },
      },
      actions: {
        new: {
          before: async (request) => {
            if(request.payload.record.password) {
              request.payload.record = {
                ...request.payload.record,
                encryptedPassword: await           bcrypt.hash(request.payload.record.password, 10),
                password: undefined,
              }
            }
            return request
          },
        },
        edit: { isAccessible: canModifyUsers },
        delete: { isAccessible: canModifyUsers },
        new: { isAccessible: canModifyUsers },
      }
    }
  }],
}

const adminBro = new AdminBro(AdminBroOptions)
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
      if (user) {
        if (password === user.encryptedPassword) {
          return user
        }
      }
    return false
  },
  cookiePassword: 'session Key',
})

app.use(adminBro.options.rootPath, router)

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 5000;     
// app.listen(process.env.PORT || 5000, () => {
//     console.log("Server is running on port 5000.");
// });
app.listen(PORT, () => {
    console.log("Server is running on port 5000.");
})