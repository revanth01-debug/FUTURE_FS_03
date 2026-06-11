import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { useCart } from "../contexts/CartContext";
import { apiUrl } from "../utils/api";



const Payment = () => {
const [step, setStep] = useState("address");
const [upiId, setUpiId] = useState("");

const [address, setAddress] = useState({
  name: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
});  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate(); 
  const location = useLocation();
  const { makeEmpty } = useCart();
  const loggedIn = isAuthenticated();
  const items = location.state?.items || [];
  const totalAmount = location.state?.totalAmount || 0;
  useEffect(() => {
    if (!loggedIn) {
      navigate("/login", { replace: true });
    }
    if (loggedIn && items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [loggedIn, items.length, navigate]);

  if (!loggedIn) return null;

  const handlePlaceOrder = async (paymentMethod, nextStep) => {
    if (
  !address.name ||
  !address.phone ||
  !address.address ||
  !address.city ||
  !address.pincode
) {
  alert("Please enter delivery address first");
  setStep("address");
  return;
}
    setIsSubmitting(true);
    try {
      const response = await fetch(apiUrl("/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          totalAmount,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      makeEmpty();
      setStep(nextStep);
    } catch (error) {
      alert("Unable to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
 

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 max-w-md w-full text-center animate-fadeIn">
      
{step === "address" && (
  <>
    <h1 className="text-2xl font-semibold mb-4">
      Delivery Address
    </h1>

    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Full Name"
        className="border p-2 rounded"
        onChange={(e) =>
          setAddress({...address,name:e.target.value})
        }
      />

      <input
        type="text"
        placeholder="Phone Number"
        className="border p-2 rounded"
        onChange={(e) =>
          setAddress({...address,phone:e.target.value})
        }
      />

      <textarea
        placeholder="Address"
        className="border p-2 rounded"
        onChange={(e) =>
          setAddress({...address,address:e.target.value})
        }
      />

      <input
        type="text"
        placeholder="City"
        className="border p-2 rounded"
        onChange={(e) =>
          setAddress({...address,city:e.target.value})
        }
      />

      <input
        type="text"
        placeholder="Pincode"
        className="border p-2 rounded"
        onChange={(e) =>
          setAddress({...address,pincode:e.target.value})
        }
      />

    <button
onClick={() => {
  if (
    !address.name ||
    !address.phone ||
    !address.address ||
    !address.city ||
    !address.pincode
  ) {
    alert("Please fill all delivery details");
    return;
  }

  if (!/^\d{10}$/.test(address.phone)) {
    alert("Enter valid 10-digit phone number");
    return;
  }

  if (!/^\d{6}$/.test(address.pincode)) {
    alert("Enter valid 6-digit pincode");
    return;
  }

  setStep("options");
}}
  className="bg-green-500 text-white py-2 rounded"
>
  Proceed To Payment
</button>

    </div>
  </>
)}            
      {step === "options" && (
  <>
    <h1 className="text-2xl font-semibold text-gray-800 mb-4">
      Choose Payment Method
    </h1>

    <div className="flex flex-col gap-4">
      <button
        onClick={() => setStep("upi")}
        className="bg-green-500 px-6 py-2 rounded-lg text-white hover:bg-green-600"
      >
        Pay by UPI
      </button>

      <button
        onClick={() => handlePlaceOrder("Cash on Delivery", "cod")}
        className="bg-slate-800 px-6 py-2 rounded-lg text-white hover:bg-slate-700"
      >
        Cash on Delivery
      </button>
    </div>
  </>
)}

{step === "upi" && (
  <>
    <h1 className="text-2xl font-semibold mb-4">
      Enter UPI ID
    </h1>

    <input
      type="text"
      placeholder="example@paytm"
      value={upiId}
      onChange={(e) => setUpiId(e.target.value)}
      className="border p-2 rounded w-full mb-4"
    />

    <button
      onClick={() => {
        if (!upiId.trim()) {
          alert("Please enter UPI ID");
          return;
        }

        handlePlaceOrder("UPI", "success");
      }}
      className="bg-green-500 text-white px-6 py-2 rounded"
    >
      Pay ₹{totalAmount}
    </button>
  </>
)}
          {step === "success" && (
            <>
              <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce" />
              <h1 className="text-3xl font-semibold text-gray-800 mb-2">Payment Successful</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your payment! Your order has been confirmed and will be processed shortly.
              </p>
              <Link
                to="/"
                className="mt-4 inline-block bg-green-500 px-4 py-2 rounded-lg text-white text-sm sm:text-base hover:bg-green-600 transition"
              >
                Go to Home
              </Link>
            </>
          )}

      
          {step === "cod" && (
            <>
              <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce" />
              <h1 className="text-3xl font-semibold text-gray-800 mb-2">Order Placed</h1>
              <p className="text-gray-600 mb-6">
                Your order has been placed successfully. Please keep cash ready at the time of delivery.
              </p>
              <Link
                to="/"
                className="mt-4 inline-block bg-green-500 px-4 py-2 rounded-lg text-white text-sm sm:text-base hover:bg-green-600 transition"
              >
                Go to Home
              </Link>
            </>
          )}
        </div>
      </div>
    );
};

export default Payment;