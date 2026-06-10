import User from "../model/user.model.js";

export const getProfile = async (req, res) => {
  try {

    const user = await User.findById(
      req.user._id
    )
    .select("-password")
    .populate("wishlist")
    .populate("orders");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};


export const updateAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        address: {
          fullName,
          phone,
          addressLine,
          city,
          state,
          pincode,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Address saved",
      address: user.address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};