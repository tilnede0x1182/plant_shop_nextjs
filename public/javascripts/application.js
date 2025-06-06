// Importations

// Fonctions utilitaires
/**
	Renvoie un objet vide si une erreur JSON est détectée, sinon le panier.
	@return {Object}
*/
function recupererPanierDepuisStockage() {
	try {
		return JSON.parse(localStorage.getItem("cart") || "{}");
	} catch (exceptionJSON) {
		console.error("Erreur JSON", exceptionJSON);
		return {};
	}
}

/**
	Enregistre le panier dans le localStorage
	@panier {Object}
*/
function sauvegarderPanierDansStockage(panier) {
	localStorage.setItem("cart", JSON.stringify(panier));
}

/**
	Affiche un message d'alerte de stock insuffisant
	@nomPlante {string}
	@stock {number}
*/
function afficherAlerteStock(nomPlante, stock) {
	const divAlerte = document.createElement("div");
	divAlerte.className =
		"alert alert-warning fade position-absolute top-0 start-50 translate-middle-x mt-3 shadow";
	divAlerte.role = "alert";
	divAlerte.style.zIndex = "1055";
	divAlerte.style.maxWidth = "600px";
	divAlerte.style.pointerEvents = "none";
	divAlerte.appendChild(
		document.createTextNode("Stock insuffisant pour pour cette plante (")
	);
	const baliseStrong = document.createElement("strong");
	baliseStrong.textContent = nomPlante;
	divAlerte.appendChild(baliseStrong);
	divAlerte.appendChild(
		document.createTextNode(`), actuellement, il en reste ${stock}.`)
	);
	document.body.appendChild(divAlerte);
	setTimeout(() => divAlerte.classList.add("show"), 10);
	setTimeout(() => {
		divAlerte.classList.remove("show");
		divAlerte.classList.add("fade");
		setTimeout(() => divAlerte.remove(), 300);
	}, 3000);
}

// Fonctions utilitaires principales
/**
	Met à jour le compteur d'articles dans la navbar.
	@panier {Object}
*/
function majCompteurNavbar(panier) {
	const lienPanier = document.getElementById("cart-link");
	let nombreArticles = 0;
	for (const identifiant in panier) {
		nombreArticles += panier[identifiant].quantity;
	}
	if (lienPanier) {
		lienPanier.innerText = `Mon Panier${nombreArticles > 0 ? ` (${nombreArticles})` : ""}`;
	}
}

// Fonctions principales
class Cart {
	constructor() {}

	/**
		Récupère le contenu du panier depuis le localStorage.
		@return {Object}
	*/
	get() {
		return recupererPanierDepuisStockage();
	}

	/**
		Sauvegarde le panier dans le localStorage.
		@panier {Object}
	*/
	save(panier) {
		sauvegarderPanierDansStockage(panier);
	}

	/**
		Ajoute ou met à jour un produit dans le panier.
		@identifiant {number}
		@nomProduit {string}
		@prix {number}
		@stock {number}
	*/
	add(identifiant, nomProduit, prix, stock) {
		const panier = this.get();
		if (!panier[identifiant]) {
			panier[identifiant] = {
				id: identifiant,
				name: nomProduit,
				price: prix,
				quantity: 0,
				stock: stock,
			};
		}
		if (panier[identifiant].quantity >= stock) {
			afficherAlerteStock(nomProduit, stock);
			setTimeout(() => {
				panier[identifiant].quantity = stock;
				this._commitPanier(panier);
			}, 300);
		} else {
			panier[identifiant].quantity += 1;
			this._commitPanier(panier);
		}
	}

	/**
		Met à jour la quantité d'un produit.
		@identifiant {number}
		@nouvelleQuantite {number|string}
	*/
	update(identifiant, nouvelleQuantite) {
		const quantiteNumerique = parseInt(nouvelleQuantite);
		if (isNaN(quantiteNumerique)) return;
		const panier = this.get();
		if (!panier[identifiant]) return;
		const inputQuantite = document.querySelector(
			`input[data-cart-id='${identifiant}']`
		);
		const stock = parseInt(inputQuantite.dataset.stock || "1");
		let quantiteCorrigee = quantiteNumerique;
		if (quantiteNumerique < 1) quantiteCorrigee = 1;
		if (quantiteNumerique > stock) quantiteCorrigee = stock;
		panier[identifiant].quantity = quantiteCorrigee;
		inputQuantite.value = quantiteCorrigee;
		this.save(panier);
		this.render();
	}

	/**
		Supprime un produit du panier.
		@identifiant {number}
	*/
	remove(identifiant) {
		const panier = this.get();
		delete panier[identifiant];
		this.save(panier);
		this.render();
	}

	/**
		Vide complètement le panier.
	*/
	clear() {
		localStorage.removeItem("cart");
		this.render();
	}

	/**
		Met à jour le compteur du panier dans la navbar.
	*/
	updateNavbarCount() {
		const panier = this.get();
		majCompteurNavbar(panier);
	}

	/**
		Met à jour la quantité après un délai pour éviter les mises à jour trop fréquentes.
		@identifiant {number}
		@inputElement {HTMLInputElement}
	*/
	delayedUpdate(identifiant, inputElement) {
		clearTimeout(inputElement._cartTimer);
		inputElement._cartTimer = setTimeout(() => {
			this.update(identifiant, inputElement.value);
		}, 300);
	}

	/**
	 * Affiche un résumé de la commande dans un conteneur spécifique.
	 * @param {string} containerId - Id du conteneur HTML où afficher le résumé.
	 * @param {string} inputId - Id de l'input pour encoder les articles backend.
	 */
	renderOrderReview(
		containerId = "order-review-container",
		inputId = "order-items-input"
	) {
		const container = document.getElementById(containerId);
		const input = document.getElementById(inputId);
		const cartContent = this.get();
		if (!container || !input) return;
		if (Object.keys(cartContent).length === 0) {
			this.#renderEmptyReview(container, input);
			return;
		}
		const table = this.#createReviewTable(cartContent);
		const { totalOrder, itemsArray } = this.#addReviewRows(table.tbody, cartContent);
		container.innerHTML = "";
		container.appendChild(table.table);
    this.#renderReviewTotal(container, totalOrder);
    input.value = JSON.stringify(itemsArray);
	}

	/**
	 * Affiche un message indiquant que le panier est vide dans le résumé de commande.
	 * @param {HTMLElement} container - Conteneur HTML du résumé.
	 * @param {HTMLInputElement} input - Input pour la liste des articles.
	 */
	#renderEmptyReview(container, input) {
		container.innerHTML = "";
		const emptyAlert = document.createElement("p");
		emptyAlert.className = "alert alert-warning";
		emptyAlert.textContent = "Votre panier est vide.";
		container.appendChild(emptyAlert);
		input.value = "";
	}

	/**
	 * Crée et prépare la table HTML pour le résumé de commande.
	 * @param {Object} cartContent - Contenu du panier.
	 * @returns {Object} - Conteneurs table, tbody et tableau d'items.
	 */
	#createReviewTable(cartContent) {
		const table = document.createElement("table");
		table.className = "table shadow";
		const thead = document.createElement("thead");
		thead.className = "table-light";
		const headerRow = document.createElement("tr");
		["Plante", "Quantité", "Total"].forEach((headerLabel) => {
			const th = document.createElement("th");
			th.textContent = headerLabel;
			headerRow.appendChild(th);
		});
		thead.appendChild(headerRow);
		table.appendChild(thead);
		const tbody = document.createElement("tbody");
		table.appendChild(tbody);
		return { table, tbody, itemsArray: [] };
	}

	/**
	 * Ajoute les lignes produits dans le résumé de commande.
	 * @param {HTMLElement} tbody - Corps de la table.
	 * @param {Object} cartContent - Contenu du panier.
	 * @returns {number} - Total de la commande.
	 */
	#addReviewRows(tbody, cartContent) {
		let totalOrder = 0;
		const itemsArray = [];
		for (const productId in cartContent) {
			const item = cartContent[productId];
			const subtotal = item.quantity * item.price;
			totalOrder += subtotal;
			const row = document.createElement("tr");
			this.#appendReviewCells(row, productId, item, subtotal);
			tbody.appendChild(row);
			itemsArray.push({
				plant_id: parseInt(productId),
				quantity: item.quantity,
			});
		}
		tbody.parentNode.itemsArray = itemsArray;
    return { totalOrder, itemsArray };
	}

	/**
	 * Ajoute les cellules d'une ligne dans le résumé commande.
	 * @param {HTMLElement} row - Ligne du tableau.
	 * @param {string} productId - Identifiant produit.
	 * @param {Object} item - Détails du produit.
	 * @param {number} subtotal - Sous-total pour la ligne.
	 */
	#appendReviewCells(row, productId, item, subtotal) {
		const nameCell = document.createElement("td");
		const link = document.createElement("a");
		link.href = `/plants/${productId}`;
		link.className = "cart-plant-link";
		link.textContent = item.name;
		nameCell.appendChild(link);
		row.appendChild(nameCell);

		const qtyCell = document.createElement("td");
		qtyCell.textContent = item.quantity;
		row.appendChild(qtyCell);

		const totalCell = document.createElement("td");
		totalCell.textContent = `${subtotal} €`;
		row.appendChild(totalCell);
	}

	/**
	 * Affiche le total de la commande dans le résumé.
	 * @param {HTMLElement} container - Conteneur du résumé.
	 * @param {number} totalOrder - Total à afficher.
	 */
	#renderReviewTotal(container, totalOrder) {
		const totalParagraph = document.createElement("p");
		totalParagraph.className = "text-end fw-bold";
		totalParagraph.textContent = `Total : ${totalOrder} €`;
		container.appendChild(totalParagraph);
	}

	/**
	 * Affiche le panier complet dans le conteneur HTML.
	 */
	render() {
		const container = document.getElementById("cart-container");
		if (!container) return;
		const cartContent = this.get();
		container.innerHTML = "";
		this.updateNavbarCount();
		if (Object.keys(cartContent).length === 0) {
			this.#renderEmptyCart(container);
			return;
		}
		const tableElements = this.#createCartTable();
		const totalPrice = this.#addCartRows(tableElements.tbody, cartContent);
		container.appendChild(tableElements.table);
		this.#renderCartTotal(container, totalPrice);
		this.#renderCartActions(container);
	}

	/**
	 * Affiche un message indiquant que le panier est vide.
	 * @param {HTMLElement} container - Conteneur du panier.
	 */
	#renderEmptyCart(container) {
		const emptyAlert = document.createElement("p");
		emptyAlert.className = "alert alert-info";
		emptyAlert.textContent = "Votre panier est vide.";
		container.appendChild(emptyAlert);
	}

	/**
	 * Crée et prépare la table HTML pour le panier.
	 * @returns {Object} - Table et tbody HTML.
	 */
	#createCartTable() {
		const table = document.createElement("table");
		table.className = "table";
		const thead = document.createElement("thead");
		thead.className = "table-light";
		const headerRow = document.createElement("tr");
		["Plante", "Quantité", "Action"].forEach((headerLabel) => {
			const th = document.createElement("th");
			th.textContent = headerLabel;
			headerRow.appendChild(th);
		});
		thead.appendChild(headerRow);
		table.appendChild(thead);
		const tbody = document.createElement("tbody");
		table.appendChild(tbody);
		return { table, tbody };
	}

	/**
	 * Ajoute les lignes produits dans le tableau panier.
	 * @param {HTMLElement} tbody - Corps de la table.
	 * @param {Object} cartContent - Contenu du panier.
	 * @returns {number} - Total du panier.
	 */
	#addCartRows(tbody, cartContent) {
		let total = 0;
		for (const productId in cartContent) {
			const item = cartContent[productId];
			total += item.price * item.quantity;
			const row = document.createElement("tr");
			this.#appendCartCells(row, productId, item);
			tbody.appendChild(row);
		}
		return total;
	}

	/**
	 * Ajoute les cellules d'une ligne dans le tableau panier.
	 * @param {HTMLElement} row - Ligne du tableau.
	 * @param {string} productId - Identifiant produit.
	 * @param {Object} item - Détails du produit.
	 */
	#appendCartCells(row, productId, item) {
		const nameCell = document.createElement("td");
		const link = document.createElement("a");
		link.href = `/plants/${productId}`;
		link.className = "text-decoration-none";
		link.textContent = item.name;
		nameCell.appendChild(link);
		row.appendChild(nameCell);

		const qtyCell = document.createElement("td");
		const inputQty = document.createElement("input");
		inputQty.type = "number";
		inputQty.min = "1";
		inputQty.className = "form-control form-control-sm";
		inputQty.style.maxWidth = "70px";
		inputQty.value = item.quantity;
		inputQty.dataset.cartId = productId;
		inputQty.dataset.stock = item.stock;
		inputQty.oninput = () => this.delayedUpdate(productId, inputQty);
		qtyCell.appendChild(inputQty);
		row.appendChild(qtyCell);

		const actionCell = document.createElement("td");
		const removeButton = document.createElement("button");
		removeButton.className = "btn btn-danger btn-sm";
		removeButton.textContent = "Retirer";
		removeButton.onclick = () => this.remove(productId);
		actionCell.appendChild(removeButton);
		row.appendChild(actionCell);
	}

	/**
	 * Affiche le total du panier.
	 * @param {HTMLElement} container - Conteneur du panier.
	 * @param {number} totalPrice - Total à afficher.
	 */
	#renderCartTotal(container, totalPrice) {
		const totalParagraph = document.createElement("p");
		totalParagraph.className = "text-end fw-bold";
		totalParagraph.textContent = `Total : ${totalPrice} €`;
		container.appendChild(totalParagraph);
	}

	/**
	 * Ajoute les boutons d'action (vider panier, passer commande).
	 * @param {HTMLElement} container - Conteneur du panier.
	 */
	#renderCartActions(container) {
		const actionsDiv = document.createElement("div");
		actionsDiv.className = "d-flex justify-content-between";
		const clearButton = document.createElement("button");
		clearButton.className = "btn btn-outline-secondary btn-sm";
		clearButton.textContent = "Vider le panier";
		clearButton.onclick = () => this.clear();
		actionsDiv.appendChild(clearButton);
		const checkoutLink = document.createElement("a");
		checkoutLink.href = "/orders/new";
		checkoutLink.className = "btn btn-primary";
		checkoutLink.textContent = "Passer la commande";
		actionsDiv.appendChild(checkoutLink);
		container.appendChild(actionsDiv);
	}

	/**
		Commit panier : sauvegarde et mise à jour compteur navbar.
		@panier {Object}
	*/
	_commitPanier(panier) {
		this.save(panier);
		this.updateNavbarCount();
	}
}

// Main

/**
 * Point d'entrée principal de l'application.
 * Initialise l'instance du panier et configure le rendu au chargement du DOM.
 */
function main() {
	window.cartInstance = new Cart();
	document.addEventListener("DOMContentLoaded", function () {
		window.cartInstance.renderOrderReview();
		window.cartInstance.updateNavbarCount();
		window.cartInstance.render();
	});
}

// Lancement du programme principal
main();
