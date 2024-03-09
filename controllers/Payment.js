import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import stripePackage from "stripe";

const stripekey =
  process.env.STRIPE_KEY ||
  "sk_test_51NjzylSBfASWOXKxfmqSTr5xh2naPZgBns6i5H9qcDwqptiOEFOLTH5QfRIzaBRptaHZVKBTkSguqmGtBRFbsRUj00tNUUlDRR";
console.log("this is my stripe key ", stripekey);
const stripe = stripePackage(stripekey);
console.log("stripe", stripe);

export const checkout = async (req, res, next) => {
  try {
    const { orderid } = req.body;
    const order = await Order.findById(orderid).populate({
      path: "orderItems.product",
      select: "name", 
    });
    //   console.log("bhai ye product k name ne ", order.orderItems.name)
    if (!order) {
      throw new ErrorHandler("Order not found", 404);
      }
      
      const lineItems = order.orderItems.map((item) => {
        const productName = item.name ? item.name : "Unknown Product";
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: productName,
            },
            unit_amount: order.totalPrice * 100,
          },
          quantity: item.quantity,
        };
      });
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        customer_email: req.user.email,
        client_reference_id: orderid,
        mode: "payment",
        success_url: `http://localhost:3000/success`,
        cancel_url: `http://localhost:3000/fail`,
      });

    res.redirect(303, session.url);
    console.log(session.url);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
