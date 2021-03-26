const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

const buttonCart = document.querySelector('.button-cart'),
	overlay = document.querySelector('.overlay'),
	more = document.querySelector('.more'),
	navigationWrapper = document.querySelector('.navigation'),
	longGoodsList = document.querySelector('.long-goods-list'),
	cartTableGoods = document.querySelector('.cart-table__goods'),
	cartTableTotal = document.querySelector('.cart-table__total'),
	cartCount = document.querySelector('.cart-count'),
	cartClear = document.querySelector('.cart-clear');

const scrollToTop = () => {
	document.querySelector('#body').scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});
};

const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Ошибка запроса: ' + result.status;
	} else {
		return result.json();
	}
};

const cart = {
	cartGoods: [],
	renderCart() {
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({ id, name, price, count }) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete">x</button></td>
			`
			cartTableGoods.append(trGood);
		});

		cartTableTotal.textContent = this.cartGoods.reduce((sum, item) => sum + (item.price * item.count), 0) + '$';

		cartCount.textContent = this.cartGoods.reduce((sum, item) => sum + item.count, 0);
	},

	deleteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => item.id !== id);
		this.renderCart();
	},

	minusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id);
				} else {
					item.count--;
				};
				break;
			};
		};

		this.renderCart();
	},

	plusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count += 1;
				break;
			};
		};

		this.renderCart();
	},
	
	addGood(id) {
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({ id, name, price }) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
					this.renderCart();
				})
		}
	},

	clearCart() {
		this.cartGoods = [];
		this.renderCart();
	}
};

document.body.addEventListener('click', event => {
	const addToCartButton = event.target.closest('.add-to-cart');

	if (addToCartButton) {
		cart.addGood(addToCartButton.dataset.id);
	}
});

cartClear.addEventListener('click', cart.clearCart.bind(cart));

cartTableGoods.addEventListener('click', event => {
	const target = event.target;
	
	if (target.tagName === 'BUTTON') {
		const id = target.closest('.cart-item').dataset.id;
		if (target.classList.contains('cart-btn-delete')) {
			cart.deleteGood(id);
		} else if (target.classList.contains('cart-btn-plus')) {
			cart.plusGood(id);
		} else if (target.classList.contains('cart-btn-minus')) {
			cart.minusGood(id);
		};
	}
});

const showAll = () => {
	getGoods().then(renderCards);
};

const openModal = () => {
	overlay.classList.add('show');
	cart.renderCart();
};

const closeModal = event => {
	const t = event.target;
	
	if ((!t.closest('.modal') || t.matches('.modal-close')) && !t.closest('td')) {
		overlay.classList.remove('show');
	}
};

overlay.addEventListener('click', closeModal);
buttonCart.addEventListener('click', openModal);

{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', event => {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
	
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		});
	}
};

const createCard = ({ label, name, img, description, price, id }) => {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	card.innerHTML = `
	<div class="goods-card">
		${label ? `<span class="label">${label}</span>` : ''}
		<img src="${"db/" + img}" alt="${name}" class="goods-image">
		<h3 class="goods-title">${name}</h3>
		<p class="goods-description">${description}</p>
		<button class="button goods-card-btn add-to-cart" data-id="${id}">
			<span class="button-price">$${price }</span>
		</button>
	</div>`;

	return card;
};

const renderCards = data => {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);
	
	document.body.className = 'show-goods'
};

more.addEventListener('click', event => {
	event.preventDefault();
	showAll();
	setTimeout(scrollToTop, 400);
});

const filterCards = (field, value) => {
	getGoods()
		.then(data => data.filter(good => good[field] === value))
		.then(renderCards);
};

navigationWrapper.addEventListener('click', event => {
	t = event.target;
	if (t.closest('.navigation-item')) {
		const item = t.closest('.navigation-item');
		const goodLink = item.querySelector('a');
		const field = goodLink.dataset.field;
		const value = goodLink.textContent;
		if (value === 'All') {
			showAll();
		} else {
			filterCards(field, value);
		}
	}
});

const viewButtons = [...document.querySelectorAll('button')].filter(button => {

	return button.querySelector('span') && button.querySelector('span').textContent ===  'View all' ?
		true : false;
});

viewButtons.forEach(button => {
	button.addEventListener('click', () => {
		showAll();
		setTimeout(scrollToTop, 400);
	});
});