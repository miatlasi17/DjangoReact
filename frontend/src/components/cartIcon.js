import React from 'react';

function CartIcon({ count }) {
  return (
    <div className="cart-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 18c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H7zm13 1.5l1.5 1.5L13 18H5v-2h8l-2.5-2.5L12 13l1.5 1.5z" />
      </svg>
      {count > 0 && <span className="cart-count">{count}</span>}
    </div>
  );
}

export default CartIcon;