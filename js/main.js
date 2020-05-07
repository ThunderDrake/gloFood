'use strict'
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const form = document.querySelector('#logInForm');
const logInInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');


let login = localStorage.getItem('gloDelivery');

const getData = async function(url) {
   const response = await fetch(url)
   if (!response.ok) {
      throw new Error (`Ошибка по адресу ${url}, статус ошибки ${response.status}`)
   }
  return await response.json();
   
};

function toggleModalAuth() {
   modalAuth.classList.toggle('is-open');
   logInInput.style.borderColor = ''
}

function checkAuth() {
   if (login) {
      autorized();
   } else {
      notAutorized();
   }
}

function autorized() {

   function logOut() {
      login ='';
      buttonAuth.style.display = '';
      userName.style.display = '';
      buttonOut.style.display = '';
      buttonOut.removeEventListener('click', logOut);
      localStorage.removeItem('gloDelivery');
      checkAuth();
   }

   console.log('Авторизован');
   userName.textContent = login;
   buttonAuth.style.display = 'none';
   userName.style.display = 'inline';
   buttonOut.style.display = 'block';
   buttonOut.addEventListener('click', logOut)
}

function notAutorized() {
   console.log('Не авторизован');
   function logIn(event) {
      event.preventDefault();
      if (logInInput.value.trim){
         login = logInInput.value;
         localStorage.setItem('gloDelivery', login)
         toggleModalAuth();
         buttonAuth.removeEventListener('click', toggleModalAuth);
         closeAuth.removeEventListener('click', toggleModalAuth);
         logInForm.removeEventListener('submit', logIn);
         logInForm.reset();
         checkAuth();
      } else {
         logInInput.style.borderColor = 'red'
      }
   }

   buttonAuth.addEventListener('click', toggleModalAuth);
   closeAuth.addEventListener('click', toggleModalAuth);
   logInForm.addEventListener('submit', logIn);
}

function createCardRestaurant(restaurant) {
   const { image, kitchen, name, price, products, stars, time_of_delivery: timeOfDelivery } = restaurant;
   const card = `
   <a class="card card-restaurant" data-products="${products}" data-info="${[name, price, stars, kitchen]}">
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
         <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery} мин</span>
         </div>
         <!-- /.card-heading -->
         <div class="card-info">
            <div class="rating">
               ${stars}
            </div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
         </div>
         <!-- /.card-info -->
      </div>
      <!-- /.card-text -->
   </a>
   <!-- /.card -->`;
   cardsRestaurants.insertAdjacentHTML('beforeend', card);

}

function createCardGood(goods) {
   const { 
      description,
      id,
      image,
      price,
      name
    } = goods
   const card = document.createElement('div');
   card.className = 'card';
   card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
         <div class="card-heading">
            <h3 class="card-title card-title-reg">${name}</h3>
         </div>
         <!-- /.card-heading -->
         <div class="card-info">
            <div class="ingredients">${description}</div>
         </div>
         <!-- /.card-info -->
         <div class="card-buttons">
            <button class="button button-primary button-add-cart">
               <span class="button-card-text">В корзину</span>
               <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">${price} ₽</strong>
         </div>
      </div>
      <!-- /.card-text -->`);
   cardsMenu.insertAdjacentElement('beforeend',card) 
}

function openGoods(event) { 
   const target = event.target;
   if (login) {
      const restaurant = target.closest('.card-restaurant')
      if (restaurant) {
         const info = restaurant.dataset.info.split(',');
         const [ name, price, stars, kitchen ] = info;
         cardsMenu.textContent = '';
         containerPromo.classList.add('hide');
         restaurants.classList.add('hide');
         menu.classList.remove('hide');
         restaurantTitle.textContent = name;
         rating.textContent = stars;
         minPrice.textContent = `От ${price} ₽`;
         category.textContent = kitchen;
         getData(`./db/${restaurant.dataset.products}`).then(function(data) {
            data.forEach(createCardGood)
         });
      }
   } else {
      toggleModalAuth();
   }
}

function init() {
   getData('./db/partners.json').then(function(data) {
      data.forEach(createCardRestaurant)
   });
   
   cardsRestaurants.addEventListener('click', openGoods);
   logo.addEventListener('click', () => {
      containerPromo.classList.remove('hide');
      restaurants.classList.remove('hide');
      menu.classList.add('hide');
   });
   inputSearch.addEventListener('keydown', (event) => {
      if (event.keyCode == 13) {
         const target = event.target;

         const value = target.value.toLowerCase().trim();

         target.value = '';
         if (!value || value.length < 3) {
            target.style.backgroundColor = 'tomato';
            setTimeout(() => {
               target.style.backgroundColor = ''
            }, 2000);
            return;
         };

         const goods = [];
         getData('./db/partners.json').then((data) => {
            const products = data.map(item => {
               return item.products;
            });
            products.forEach((product) => {
               getData(`./db/${product}`).then((data) => {
                  goods.push(...data);
                  const searchGoods = goods.filter((item) => {
                     return item.name.toLowerCase().includes(value)
                  });
                  cardsMenu.textContent = '';
                  containerPromo.classList.add('hide');
                  restaurants.classList.add('hide');
                  menu.classList.remove('hide');
                  restaurantTitle.textContent = 'Результат поиска';
                  rating.textContent = '';
                  minPrice.textContent = '';
                  category.textContent = '';

                  return searchGoods
               }).then((data) => {
                  data.forEach(createCardGood);
               });
            });
            
         });
      }
   });
   
   checkAuth();
   
   new Swiper('.swiper-container', {
      loop: true,
      autoplay: {
         delay: 3000,
      },
      sliderPerView: 1,
      sliderPerColumn: 1,
   }); 
   
}

init();