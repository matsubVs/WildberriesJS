/*global require*/
/*eslint-env es6*/

const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart
const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const overlay = document.querySelector('.overlay');

const openModal = () => {
	modalCart.classList.add('show');
}

const closeModal = event => {
	const t = event.target;

	if (!t.closest('.modal')) {
		modalCart.classList.remove('show');
	} else if (t.matches('.modal-close')) {
		modalCart.classList.remove('show');
	}
}

overlay.addEventListener('click', closeModal);
buttonCart.addEventListener('click', openModal);

//scroll smooth 
{
	const scrollLink = document.querySelectorAll('a.scroll-link');

	for (let i = 0; i < scrollLink.length; i++) {
		scrollLink[i].addEventListener('click', event => {
			event.preventDefault();
			const id = scrollLink[i].getAttribute('href');
	
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		});
	}
}

