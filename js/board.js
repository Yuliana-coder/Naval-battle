class Board {
  constructor(field, plyaer) {
    //массив всех ячеек поля
    this.field = field;
    //у игрока - user корабли отрисованы и виды, у компьютера - скрыты
    this.plyaer = plyaer;
    //ход пользователя
    this.moveUser = false;
    //массив кораблей где хранится длина, начальная ячейка и положение
    this.ships = [];
    // массив пристреленных и занятых кораблями ячеек
    // 0 - свободная ячейка, 1 - промах, 2 - занят кораблем, 3 - ранен
    this.takenCells = new Array(field.length)
      .fill(0)
      .map((el) => new Array(field.length).fill(0));
  }

  /**
   * возвращает ячейку игрового поля
   * @param {integer} i индекс по строке
   * @param {integer} j индекс по столбцу
   */
  getField() {
    return this.field;
  }

  /**
   * Возвращает массив с информацией о ячейках
   */
  getTakenCells() {
    return this.takenCells;
  }

  /**
   * Добавление в массив кораблей
   * @param {object} ship
   */
  addShip(ship) {
    this.ships.push(ship);
  }

  /**
   * возвращает случайное число из диапозона
   * @param {integer} min
   * @param {integer} max
   */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * генерируем положение для коробля
   */
  getRandomlyPosition() {
    let position = "horizontally";
    let number = Math.floor(Math.random() * 2);
    if (number == 1) {
      position = "vertically";
    }
    return position;
  }

  /**
   * Проверка, ранен ли полностью корабль
   * @param {ship} ship
   */
  checkShip(ship) {
    let result = true;
    if (ship.pos == "horizontally") {
      for (let k = 0; k < ship.size; k++) {
        if (this.takenCells[ship.y][ship.x + k] != 3) {
          result = false;
        }
      }
    } else {
      for (let k = 0; k < ship.size; k++) {
        if (this.takenCells[ship.y + k][ship.x] != 3) {
          result = false;
        }
      }
    }
    return result;
  }

  /**
   * Находим в каком корабле раненная ячейка
   * @param {integer} i индекс по строке в массиве field и takenCells
   * @param {*integer} j индекс по столбцу
   */
  killedShip(i, j) {
    let result = false;
    for (const ship of this.ships) {
      if (ship.pos == "horizontally") {
        for (let k = ship.x; k < ship.x + ship.size; k++) {
          if (k == j && i == ship.y) {
            result = this.checkShip(ship);
          }
        }
      } else {
        for (let k = ship.y; k < ship.y + ship.size; k++) {
          if (k == i && j == ship.x) {
            result = this.checkShip(ship);
          }
        }
      }
    }

    return result;
  }

  /**
   * Проверка выстрела
   * @param {element} element
   */
  checkShot(element) {
    const injury = document.querySelector(".injury");
    injury.innerHTML = "Промах!";
    let find = false;
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field.length; j++) {
        //если попали в корабль, метим ячейку как раненную
        if (this.field[i][j] == element && this.takenCells[i][j] == 2) {
          this.field[i][j].classList.add("shot-cell");
          this.takenCells[i][j] = 3;
          //если ячейка последняя раненная в корабле, метим корабль убитым
          if (this.killedShip(i, j)) {
            this.field[i][j].classList.add("wound-cell");
            injury.innerHTML = "Убит!";
          } else {
            injury.innerHTML = "Ранен!";
          }
          find = false;
          break;
          //если попали в пустое поле, то промах
        } else if (this.field[i][j] == element && this.takenCells[i][j] == 0) {
          this.field[i][j].classList.add("miss-cell");
          this.takenCells[i][j] = 1;
          find = true;
          break;
          //иначе не попали по ячейке или попали в уже помеченную
        } else if (
          this.field[i][j] == element &&
          (this.takenCells[i][j] == 1 || this.takenCells[i][j] == 3)
        ) {
          injury.innerHTML = "Ой, не туда";
        }
      }
    }
    return find;
  }

  /**
   * Проверка все ли корабли на поле убиты
   */
  isFilled() {
    let result = true;
    for (let i = 0; i < this.field.length; i++) {
      if (result) {
        for (let j = 0; j < this.field.length; j++) {
          if (this.takenCells[i][j] == 2) {
            result = false;
            break;
          }
        }
      }
    }
    return result;
  }

  /**
   * Очистка поля
   */
  clearBoard() {
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field.length; j++) {
        this.takenCells[i][j] = 0;
        if (this.field[i][j].classList.contains("ship-cell")) {
          this.field[i][j].classList.remove("ship-cell");
        }
        if (this.field[i][j].classList.contains("miss-cell")) {
          this.field[i][j].classList.remove("miss-cell");
        }
        if (this.field[i][j].classList.contains("shot-cell")) {
          this.field[i][j].classList.remove("shot-cell");
        }
      }
    }
  }

  /**
   *
   * @param {integer} size размер корабля (сколько палуб)
   * @param {integer} x индекс по строке
   * @param {integer} y индекс по столбцу
   * @param {string} pos положение корабля
   */
  checkPost(size, x, y, pos) {
    let result = true;
    // проверка корабля за границы поля
    if (pos == "horizontally" && x + size > 10) {
      result = false;
    }
    if (pos == "vertically" && y + size > 10) {
      result = false;
    }
    //проверка корабля на размещение в занятых ячейках
    if (result) {
      if (pos == "horizontally") {
        for (let k = 0; k < size; k++) {
          if (
            this.takenCells[y][x + k] == 1 ||
            this.takenCells[y][x + k] == 2
          ) {
            result = false;
          }
        }
      } else {
        for (let k = 0; k < size; k++) {
          if (
            this.takenCells[y + k][x] == 1 ||
            this.takenCells[y + k][x] == 2
          ) {
            result = false;
          }
        }
      }
    }
    return result;
  }

  randomlyPost() {
    //размещение начинается с 4х палубного корабля и до однопалубного
    for (let size = 4; size > 0; size--) {
      //количество с 1го корабля до 4х
      for (let count = 0; count < 5 - size; count++) {
        //пока корабль не размещен
        let posted = false;
        //пытаемся разместить
        while (!posted) {
          let pos = this.getRandomlyPosition();
          let x = this.getRandomInt(0, 9);
          let y = this.getRandomInt(0, 9);
          const ship = {
            size: size,
            x: x,
            y: y,
            pos: pos,
          };

          if (this.checkPost(size, x, y, pos)) {
            this.renderShip(size, x, y, pos);
            this.addShip(ship);
            posted = true;
          }
        }
      }
    }
    //очищаем массив помеченных ячеек
    for (let i = 0; i < this.takenCells.length; i++) {
      for (let j = 0; j < this.takenCells.length; j++) {
        if (this.takenCells[i][j] == 1) {
          this.takenCells[i][j] = 0;
        }
      }
    }
  }

  /**
   * отрисовка корабля
   * @param {integer} size количество занятых клеточек
   * @param {integer} i индекс по строке
   * @param {integer} j индекс по столбцу
   */
  renderShip(size, x, y, position) {
    //если горизонтально рисуем вправо, т.е. [i][j] - координаты левого края
    if (position == "horizontally") {
      for (let k = 0; k < size; k++) {
        if (this.plyaer == "user") {
        this.field[y][x + k].classList.add("ship-cell");
        }
        this.takenCells[y][x + k] = 2;
      }
      this.markNeighboring(size, x, y, position);
    }
    //если вертикально рисуем вниз, т.е. [i][j] - координаты верхнего края
    else {
      for (let k = 0; k < size; k++) {
        if (this.plyaer == "user") {
        this.field[y + k][x].classList.add("ship-cell");
        }
        this.takenCells[y + k][x] = 2;
      }
      this.markNeighboring(size, x, y, position);
    }
  }

  /**
   * помечаются соседние с кораблем ячейки, чтобы не ставить рядом корабли
   * @param {integer} i индекс по строке
   * @param {integer} j индекс по столбцу
   */
  markNeighboring(size, i, j, position) {
    if (position == "horizontally") {
      for (let x = i - 1; x < i + size + 1; x++) {
        for (let y = j - 1; y < j + 2; y++) {
          if (this.takenCells[y] && this.takenCells[y][x] == 0) {
            this.takenCells[y][x] = 1;
          }
        }
      }
    } else {
      for (let x = i - 1; x < i + 2; x++) {
        for (let y = j - 1; y < j + size + 1; y++) {
          if (this.takenCells[y] && this.takenCells[y][x] == 0) {
            this.takenCells[y][x] = 1;
          }
        }
      }
    }
  }
}
