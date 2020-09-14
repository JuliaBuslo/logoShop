// dinamic adptive
"use strict";

(function () {
  let originalPositions = [];
  let daElements = document.querySelectorAll('[data-da]');
  let daElementsArray = [];
  let daMatchMedia = [];
  //Заполняем массивы
  if (daElements.length > 0) {
    let number = 0;
    for (let index = 0; index < daElements.length; index++) {
      const daElement = daElements[index];
      const daMove = daElement.getAttribute('data-da');
      if (daMove != '') {
        const daArray = daMove.split(',');
        const daPlace = daArray[1] ? daArray[1].trim() : 'last';
        const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
        const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
        const daDestination = document.querySelector('.' + daArray[0].trim())
        if (daArray.length > 0 && daDestination) {
          daElement.setAttribute('data-da-index', number);
          //Заполняем массив первоначальных позиций
          originalPositions[number] = {
            "parent": daElement.parentNode,
            "index": indexInParent(daElement)
          };
          //Заполняем массив элементов 
          daElementsArray[number] = {
            "element": daElement,
            "destination": document.querySelector('.' + daArray[0].trim()),
            "place": daPlace,
            "breakpoint": daBreakpoint,
            "type": daType
          }
          number++;
        }
      }
    }
    dynamicAdaptSort(daElementsArray);

    //Создаем события в точке брейкпоинта
    for (let index = 0; index < daElementsArray.length; index++) {
      const el = daElementsArray[index];
      const daBreakpoint = el.breakpoint;
      const daType = el.type;

      daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
      daMatchMedia[index].addListener(dynamicAdapt);
    }
  }
  //Основная функция
  function dynamicAdapt(e) {
    for (let index = 0; index < daElementsArray.length; index++) {
      const el = daElementsArray[index];
      const daElement = el.element;
      const daDestination = el.destination;
      const daPlace = el.place;
      const daBreakpoint = el.breakpoint;
      const daClassname = "_dynamic_adapt_" + daBreakpoint;

      if (daMatchMedia[index].matches) {
        //Перебрасываем элементы
        if (!daElement.classList.contains(daClassname)) {
          let actualIndex = indexOfElements(daDestination)[daPlace];
          if (daPlace === 'first') {
            actualIndex = indexOfElements(daDestination)[0];
          } else if (daPlace === 'last') {
            actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
          }
          daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
          daElement.classList.add(daClassname);
        }
      } else {
        //Возвращаем на место
        if (daElement.classList.contains(daClassname)) {
          dynamicAdaptBack(daElement);
          daElement.classList.remove(daClassname);
        }
      }
    }
    customAdapt();
  }

  //Вызов основной функции
  dynamicAdapt();

  //Функция возврата на место
  function dynamicAdaptBack(el) {
    const daIndex = el.getAttribute('data-da-index');
    const originalPlace = originalPositions[daIndex];
    const parentPlace = originalPlace['parent'];
    const indexPlace = originalPlace['index'];
    const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
    parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
  }
  //Функция получения индекса внутри родителя
  function indexInParent(el) {
    var children = Array.prototype.slice.call(el.parentNode.children);
    return children.indexOf(el);
  }
  //Функция получения массива индексов элементов внутри родителя 
  function indexOfElements(parent, back) {
    const children = parent.children;
    const childrenArray = [];
    for (let i = 0; i < children.length; i++) {
      const childrenElement = children[i];
      if (back) {
        childrenArray.push(i);
      } else {
        //Исключая перенесенный элемент
        if (childrenElement.getAttribute('data-da') == null) {
          childrenArray.push(i);
        }
      }
    }
    return childrenArray;
  }
  //Сортировка объекта
  function dynamicAdaptSort(arr) {
    arr.sort(function (a, b) {
      if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
    });
    arr.sort(function (a, b) {
      if (a.place > b.place) { return 1 } else { return -1 }
    });
  }
  //Дополнительные сценарии адаптации
  function customAdapt() {
    //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }
}());


// burger menu
$('.icon-menu').click(function (event) {
  $(this).toggleClass('active');
  $('.menu__body').toggleClass('active');
  $('body').toggleClass('lock');
});

// menu-page hover
// let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, webOS: function () { return navigator.userAgent.match(/webOS/i); }, iPhone: function () { return navigator.userAgent.match(/iPhone/i); }, iPad: function () { return navigator.userAgent.match(/iPad/i); }, iPod: function () { return navigator.userAgent.match(/iPod/i); }, IEMobile: function () { return navigator.userAgent.match(/IEMobile/i); }, WindowsPhone: function () { return navigator.userAgent.match(/Windows Phone/i); } };

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  let menuParents = document.querySelectorAll('.menu-page__parent>a');
  for (let index = 0; index < menuParents.length; index++) {
    const menuParent = menuParents[index];
    menuParent.addEventListener('click', function (e) {
      menuParent.parentElement.classList.toggle('active');
      e.preventDefault();
    });
  }
} else {
  let menuParents = document.querySelectorAll('.menu-page__parent');
  for (let index = 0; index < menuParents.length; index++) {
    const menuParent = menuParents[index];
    menuParent.addEventListener('mouseenter', function (e) {
      menuParent.classList.add('active');
    });
    menuParent.addEventListener('mouseleave', function (e) {
      menuParent.classList.remove('active');
    });
  }
}

// second menu burger

let menuPageBurger = document.querySelector('.menu-page__burger');
let menuPageBody = document.querySelector('.menu-page__body');

menuPageBurger.addEventListener('click', function (e) {
  menuPageBurger.classList.toggle('active');
  menuPageBody.classList.toggle('active');
});

// select search
let searchSelect = document.querySelector('.search-page__select');

searchSelect.addEventListener('click', function (e) {
  searchSelect.classList.toggle('active');
});

let checkboxCategories = document.querySelectorAll('.categories-search__checkbox');
for (let index = 0; index < checkboxCategories.length; index++) {
  const checkboxCategory = checkboxCategories[index];
  checkboxCategory.addEventListener('change', function (e) {
    checkboxCategory.classList.toggle('active');

    let checkboxActiveCategories = document.querySelectorAll('.categories-search__checkbox.active');

    if (checkboxActiveCategories.length > 0) {
      searchSelect.classList.add('categories');
      let searchQuantity = searchSelect.querySelector('.search-page__quantity');
      searchQuantity.innerHTML = searchQuantity.getAttribute('data-text') + ' ' + checkboxActiveCategories.length;
    } else {
      searchSelect.classList.remove('categories');
    }
  });
}

// ibg
function ibg() {

  let ibg = document.querySelectorAll(".ibg");
  for (var i = 0; i < ibg.length; i++) {
    if (ibg[i].querySelector('img')) {
      ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
    }
  }
}

ibg();



// slider swiper

let sliders = document.querySelectorAll('.swiper');
if (sliders) {
  for (let index = 0; index < sliders.length; index++) {
    let slider = sliders[index];
    if (!slider.classList.contains('swiper-bild')) {
      let slider_items = slider.children;
      if (slider_items) {
        for (let index = 0; index < slider_items.length; index++) {
          let el = slider_items[index];
          el.classList.add('swiper-slide');
        }
      }
      let slider_content = slider.innerHTML;
      let slider_wrapper = document.createElement('div');
      slider_wrapper.classList.add('swiper-wrapper');
      slider_wrapper.innerHTML = slider_content;
      slider.innerHTML = '';
      slider.appendChild(slider_wrapper);
      slider.classList.add('swiper-bild');
    }
    if (slider.classList.contains('gallery')) {
      // slider.data('lightGallery').destroy(true);
    }
  }
  sliders_bild_callback();
}

function sliders_bild_callback(params) { }

if (document.querySelector('.mainslider')) {
  let mainSlider = new Swiper('.mainslider__body', {
    observe: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    autoHeight: true,
    speed: 800,
    // loop: true,
    // Dotts
    pagination: {
      el: '.mainslider__dotts',
      clickable: true,
    },
    // Arrows

  });

  let mainSliderImages = document.querySelectorAll('.mainslider__image');
  let mainSliderDottes = document.querySelectorAll('.mainslider__dotts .swiper-pagination-bullet');

  for (let index = 0; index < mainSliderImages.length; index++) {
    const mainSliderImage = mainSliderImages[index].querySelector('img').getAttribute('src');
    mainSliderDottes[index].style.backgroundImage = "url('" + mainSliderImage + "')";

  }
}

if (document.querySelector('.products-slider')) {
  let productsSlider = new Swiper('.products-slider__item', {
    observe: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    autoHeight: true,
    speed: 800,
    // loop: true,
    // Dotts
    pagination: {
      el: '.products-slider__info',
      type: 'fraction',
    },
    // Arrows
    navigation: {
      nextEl: '.products-slider__arrow_next',
      prevEl: '.products-slider__arrow_prev',
    },
  });
}

if (document.querySelector('.brands-slider')) {
  let brandsSlider = new Swiper('.brands-slider__body', {
    observe: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    autoHeight: true,
    speed: 800,
    loop: true,
    // Dotts
    // pagination: {
    //   el: '.products-slider__info',
    //   type: 'fraction',
    // },
    // Arrows
    navigation: {
      nextEl: '.brands-slider__arrow_next',
      prevEl: '.brands-slider__arrow_prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      480: {
        slidesPerView: 2,
      },
      600: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 4,
      },
      992: {
        slidesPerView: 5,
      },
    }
  });
}

if (document.querySelector('.images-product')) {
  let imagesSubSlider = new Swiper('.images-product__subslider', {
    observe: true,
    observeParents: true,
    slidesPerView: 4,
    spaceBetween: 0,
    // autoHeight: true,
    speed: 800,
    // loop: true,
  });
  let imagesMainSlider = new Swiper('.images-product__mainslider', {
    observe: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    // autoHeight: true,
    speed: 800,
    // loop: true,
    thumbs: {
      swiper: imagesSubSlider
    },
  });

}

// QUANTITY
let quantityButtons = document.querySelectorAll('.quantity__button');
if (quantityButtons.length > 0) {
  for (let index = 0; index < quantityButtons.length; index++) {
    let quantityButt = quantityButtons[index];
    quantityButt.addEventListener('click', function (e) {
      let value = parseInt(quantityButt.closest('.quantity').querySelector('input').value);
      if (quantityButt.classList.contains('quantity__button_plus')) {
        value++;
      } else {
        value = value - 1;
        if (value < 1) {
          value = 1
        }
      }
      quantityButt.closest('.quantity').querySelector('input').value = value;
    });
  }
}


// TABS
let tab = function () {
  let tabNav = document.querySelectorAll('.tabs-item');
  let tabContent = document.querySelectorAll('.tabs-block');
  let tabName;

  tabNav.forEach(item => {
    item.addEventListener('click', selectTabNav)
  });

  function selectTabNav() {
    tabNav.forEach(item => {
      item.classList.remove('active');
    });
    this.classList.add('active');
    tabName = this.getAttribute('data-tab-name');
    selectTabContent(tabName);
  }

  function selectTabContent(tabName) {
    tabContent.forEach(item => {
      item.classList.contains(tabName) ? item.classList.add('active') :
        item.classList.remove('active');
    });
  }
};

tab();
// =================================PAGE TWO===============================================

// noUiSlider
var priceSlider = document.querySelector('.price-filter__slider');

noUiSlider.create(priceSlider, {
  start: [0, 100000],
  connect: true,
  tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
  range: {
    'min': [0],
    'max': [200000]
  }
});

const priceStart = document.getElementById('price-start');
const priceEnd = document.getElementById('price-end');
priceStart.addEventListener('change', setPriceValues);
priceEnd.addEventListener('change', setPriceValues);

function setPriceValues() {
  let priceStartValue;
  let priceEndValue;
  if (priceStart.value != '') {
    priceStartValue = priceStart.value;
  }
  if (priceEnd.value != '') {
    priceEndValue = priceEnd.value;
  }
  priceSlider.noUiSlider.set([priceStartValue, priceEndValue]);
}



// SPOLLER
$('.spoiler').click(function (event) {
  $(this).toggleClass('active').next().slideToggle(300);
});


// FILTER OM MOBILE
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  const filterTitle = document.querySelector('.filter__title');
  const filterContent = document.querySelector('.filter__content');
  filterTitle.addEventListener('click', function (e) {
    filterTitle.classList.toggle('active');
    filterContent.classList.toggle('active');
  });
}


// SELECT #1
const selectSingle = document.querySelector('.select-catalog');
const selectSingle_title = selectSingle.querySelector('.select-catalog__title');
const selectSingle_labels = selectSingle.querySelectorAll('.select-catalog__label');

// Toggle menu
selectSingle_title.addEventListener('click', () => {
  if ('active' === selectSingle.getAttribute('data-state')) {
    selectSingle.setAttribute('data-state', '');
  } else {
    selectSingle.setAttribute('data-state', 'active');
  }
});

// Close when click to option
for (let i = 0; i < selectSingle_labels.length; i++) {
  selectSingle_labels[i].addEventListener('click', (evt) => {
    selectSingle_title.textContent = evt.target.textContent;
    selectSingle.setAttribute('data-state', '');
  });
}

// // SELECT #2
const selectSingle2 = document.querySelector('.show-select-catalog');
const selectSingle_title2 = selectSingle2.querySelector('.show-catalog__title');
const selectSingle_labels2 = selectSingle2.querySelectorAll('.show-catalog__labels');

// Toggle menu
selectSingle_title2.addEventListener('click', () => {
  if ('active' === selectSingle2.getAttribute('data-state')) {
    selectSingle2.setAttribute('data-state', '');
  } else {
    selectSingle2.setAttribute('data-state', 'active');
  }
});

// Close when click to option
for (let i = 0; i < selectSingle_labels2.length; i++) {
  selectSingle_labels2[i].addEventListener('click', (evt) => {
    selectSingle_title2.textContent = evt.target.textContent;
    selectSingle2.setAttribute('data-state', '');
  });
}

// // SELECT #3
const selectSingle3 = document.querySelector('.show-select-catalog2');
const selectSingle_title3 = selectSingle3.querySelector('.show-catalog__title2');
const selectSingle_labels3 = selectSingle3.querySelectorAll('.show-catalog__labels2');

// Toggle menu
selectSingle_title3.addEventListener('click', () => {
  if ('active' === selectSingle3.getAttribute('data-state')) {
    selectSingle3.setAttribute('data-state', '');
  } else {
    selectSingle3.setAttribute('data-state', 'active');
  }
});

// Close when click to option
for (let i = 0; i < selectSingle_labels3.length; i++) {
  selectSingle_labels3[i].addEventListener('click', (evt) => {
    selectSingle_title3.textContent = evt.target.textContent;
    selectSingle3.setAttribute('data-state', '');
  });
}
