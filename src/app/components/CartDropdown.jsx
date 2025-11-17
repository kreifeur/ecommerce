const CartDropdown = ({ cartItems, cartTotal, showCart, updateQuantity }) => {
  if (!showCart) return null;

  return (
    <div className="fixed right-2 top-[10vh] bg-white rounded-2xl shadow-xl z-50 w-80 p-4 stickey ">
      <h3 className="font-semibold text-lg mb-4">Your Cart</h3>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <>
          <div className="max-h-64 overflow-y-auto">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-md mr-3"></div>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-[#18ABC6] font-semibold">${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-semibold mb-4">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="w-full bg-[#18ABC6] text-white py-2 rounded-lg font-medium">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDropdown;