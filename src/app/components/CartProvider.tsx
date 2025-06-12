"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};
type CartObject = Record<string, CartItem>;

declare global {
  interface Window {
    cartInstance?: Cart;
  }
}

const STORAGE_KEY = "cart";

function loadCart(): CartObject {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as CartObject;
  } catch {
    return {};
  }
}

function saveCart(cart: CartObject): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

type NodeProps = Partial<{
	className: string;
	role: string;
	style: string;
	href: string;
	textContent: string;
	type: string;
	min: number;
	value: string | number;
	onclick: () => void;
	oninput: () => void;
	dataset: Record<string, string | number>;
}>;

function createNode<Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  props: NodeProps = {},
  ...children: (string | Node)[]
): HTMLElementTagNameMap[Tag] {
  const el = document.createElement(tag);
  // gestion dataset si fourni
  if (props.dataset && typeof props.dataset === "object") {
    for (const [k, v] of Object.entries(props.dataset)) {
      el.dataset[k] = String(v);
    }
    delete props.dataset;
  }
  Object.entries(props)
    .filter(([key]) => key !== "dataset")
    .forEach(([key, value]) => {
      // attributs simples (href, style en string, className, etc.)
      // on peut assigner directement sur l'élément si la propriété existe,
      // sinon on la passe en attribut HTML
      if (key in el) {
        // @ts-expect-error: dynamic property assignment (controlled)
        el[key] = value;
      } else {
        el.setAttribute(key, String(value));
      }
    });
  children.flat().forEach((c) =>
    el.append(typeof c === "string" ? document.createTextNode(c) : c)
  );
  return el as HTMLElementTagNameMap[Tag];
}

function showStockAlert(name: string, stock: number): void {
  const alert = createNode(
    "div",
    {
      className:
        "alert alert-warning fade position-absolute top-0 start-50 translate-middle-x mt-3 shadow",
      role: "alert",
      style: "z-index:1055;max-width:600px;pointer-events:none;",
    },
    document.createTextNode("Stock insuffisant pour cette plante ("),
    createNode("strong", { textContent: name }),
    document.createTextNode(`), actuellement, il en reste ${stock}.`)
  );
  document.body.append(alert);
  setTimeout(() => alert.classList.add("show"), 10);
  setTimeout(() => {
    alert.classList.remove("show");
    alert.classList.add("fade");
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

function updateNavbarCount(cart: CartObject): void {
  const link = document.getElementById("cart-link");
  if (link) {
    const n = Object.values(cart).reduce(
      (t, i) => t + i.quantity,
      0
    );
    link.textContent = `Mon Panier${n ? ` (${n})` : ""}`;
  }
}

class Cart {
  get(): CartObject {
    return loadCart();
  }
  save(c: CartObject): void {
    saveCart(c);
  }
  commit(c: CartObject): void {
    this.save(c);
    window.dispatchEvent(new Event("storage"));
  }

  add(id: number, name: string, price: number, stock: number): void {
    const c = this.get();
    c[id] ??= { id, name, price, quantity: 0, stock };
    if (c[id].quantity >= stock) {
      showStockAlert(name, stock);
      setTimeout(() => {
        c[id].quantity = stock;
        this.commit(c);
      }, 300);
    } else {
      c[id].quantity++;
      this.commit(c);
    }
  }

  update(id: number, value: string): void {
    const qty = parseInt(value, 10);
    if (Number.isNaN(qty)) return;
    const c = this.get();
    if (!c[id]) return;
    const input = document.querySelector(
      `input[data-cart-id='${id}']`
    ) as HTMLInputElement | null;
    if (!input) return;
    const stock = parseInt(input.dataset.stock || "1", 10);
    const corrected = Math.min(Math.max(qty, 1), stock);
    c[id].quantity = corrected;
    input.value = String(corrected);
    this.commit(c);
    this.render();
  }

  remove(id: number): void {
    const c = this.get();
    delete c[id];
    this.save(c);
    window.dispatchEvent(new Event("storage"));
    this.render();
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("storage"));
    this.render();
  }

  delayedUpdate(id: number, input: HTMLInputElement): void {
    (input as HTMLInputElement & { _t?: number })._t = window.setTimeout(
      () => this.update(id, input.value),
      300
    );
  }

  renderOrderReview(
    ctId = "order-review-container",
    inId = "order-items-input"
  ): void {
    const ct = document.getElementById(ctId);
    const inp = document.getElementById(inId) as HTMLInputElement | null;
    const cart = this.get();
    if (!ct || !inp) return;
    if (Object.keys(cart).length === 0) {
      ct.innerHTML = '<p class="alert alert-warning">Votre panier est vide.</p>';
      inp.value = "";
      return;
    }
    const tbody = createNode("tbody");
    const table = createNode(
      "table",
      { className: "table shadow" },
      createNode(
        "thead",
        { className: "table-light" },
        createNode(
          "tr",
          {},
          ...["Plante", "Quantité", "Total"].map((t) =>
            createNode("th", { textContent: t })
          )
        )
      ),
      tbody
    );
    const items: { plant_id: number; quantity: number }[] = [];
    let total = 0;
    for (const [pid, item] of Object.entries(cart)) {
      const sub = item.price * item.quantity;
      total += sub;
      tbody.append(
        createNode(
          "tr",
          {},
          createNode("td", {}, createNode("a", {
            href: `/plants/${pid}`,
            className: "cart-plant-link",
            textContent: item.name,
          })),
          createNode("td", { textContent: String(item.quantity) }),
          createNode("td", { textContent: `${sub} €` })
        )
      );
      items.push({ plant_id: +pid, quantity: item.quantity });
    }
    ct.innerHTML = "";
    ct.append(
      table,
      createNode("p", {
        className: "text-end fw-bold",
        textContent: `Total : ${total} €`,
      })
    );
    inp.value = JSON.stringify(items);
  }

  render(): void {
    const ct = document.getElementById("cart-container");
    if (!ct) return;
    const cart = this.get();
    ct.innerHTML = "";
    updateNavbarCount(cart);
    if (Object.keys(cart).length === 0) {
      ct.append(
        createNode("p", {
          className: "alert alert-info",
          textContent: "Votre panier est vide.",
        })
      );
      return;
    }

    const tbody = createNode("tbody");
    const table = createNode(
      "table",
      { className: "table" },
      createNode(
        "thead",
        { className: "table-light" },
        createNode(
          "tr",
          {},
          ...["Plante", "Quantité", "Action"].map((t) =>
            createNode("th", { textContent: t })
          )
        )
      ),
      tbody
    );
    let total = 0;
    for (const [pid, item] of Object.entries(cart)) {
      total += item.price * item.quantity;
      const input = createNode("input", {
        type: "number",
        min: 1,
        className: "form-control form-control-sm",
        style: "max-width:70px",
        value: String(item.quantity),
      }) as HTMLInputElement;
      input.dataset.cartId = pid;
      input.dataset.stock = String(item.stock);
      input.oninput = () => this.delayedUpdate(+pid, input);
      tbody.append(
        createNode(
          "tr",
          {},
          createNode("td", {}, createNode("a", {
            href: `/plants/${pid}`,
            className: "text-decoration-none",
            textContent: item.name,
          })),
          createNode("td", {}, input),
          createNode("td", {}, createNode("button", {
            className: "btn btn-danger btn-sm",
            textContent: "Retirer",
            onclick: () => this.remove(+pid),
          }))
        )
      );
    }
    ct.append(
      table,
      createNode("p", {
        className: "text-end fw-bold",
        textContent: `Total : ${total} €`,
      }),
      createNode(
        "div",
        { className: "d-flex justify-content-between" },
        createNode("button", {
          className: "btn btn-outline-secondary btn-sm",
          textContent: "Vider le panier",
          onclick: () => this.clear(),
        }),
        createNode("a", {
          href: "/orders/new",
          className: "btn btn-primary",
          textContent: "Passer la commande",
        })
      )
    );
  }
}

export default function CartProvider() {
  const pathname = usePathname();
  useEffect(() => {
    if (!window.cartInstance) {
      window.cartInstance = new Cart();
    }
    window.cartInstance.renderOrderReview();
    window.cartInstance.render();
  }, [pathname]);
  return null;
}
