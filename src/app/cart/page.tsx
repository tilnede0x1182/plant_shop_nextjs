// src/app/cart/page.tsx
"use client";

import { useEffect } from "react";

export default function CartPage() {
  useEffect(() => {
    // charge le JS vanilla APRÈS l’hydratation React, donc plus de clash
    const s = document.createElement("script");
    s.src = "/javascripts/application.js";
    s.async = true;
    document.body.appendChild(s);
    return () => {
      document.body.removeChild(s);
    };
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">🛒 Mon Panier</h1>
      <div id="cart-container" />
    </div>
  );
}
