const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const jwt = require("jsonwebtoken");
const app = express();
const RegData = require('./registerschema')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const port = 3001;
const mongURI = 'mongodb+srv://suneelkumar29590:UfuEaPytFV46FbTr@cluster0.37lou9p.mongodb.net/?retryWrites=true&w=majority';


app.use(express.json())
app.use(cors({ origin: "*" }))


mongoose.connect(mongURI)
   .then(() => console.log("Database Connected"))
   .catch((e) => console.log(e.message))

// app.post("/Register", async (req, res) => {
//    try {
//       const { gender, FirstName, SurName, email, password } = req.body
//       const isUseExist = await RegData.findOne({ email: email })
//       if (isUseExist) {
//          return res.send("user already registered")
//       } else {
//          let hashedpassword = await bcrypt.hash(password, 10)
//          let newuser = new RegData({
//             gender,
//             FirstName,
//             SurName,
//             email,
//             password: hashedpassword,
//          })
//          let payload = {
//             User: email
//          }
//          const token = jwt.sign(payload, 'jwtpassword', { expiresIn: '1h' });
//          res.json({ token });
//          newuser.save();

//       }
//    } catch (e) {
//       console.log(e.message)
//       return res.send("internal server error")
//    }
// })

const transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 587,
   secure: false,
   auth: {
      user: 'broccoly09@gmail.com', // Replace with your email
      pass: 'itxf xnlp jrhp veoq', // Replace with your App Password
   },
});

app.post("/Register", async (req, res) => {
   try {
      const { gender, FirstName, SurName, email, password } = req.body
      const isUserExist = await RegData.findOne({ email: email })
      if (isUserExist) {
         return res.send("user already registered")
      } else {
         let hashedpassword = await bcrypt.hash(password, 10)
         let newuser = new RegData({
            gender,
            FirstName,
            SurName,
            email,
            password: hashedpassword,
         })
         let payload = {
            User: email
         }
         const token = jwt.sign(payload, 'jwtpassword', { expiresIn: '1h' });

         // Send thank-you email
         const mailOptions = {
            from: 'broccoly09@gmail.com', // Replace with your email
            to: email,
            subject: 'Thank You for Registering',
            text: `Dear ${FirstName},\n\nOn behalf of the entire Diet Chef team, I want to extend our warmest gratitude for choosing us as your partner on this journey to a healthier lifestyle. Your registration is now complete, marking the beginning of an exciting chapter filled with wellness, nutrition, and positive transformations.\n\nThank you for entrusting Diet Chef with your health and well-being. We are committed to providing you with the support, guidance, and deliciously nutritious meals to help you achieve your health goals. Whether you're here for weight management, fitness, or simply embracing a balanced lifestyle, we are dedicated to being your companion every step of the way.\n\nAs a valued member of the Diet Chef community, you gain access to a world of personalized meal plans, expert advice, and a supportive network of individuals sharing similar wellness aspirations. We believe in the power of nourishing your body, mind, and soul, and we are excited to be part of your transformative journey.\n\nOnce again, thank you for choosing Diet Chef. We look forward to being an integral part of your health and well-being.\n\nHere's to a healthier, happier you!\n\nWarm regards,\nDiet Chef Team`,
         };

         // Wrap email sending in a function
         const sendEmail = () => {
            return new Promise((resolve, reject) => {
               transporter.sendMail(mailOptions, function(error, info) {
                  if (error) {
                     reject(error);
                  } else {
                     resolve(info);
                  }
               });
            });
         };

         const adminMailOptions = {
            from: 'broccoly09@gmail.com',
            to: 'broccoly09@gmail.com', // Replace with the admin email
            subject: 'New User Registration',
            text: `A new user has registered!\n\nName: ${FirstName} ${SurName}\nEmail: ${email}\nGender: ${gender}`,
         };

         const sendAdminNotification = () => {
            return new Promise((resolve, reject) => {
               transporter.sendMail(adminMailOptions, function (error, info) {
                  if (error) {
                     reject(error);
                  } else {
                     resolve(info);
                  }
               });
            });
         };

         console.log('Before sending email and admin notification');
         try {
            await Promise.all([sendEmail(), sendAdminNotification()]);
            console.log('Email and admin notification sent successfully');
         } catch (error) {
            console.log('Email and admin notification sending error:', error);
         }
         console.log('After sending email and admin notification');

         res.json({ token });
         newuser.save();
      }

      //    console.log('Before sending email');
      //    try {
      //       await sendEmail();
      //       console.log('Email sent successfully');
      //    } catch (error) {
      //       console.log('Email sending error:', error);
      //    }
      //    console.log('After sending email');

      //    res.json({ token });
      //    newuser.save();
      // }
   } catch (e) {
      console.log(e.message)
      return res.send("internal server error")
   }
});

app.post("/Login", async (req, res) => {
   try {
      const { email, password } = req.body
      const isUserExist = await RegData.findOne({ email })
      if (isUserExist) {
         const ispasswordmatched = await bcrypt.compare(password, isUserExist.password)// compare two passwords
         if (ispasswordmatched) {
            let payload = {
               user: email
            }
            const token = jwt.sign(payload, 'jwtpassword', { expiresIn: '1h' });
            res.json({ token });

         }
         else {
            return res.send("password incorrect")
         }
      }
      else {
         return res.send("User not found");
      }
   } catch (e) {
      console.log(e.message)
      return res.send("internal server error")
   }
})

app.post("/dietplan", async (req, res) => {
   try {
     const {
      type_of_person,
      type_of_plan,
      amount,
     } = req.body;
     let newUser = new RegData({
      type_of_person: type_of_person,
       type_of_plan: type_of_plan,
       amount: amount,
 
     });
 
   //   const isUserExist = await RegData.findOne({ type_of_plan: type_of_plan });
   //   if (isUserExist) {
   //     return res.send("user already registered");
   //   }
 
     newUser.save(); //saving to mongodb collections
     res.send("user created succesfully");
 
 
 
 
 
   }
   catch (e) {
     console.log(e.message);
     res.send("internal server error");
   }
 });

 app.post("/orderplan", async (req, res) => {
   try {
     const {
      type_of_food,
      selected_item,
      no_of_selected_items,
     } = req.body;
     let newUser = new RegData({
      type_of_food: type_of_food,
      selected_item: selected_item,
       no_of_selected_items: no_of_selected_items,
 
     });
 
   //   const isUserExist = await RegData.findOne({ type_of_plan: type_of_plan });
   //   if (isUserExist) {
   //     return res.send("user already registered");
   //   }
 
     newUser.save(); //saving to mongodb collections
     res.send("user created succesfully");
 
 
 
 
 
   }
   catch (e) {
     console.log(e.message);
     res.send("internal server error");
   }
 });
 
 
app.listen(port, () => {
   console.log(`Server Running at ${port}`)
})