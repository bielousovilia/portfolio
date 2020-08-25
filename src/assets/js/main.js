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

  menu.addEventListener('click', function (e) {
    menuItems.forEach(item => {
      if (window.screen.width <= 992 && e.target && e.target === item || e.target === menu) {
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
    pos.push(elem.getBoundingClientRect().top - document.body.getBoundingClientRect().top);
  });

  function widthDevice() {
    if (window.screen.width >= 769) {
      speed = 6;
    } else {
      speed = 8;
    }
  }

  widthDevice();

  links.forEach((link, i) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      let scrollWindow = document.documentElement.scrollTop || document.body.scrollTop;
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
              if (Math.round(positionNow) - Math.round(position) <= 10) {
                positionNow -= 1;
                document.documentElement.scrollTop = positionNow;
              } else {
                positionNow -= speed;
                document.documentElement.scrollTop = positionNow;
              }
            } else {
              timer = clearInterval();
            }
          } else {
            if (Math.round(positionNow) <= Math.round(position)) {
              if (Math.round(position) - Math.round(positionNow) <= 10) {
                positionNow += 1;
                document.documentElement.scrollTop = Math.abs(positionNow);
              } else {
                positionNow += speed;
                document.documentElement.scrollTop = Math.abs(positionNow);
              }
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

  function func(item, display = 'none') {
    item.style.display = display;
  }

  function showItems(attr = 'none') {
    projects.forEach(project => {
      project.classList.remove('active');
      project.classList.add('noactive');
      func(project);

      if (project.hasAttribute(attr)) {
        project.classList.remove('noactive');
        project.classList.add('active');
        func(project, 'block');
        parent.classList.add('items');
      }

      if (attr === 'none') {
        project.classList.remove('noactive');
        project.classList.add('active');
        func(project, 'block');
        parent.classList.remove('items');
      }
    });
  }


  function hideActiveItem() {
    projectsLinks.forEach(item => {
      item.classList.remove('active-item');
    });
  }

  projectsLinks.forEach(item => {
    item.addEventListener('click', function () {
      hideActiveItem();
      this.classList.add('active-item');

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
  function modal(triggerSelector, modalSelector, modalCloseSelector, itemsSelector = 'none') {
    const triggerContactModal = document.querySelectorAll(triggerSelector),
      modals = document.querySelectorAll(modalSelector),
      modalClose = document.querySelectorAll(modalCloseSelector),
      items = document.querySelectorAll(itemsSelector),
      images = ['./assets/images/oleksandr_sites.png', './assets/images/mavic__sites.png', '', './assets/images/burger__sites.png'],
      urls = ['http://oleksandrkornieiev-flute.com/', 'http://mavic.bielousov-dev.ru/', '', 'http://burger.bielousov-dev.ru/'];

    triggerContactModal.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        
        modals.forEach((modal, i) => {
          if (modal.hasAttribute('data-modalPortfolio')) {
            items.forEach((item, i) => {
              if (e.target && e.target.closest('.portfolio__parent') == item) {
                modal.querySelector('img').src = images[i];
                modal.querySelector('.about__btn-modal').href = urls[i];
                modal.classList.remove('hideModal');
                modal.classList.add('showModal');
                modal.classList.remove('noactive');
                modal.classList.add('active');
                document.body.classList.add('body-lock');
              }
            });
          } else {
            modal.classList.remove('hideModal');
            modal.classList.add('showModal');
            modal.classList.remove('noactive');
            modal.classList.add('active');
            document.body.classList.add('body-lock');
          }
        });
      });
    });

    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          setTimeout(() => {
            modal.classList.remove('showModal');
            modal.classList.add('hideModal');
          }, 400);
          modal.classList.remove('active');
          modal.classList.add('noactive');
          document.body.classList.remove('body-lock');
        }
      });
    });

    modalClose.forEach(close => {
      close.addEventListener('click', function (e) {
        e.preventDefault();

        modals.forEach(modal => {
          setTimeout(() => {
            modal.classList.remove('showModal');
            modal.classList.add('hideModal');
          }, 400);
          modal.classList.remove('active');
          modal.classList.add('noactive');
          document.body.classList.remove('body-lock');
        });
      });
    });
  }

  modal('.about__go', '.modal__contact', '[data-close]');
  modal('.portfolio__modal', '.modal__portfolio', '[data-close]', '.portfolio__parent');

});