const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

const scrollToTop = () => {
	document.querySelector('#body').scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});
}

// cart
const buttonCart = document.querySelector('.button-cart'),
	overlay = document.querySelector('.overlay');

const openModal = () => {
	overlay.classList.add('show');
};

const closeModal = event => {
	const t = event.target;
	
	if (!t.closest('.modal') || t.matches('.modal-close')) {
		overlay.classList.remove('show');
	}
};

overlay.addEventListener('click', closeModal);
buttonCart.addEventListener('click', openModal);

//scroll smooth 
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

// goods

const more = document.querySelector('.more'),
	navigationWrapper = document.querySelector('.navigation'),
	longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Ошибка запроса: ' + result.status;
	} else {
		return result.json();
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
	getGoods().then(renderCards);
	setTimeout(scrollToTop, 400);
});

const filterCards = (field, value) => {
	getGoods()
		.then(data => {
			return data.filter(good => {
				return good[field] === value;
			});
		})
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
			getGoods().then(renderCards);
		} else {
			filterCards(field, value);
		}
	}
});

// banners

const viewButtons = [...document.querySelectorAll('button span.button-text')].filter(button => {
	return button.textContent === 'View all';
});

viewButtons.forEach(button => {
	button.addEventListener('click', () => {
		getGoods().then(renderCards);
		setTimeout(scrollToTop, 400);
	});
});