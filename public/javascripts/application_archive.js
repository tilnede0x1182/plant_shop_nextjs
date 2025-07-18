const STORAGE_KEY='cart';

function loadCart(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');}catch{return{};}}
function saveCart(cart){localStorage.setItem(STORAGE_KEY,JSON.stringify(cart));}
function createNode(tag,props={},...children){
	const el=document.createElement(tag);
	if(props.dataset){for(const[k,v]of Object.entries(props.dataset))el.dataset[k]=v;delete props.dataset;}
	Object.assign(el,props);
	children.flat().forEach(c=>el.append(typeof c==='string'?document.createTextNode(c):c));
	return el;
}
function showStockAlert(name,stock){
	const alert=createNode('div',
		{className:'alert alert-warning fade position-absolute top-0 start-50 translate-middle-x mt-3 shadow',role:'alert',style:'z-index:1055;max-width:600px;pointerEvents:none'},
		['Stock insuffisant pour cette plante (',createNode('strong',{textContent:name}),`), actuellement, il en reste ${stock}.`]
	);
	document.body.append(alert);
	setTimeout(()=>alert.classList.add('show'),10);
	setTimeout(()=>{alert.classList.remove('show');alert.classList.add('fade');setTimeout(()=>alert.remove(),300);},3000);
}
function updateNavbarCount(cart){
	const link=document.getElementById('cart-link');
	if(link){const n=Object.values(cart).reduce((t,i)=>t+i.quantity,0);link.textContent=`Mon Panier${n?` (${n})`:''}`;}
}

class Cart{
	get(){return loadCart();}
	save(c){saveCart(c);}
	commit(c){this.save(c);updateNavbarCount(c);}

	add(id,name,price,stock){
		const c=this.get();
		c[id]??={id,name,price,quantity:0,stock};
		if(c[id].quantity>=stock){
			showStockAlert(name,stock);
			setTimeout(()=>{c[id].quantity=stock;this.commit(c);},300);
		}else{c[id].quantity++;this.commit(c);}
	}

	update(id,value){
		const qty=parseInt(value,10);
		if(!qty)return;
		const c=this.get(); if(!c[id])return;
		const input=document.querySelector(`input[data-cart-id='${id}']`);
		const stock=parseInt(input.dataset.stock||'1',10);
		const newQty=Math.min(Math.max(qty,1),stock);
		c[id].quantity=input.value=newQty;
		this.save(c); this.render();
	}

	remove(id){const c=this.get(); delete c[id]; this.save(c); this.render();}
	clear(){localStorage.removeItem(STORAGE_KEY); this.render();}
	delayedUpdate(id,input){clearTimeout(input._t);input._t=setTimeout(()=>this.update(id,input.value),300);}

	renderOrderReview(ctId='order-review-container',inId='order-items-input'){
		const ct=document.getElementById(ctId),inp=document.getElementById(inId),cart=this.get();
		if(!ct||!inp)return;
		if(!Object.keys(cart).length){ct.innerHTML='<p class="alert alert-warning">Votre panier est vide.</p>';inp.value='';return;}
		const tbody=createNode('tbody'),
			table=createNode('table',{className:'table shadow'},
				createNode('thead',{className:'table-light'},
					createNode('tr',{},...['Plante','Quantité','Total'].map(t=>createNode('th',{textContent:t})))
				),tbody);
		let total=0,items=[];
		for(const[pid,item]of Object.entries(cart)){
			const sub=item.price*item.quantity; total+=sub;
			tbody.append(createNode('tr',{},
				createNode('td',{},createNode('a',{href:`/plants/${pid}`,className:'cart-plant-link',textContent:item.name})),
				createNode('td',{textContent:item.quantity}),
				createNode('td',{textContent:`${sub} €`})
			));
			items.push({plant_id:+pid,quantity:item.quantity});
		}
		ct.innerHTML=''; ct.append(table,createNode('p',{className:'text-end fw-bold',textContent:`Total : ${total} €`}));
		inp.value=JSON.stringify(items);
	}

	render(){
		const ct=document.getElementById('cart-container'); if(!ct)return;
		const cart=this.get(); ct.innerHTML=''; updateNavbarCount(cart);
		if(!Object.keys(cart).length){ct.append(createNode('p',{className:'alert alert-info',textContent:'Votre panier est vide.'}));return;}

		const tbody=createNode('tbody'),
			table=createNode('table',{className:'table'},
				createNode('thead',{className:'table-light'},
					createNode('tr',{},...['Plante','Quantité','Action'].map(t=>createNode('th',{textContent:t})))
				),tbody);
		let total=0;
		for(const[pid,item]of Object.entries(cart)){
			total+=item.price*item.quantity;
			const input=createNode('input',{type:'number',min:1,className:'form-control form-control-sm',style:'max-width:70px',value:item.quantity});
			input.dataset.cartId=pid; input.dataset.stock=item.stock;
			input.oninput=()=>this.delayedUpdate(pid,input);
			tbody.append(createNode('tr',{},
				createNode('td',{},createNode('a',{href:`/plants/${pid}`,className:'text-decoration-none',textContent:item.name})),
				createNode('td',{},input),
				createNode('td',{},createNode('button',{className:'btn btn-danger btn-sm',textContent:'Retirer',onclick:()=>this.remove(pid)}))
			));
		}
		ct.append(table,
			createNode('p',{className:'text-end fw-bold',textContent:`Total : ${total} €`}),
			createNode('div',{className:'d-flex justify-content-between'},
				createNode('button',{className:'btn btn-outline-secondary btn-sm',textContent:'Vider le panier',onclick:()=>this.clear()}),
				createNode('a',{href:'/orders/new',className:'btn btn-primary',textContent:'Passer la commande'})
			)
		);
	}
}

window.cartInstance=new Cart();
document.addEventListener('DOMContentLoaded',()=>{
	cartInstance.renderOrderReview();
	cartInstance.render();
});
