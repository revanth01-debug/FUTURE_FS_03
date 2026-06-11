import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";


function Cart() {
  const navigate = useNavigate();
  const { cartItems,addItem,removeItem } = useCart();
  const cartItemList = Object.values(cartItems);
  const isEmpty = cartItemList.length === 0;

  const totalPrice = cartItemList.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    return total + (price * item.count);
  }, 0);
  


  const handlePay = () => {
    if (!isAuthenticated()) {
        navigate("/login")
        return;
    }
      navigate("/payment", {
        state: {
          items: cartItemList,
          totalAmount: totalPrice,
        },
      });
  };




  return (
    <div>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[70vh] px-4">
          <img
            className="h-40 w-40 sm:h-80 sm:w-80"
            alt="empty cart"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZSZiic8VHntIKjEIdImHrRIkEB13RN-Qbkg&s"
          />
          <Link
            to="/"
            className="bg-green-500 px-4 sm:px-5 py-2 sm:py-3 rounded-lg text-white text-sm sm:text-base hover:bg-green-600 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-5xl p-3 sm:p-5 min-h-screen flex flex-col gap-3 sm:gap-4 pb-28 sm:pb-32">
          {cartItemList.map((item) => (
            <div
              key={item.id}
              className="shadow-sm border border-slate-200 rounded-2xl text-slate-700 bg-white"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 gap-3">
                <div className="flex items-center gap-2 sm:gap-4">
                    <img
                      className="h-14 w-14 sm:h-20 sm:w-20 object-cover"
                      alt={item.name}
                      src={item.image}
                    />
                    <div className="flex flex-col">
                      <span className="text-base sm:text-lg font-semibold">{item.name}</span>
                        <span className="text-sm text-slate-500">
                          Price:₹{parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.count}
                        </span>
                      </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-green-500 px-3 py-1 text-green-600">
                    <button onClick={() => removeItem(item)} className="text-xl font-semibold hover:cursor-pointer">-</button>
                    <h2 className="text-base font-semibold">{item.count}</h2>
                    <button onClick={() => addItem(item)} className="text-xl hover:cursor-pointer">+</button>
                  </div>
                  
              </div>
            </div>
          ))}

          {/* Pay Now button */}
          <button
            onClick={handlePay}
            className="text-white fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-base sm:text-xl font-semibold bg-green-500 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-xl hover:bg-green-600 w-[92vw] max-w-xl"
          >
            Click to Pay ₹{totalPrice}
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
