import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref:'User'
    },
    book : [{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref:"Book"
    }],
    totalPrice : {
        type : Number,
        required : true,
    },
    status : {
        type : String,
        enum : ["placed" , "shipped","delivered","cancelled"],
        default:"placed"
    }
})

const Order = new mongoose.model('Order', orderSchema);
export default Order;