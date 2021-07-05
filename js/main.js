(() => {
  
  const startPage = document.querySelector('.start'),
        container = document.querySelector('.container'),
        endPage = document.querySelector('.end'),
        table = document.createElement('ul'),
        timer = document.createElement('div'),
        startMenu = createStartMenu(),
        endMenu = createEndMenu();
  let images = [],
      chosenCards = [],
      quantity,
      numberOfCards,
      counter = 0,
      seconds,
      minuts;

  container.append(timer);
  container.append(table);

  function createStartMenu() {
    const h2 = document.createElement('h2'),
          span = document.createElement('span'),
          form = document.createElement('form'),
          input = document.createElement('input'),
          button = document.createElement('button');

    h2.classList.add('start-h2');
    span.classList.add('start-span');
    form.classList.add('start-form');
    input.classList.add('start-input');
    button.classList.add('start-button');

    h2.textContent = 'Найти пару';
    span.textContent = 'Кол-во карточек по вертикали/горизонтали:';
    input.placeholder = 'Введите чётное число от 2 до 10';
    button.textContent = 'Начать игру';

    form.append(input);
    form.append(button);
    startPage.append(h2);
    startPage.append(span);
    startPage.append(form);

    return {
      form, 
      input, 
      button,
    };
  };

  startMenu.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const enteredValue = parseInt(startMenu.input.value);

    if (!(enteredValue >= 2 && enteredValue <= 10) || enteredValue % 2 == 1 || enteredValue === 4) {
      quantity = 4;
      table.classList.add(`table-${quantity}x${quantity}`);
    } else {
      quantity = enteredValue;
      table.classList.add(`table-${quantity}x${quantity}`);
    };

    numberOfCards = quantity ** 2;    
    let allImages = generateArrayRandomNumber(1, 54);

    for (let i = 0; i < numberOfCards / 2; i++) {
      const image = allImages[i];
      // const image = Math.floor(i / 2 + 1);
      images.push(image, image);
      createClass(`.flipped[data-item="${image}"]`, `background-image: url(img/${image}.jpg);`);
      createClass(`.correct[data-item="${image}"]`, `background-image: url(./img/${image}.jpg);`);
    };

    shuffle(images);
    startGame();
    startPage.style.display = 'none';
    startMenu.input.value = '';
  });

  function createEndMenu() {
    const h2 = document.createElement('h2');
    const button = document.createElement('button');

    h2.classList.add('end-h2');
    button.classList.add('end-button');

    h2.textContent = status;
    button.textContent = 'Сыграть еще раз';

    endPage.append(h2);
    endPage.append(button);

    return { 
      h2,
      button,
    };
  };

  endMenu.button.addEventListener('click', () => {
    images = [];
    counter = 0;
    startPage.style.display = 'flex';
    endPage.style.display = 'none';
    timer.style.display = 'none';
    table.innerHTML = '';
    table.className = 'table';
  });

  function createClass(name, rules) {
    const style = document.createElement('style');

    document.getElementsByTagName('head')[0].appendChild(style);
    if (!(style.sheet || {}).insertRule) {
        (style.styleSheet || style.sheet).addRule(name, rules);
    } else {
        style.sheet.insertRule(name + "{" + rules + "}", 0);
    };
  };

  function generateArrayRandomNumber (min, max) {
    let totalNumbers = max - min + 1,
        arrayTotalNumbers = [],
        arrayRandomNumbers = [],
        tempRandomNumber;

    while (totalNumbers--) {
      arrayTotalNumbers.push(totalNumbers + min);
    }
  
    while (arrayTotalNumbers.length) {
      tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
      arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
      arrayTotalNumbers.splice(tempRandomNumber, 1);
    }
    return arrayRandomNumbers;
  };

  function shuffle(arr) {
    let j, temp;

    for (let i = arr.length - 1; i > 0; i--){
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    };
    
    return arr;
  };

  function showCards() {
    const cards = document.querySelectorAll(`.card`);
    for (const card of cards) {
      card.classList.add(`flipped`);
      setTimeout(() => {
        card.classList.remove('flipped');
      }, 2000);
    }
  };

  function flipCard() {
    if (!this.classList.contains('flipped') && !this.classList.contains('correct')) {
      this.classList.add(`flipped`);
      const chosenCard = this.dataset.item;
      chosenCards.push(chosenCard);
    }
  };

  function compareCards() {
    if (chosenCards.length === 2) {
      const selects = document.querySelectorAll(`.flipped`);
      if (chosenCards[0] === chosenCards[1]) {
        selects[0].className = 'card correct';
        selects[1].className = 'card correct';
        counter += 2;
        endGame();
      } else {
        setTimeout(() => {
          selects[0].classList.remove('flipped');
          selects[1].classList.remove('flipped');
        }, 500);
      }
    chosenCards = [];
    }
  };

  function startGame() {
    table.classList.add('table');
    timer.classList.add('timer');
    timer.style.display = 'block';

    for (const image of images) {
      const card = document.createElement('li');
  
      card.dataset.item = image;
      card.classList.add('card');
      table.append(card);

      card.addEventListener('click', flipCard);
      card.addEventListener('click', compareCards);
    };

    showCards();
    startTimer();
  };

  function startTimer() {
    let timeSeconds = 60;
    timer.textContent = '01:00';

    countdown = setInterval(() => {
      seconds = timeSeconds % 60;
      minuts = Math.trunc(timeSeconds / 60 % 60);

      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      if (minuts < 10) {
         minuts = '0' + minuts;
      }

      if (timeSeconds < 0) {
        clearInterval(countdown);
        endGame(timeSeconds);
      } else {
        let strTimer = `${minuts}:${seconds}`;
        timer.innerHTML = strTimer;
      }

      timeSeconds--;
    }, 1000)
  };

  function endGame(timeSeconds) {
    if (timeSeconds < 0) {
      endPage.style.display = 'flex';
      endMenu.h2.textContent = 'Вы проиграли';
    } 

    if (counter === numberOfCards) {
      endPage.style.display = 'flex';
      endMenu.h2.textContent = 'Вы выиграли';
      clearInterval(countdown);
    }
  };

})();