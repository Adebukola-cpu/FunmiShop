// const express = require('express');
// const app = express();
// app.set('view engine', 'ejs');
// const mongoose = require('mongoose');
// const cors = require('cors') //cross origin resource sharing
// app.use(cors())
// const dotenv = require("dotenv");
// dotenv.config()
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json())





// mongoose.connect(process.env.DATABASE_URI)
//     .then(() => {
//         console.log('database connected successfully')
//     }).catch((e) => {
//         console.log('error connecting to database')
//     })

// const UserSchema = mongoose.Schema({
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
// })

// const UserModel = mongoose.model('User', UserSchema)



// const ProductSchema = mongoose.Schema({
//     productName: { type: String, required: true },
//     productPrice: { type: String, required: true },
//     productQuantity: { type: String, required: true, },
//     productDescription: { type: String, required: true },
//     productImage: { type: String, required: true },
// })


// const ProductModel = mongoose.model('Product', ProductSchema)