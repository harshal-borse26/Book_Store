import User from "../model/user.model.js";
import Book from "../model/book.model.js";
import Order from "../model/order.model.js";

export const getDashboardStats =
  async (req, res) => {

  try {

    const totalUsers =
      await User.countDocuments();

    const totalBooks =
      await Book.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const orders =
      await Order.find();

    const totalRevenue =
      orders.reduce(
        (sum, order) =>
          sum + order.totalPrice,
        0
      );

    res.status(200).json({
      success:true,
      totalUsers,
      totalBooks,
      totalOrders,
      totalRevenue
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Server Error"
    });

  }

};