"use client";
import CartProvider from "../components/CartProvider";

export default function CartPage() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">🛒 Mon Panier</h1>
      <CartProvider />
      <div id="cart-container" />
    </div>
  );
}
