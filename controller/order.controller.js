import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import Book from "../model/book.model.js";



export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({
      user: userId,
    })
      .populate("books.book", "title author price imageUrl")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get order history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {

    const { id } = req.params;

    const order =
      await Order.findById(id)
      .populate("books.book");

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found"
      });

    }

    if (
      order.user.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });

    }

    if (
      order.status !== "placed"
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Order cannot be cancelled"
      });

    }

    for (const item of order.books) {

      item.book.stock +=
        item.quantity;

      await item.book.save();

    }

    order.status =
      "cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};