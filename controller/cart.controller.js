import User from "../model/user.model.js";
import Book from "../model/book.model.js";
import Order from "../model/order.model.js";

export const addToCart = async (req, res) => {
  try {

    const userId = req.user._id;
    const { bookId } = req.body;

    const user = await User.findById(userId);

    const existingBook = user.cart.find(
      item =>
      item.book.toString() === bookId
    );

    if (existingBook) {

      existingBook.quantity += 1;

    } else {

      user.cart.push({
        book: bookId,
        quantity: 1
      });

    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Book added to cart"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

export const getCart = async (req, res) => {
  try {

    const user = await User.findById(
      req.user._id
    ).populate(
      "cart.book"
    );

    res.status(200).json({
      success: true,
      cart: user.cart
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

export const removeFromCart = async (req, res) => {
  try {

    const { bookId } = req.params;

    const user = await User.findById(
      req.user._id
    );

    user.cart = user.cart.filter(
      item =>
      item.book.toString() !== bookId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Book removed"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};


export const checkoutCart = async (req, res) => {
  try {

    const user =
      await User.findById(
        req.user._id
      ).populate("cart.book");

    if (!user.cart.length) {

      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });

    }

    if (
      !user.address ||
      !user.address.fullName ||
      !user.address.phone ||
      !user.address.addressLine ||
      !user.address.city ||
      !user.address.state ||
      !user.address.pincode
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Please save your address first"
      });

    }

    let totalPrice = 0;

    const orderedBooks = [];

    for (const item of user.cart) {

      totalPrice +=
        item.book.price *
        item.quantity;

      orderedBooks.push({
        book: item.book._id,
        quantity: item.quantity,
      });

      if (
        item.book.stock <
        item.quantity
      ) {

        return res.status(400).json({
          success: false,
          message:
            `${item.book.title} is out of stock`
        });

      }

      item.book.stock -=
        item.quantity;

      await item.book.save();
    }

    const order =
      await Order.create({

        user: user._id,

        books: orderedBooks,

        totalPrice,

        address: {
          fullName:
            user.address.fullName,

          phone:
            user.address.phone,

          addressLine:
            user.address.addressLine,

          city:
            user.address.city,

          state:
            user.address.state,

          pincode:
            user.address.pincode,
        },

        status: "placed",
      });

    user.orders.push(
      order._id
    );

    user.cart = [];

    await user.save();

    res.status(201).json({
      success: true,
      message:
        "Order placed successfully",
      order,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

export const updateQuantity = async (req, res) => {

  try {

    const { bookId, action } =
      req.body;

    const user =
      await User.findById(
        req.user._id
      );

    const item =
      user.cart.find(
        item =>
          item.book.toString() ===
          bookId
      );

    if (!item) {

      return res.status(404).json({
        success:false,
        message:"Book not found in cart"
      });

    }

    if (action === "increase") {

      item.quantity += 1;

    }

    if (
      action === "decrease" &&
      item.quantity > 1
    ) {

      item.quantity -= 1;

    }

    await user.save();

    res.status(200).json({
      success:true,
      message:"Quantity updated"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Server Error"
    });

  }

};