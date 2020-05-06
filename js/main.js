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

let login = localStorage.getItem('gloDelivery');

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

function createCardRestaurant() {
   const card = `
   <a class="card card-restaurant">
      <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
      <div class="card-text">
         <div class="card-heading">
            <h3 class="card-title">Пицца плюс</h3>
            <span class="card-tag tag">50 мин</span>
         </div>
         <!-- /.card-heading -->
         <div class="card-info">
            <div class="rating">
               4.5
            </div>
            <div class="price">От 900 ₽</div>
            <div class="category">Пицца</div>
         </div>
         <!-- /.card-info -->
      </div>
      <!-- /.card-text -->
   </a>
   <!-- /.card -->`;
   cardsRestaurants.insertAdjacentHTML('beforeend', card);

}

function createCardGood() {
   const card = document.createElement('div');
   card.className = 'card';
   card.insertAdjacentHTML('beforeend', `
      <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
      <div class="card-text">
         <div class="card-heading">
            <h3 class="card-title card-title-reg">Пицца Везувий</h3>
         </div>
         <!-- /.card-heading -->
         <div class="card-info">
            <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
               «Халапенье», соус «Тобаско», томаты.
            </div>
         </div>
         <!-- /.card-info -->
         <div class="card-buttons">
            <button class="button button-primary button-add-cart">
               <span class="button-card-text">В корзину</span>
               <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">545 ₽</strong>
         </div>
      </div>
      <!-- /.card-text -->`);
   cardsMenu.insertAdjacentElement('beforeend',card) 
}

function openGoods(event) { 
   const target = event.target;
   const restaurant = target.closest('.card-restaurant')
   if (restaurant) {
      if (login) {
         cardsMenu.textContent = '';
         containerPromo.classList.add('hide');
         restaurants.classList.add('hide');
         menu.classList.remove('hide');

         createCardGood();
         createCardGood();
         createCardGood();
      } else {
         toggleModalAuth();
      }
   }
}
cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', () => {
   containerPromo.classList.remove('hide');
   restaurants.classList.remove('hide');
   menu.classList.add('hide');
})



checkAuth();
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();



