'use strict';

window.addEventListener('DOMContentLoaded', () => {
  // !BURGER MENU 
  const burger = document.querySelector('.burger'),
    menu = document.querySelector('.menu'),
    menuItems = menu.querySelectorAll('.menu__link');

  burger.addEventListener('click', () => {
    menu.classList.toggle('active');
    document.body.classList.toggle('body-lock');
  });

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.screen.width <= 769) {
        menu.classList.toggle('active');
        document.body.classList.toggle('body-lock');
      }
    });
  });

  // !SCROLLING
  const links = menu.querySelectorAll('[href^="#"]'),
    header = document.querySelector('.header');

  let arr = [],
    pos = [],
    speed;

  links.forEach(link => {
    arr.push(link.hash);
  });

  const elements = document.querySelectorAll(arr);

  elements.forEach(elem => {
    pos.push(elem.getBoundingClientRect().top);
  });

  function widthDevice() {
    if (window.screen.width >= 769) {
      speed = 4;
    } else {
      speed = 7;
    }
  }

  widthDevice();

  links.forEach((link, i) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      let scrollWindow = document.documentElement.scrollTop;
      let y = pos[i] - header.clientHeight;

      if (scrollWindow > y) {
        step(y, scrollWindow, '-', speed);
      } else {
        step(y, scrollWindow, '+', speed);
      }

      function step(position, positionNow, sign, speed) {
        let timer = setInterval(() => {
          if (sign === '-') {
            if (Math.round(positionNow) >= Math.round(position)) {
              if (Math.round(positionNow) - Math.round(position) <= 20) {
                positionNow -= 1;
              }
              positionNow -= speed;
              document.documentElement.scrollTop = positionNow;
            } else {
              timer = clearInterval();
            }
          } else {
            if (Math.round(positionNow) <= Math.round(position)) {
              if (Math.round(position) - Math.round(positionNow) <= 20) {
                positionNow += 1;
              }
              positionNow += speed;
              document.documentElement.scrollTop = positionNow;
            } else {
              timer = clearInterval();
            }
          }
        }, 4);
      }
    });
  });

  // !FILTER
  const projects = document.querySelectorAll('.portfolio__parent'),
    projectsLinks = document.querySelectorAll('.portfolio__item'),
    parent = document.querySelector('.parent');

  async function func(item, display = 'none') {
    item.style.display = display;
  }

  function showItems(attr = 'none') {
    projects.forEach(project => {
      project.classList.remove('active-filter');
      project.classList.add('noactive-filter');
      func(project);

      if (project.hasAttribute(attr)) {
        project.classList.remove('noactive-filter');
        project.classList.add('active-filter');
        func(project, 'block');
        parent.classList.add('items');
      }

      if (attr === 'none') {
        project.classList.remove('noactive-filter');
        project.classList.add('active-filter');
        func(project, 'block');
        parent.classList.remove('items');
      }
    });
  }

  projectsLinks.forEach(item => {
    item.addEventListener('click', function () {
      if (item.hasAttribute('data-frontend')) {
        showItems('data-frontend');
      } else if (item.hasAttribute('data-website')) {
        showItems('data-website');
      } else {
        showItems();
      }
    });
  });

  // !MODALS
  function modal(triggerSelector, modalSelector) {
    const triggerContactModal = document.querySelectorAll(triggerSelector),
    modalContact = document.querySelector(modalSelector);

  triggerContactModal.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
  
      modalContact.classList.remove('hideModal');
      modalContact.classList.add('showModal');
    });
  });

  modalContact.addEventListener('click', (e) => {
    if (e.target === modalContact) {
      modalContact.classList.remove('showModal');
      modalContact.classList.add('hideModal');
    }
  });
  }

  modal('.about__btn-modal', '.modal__contact');
  modal('.portfolio__modal', '.modal__portfolio');

});