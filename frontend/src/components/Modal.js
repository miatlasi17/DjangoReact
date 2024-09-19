import React from 'react';

import '../styles/Modal.css';

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null; // If show is false, don't render the modal
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
