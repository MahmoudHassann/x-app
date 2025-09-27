import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let cartData = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    const handlePaymentResponse = () => {
      const success = searchParams.get("success");
      const txnResponseCode = searchParams.get("txn_response_code");
      const dataMessage = searchParams.get("data.message");
      const errorOccurred = searchParams.get("error_occured");
      const orderId = searchParams.get("order");

      if (
        success === "true" &&
        (txnResponseCode === "APPROVED" || txnResponseCode === "00") &&
        dataMessage === "Approved" &&
        errorOccurred === "false"
      ) {
        try {
          const orderDetails = {
            orderId: orderId,
            amount: searchParams.get("amount_cents"),
            currency: searchParams.get("currency"),
            paymentId: searchParams.get("id"),
            createdAt: searchParams.get("created_at"),
            products: cartData,
            paymentMethod: {
              type: searchParams.get("source_data.type"),
              subType: searchParams.get("source_data.sub_type"),
            },
          };

          localStorage.setItem(
            "lastSuccessfulOrder",
            JSON.stringify(orderDetails)
          );

          localStorage.removeItem("cartData");

          dispatch({
            type: "cartSlice/clearCart",
          });

          navigate("/payment-success", {
            state: { orderDetails },
          });
        } catch (error) {
          console.error("Error handling successful payment:", error);
          navigate("/payment-failed");
        }
      } else {
        navigate("/payment-failed", {
          state: {
            error: dataMessage || "Payment processing failed",
          },
        });
      }
    };

    handlePaymentResponse();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">
          Processing your payment...
        </h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Please do not close this window.</p>
      </div>
    </div>
  );
};

export default PaymentCallback;
