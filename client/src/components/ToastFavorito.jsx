import React, { useEffect } from "react";

const ToastFavorito = ({ mensaje, onClose }) => {
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [mensaje, onClose]);

  if (!mensaje) return null;

  const isExito = mensaje.includes("✅");

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        right: "20px",
        backgroundColor: isExito ? "#F7B213" : "#d5d5d5",
        color: "white",
        padding: "12px 20px",
        borderRadius: "50px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 9999,
        animation: "slideIn 0.3s ease",
        fontSize: "14px",
      }}
    >
      <span>{mensaje}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "18px",
          cursor: "pointer",
          opacity: 0.8,
        }}
      >
        ×
      </button>
    </div>
  );
};

export default ToastFavorito;
