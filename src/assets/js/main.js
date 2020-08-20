'use strict';

window.addEventListener('DOMContentLoaded', () => {
  // !BURGER MENU 
  const burger = document.querySelector('.burger'),
    menu = document.querySelector('.menu');

  burger.addEventListener('click', () => {
    menu.classList.toggle('active');
    document.body.classList.toggle('body-lock');
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

    console.log(pos);

    function widthDevice() {
      if (window.screen.width >= 768) {
        speed = 4;
      } else {
        speed = 7;
      }
    }

    widthDevice();

    links.forEach((link, i) => {
      link.addEventListener('click', function(e) {
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
                positionNow -= speed;
                document.documentElement.scrollTop = positionNow;
              } else {
                timer = clearInterval();
              }
            } else {
              if (Math.round(positionNow) <= Math.round(position)) {
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
});