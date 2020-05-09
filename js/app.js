document.addEventListener("DOMContentLoaded", () => {
  // буквы слева в игровом поле
  const ALPHABET = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"];
  /**
   * Модальное окно для ввода имени
   */
  const nameModalWimdow = document.querySelector(".modal-hidden");

  /**
   * Обновление игровых поле и рандомная расстоновка кораблей перед началом игры
   */
  function createPlayingFields() {
    if (document.querySelector(".completed-modal")) {
      document
        .querySelector(".completed-modal")
        .classList.remove("completed-modal");
    }
    //игровое поле пользователя
    const userField = document.querySelector(".user-field");
    userField.innerHTML = "";
    //игровое поле компьютера
    const computerField = document.querySelector(".computer-field");
    computerField.innerHTML = "";

    // заполнение игровых полей ячейками
    for (let i = 0; i < 121; i++) {
      userField.innerHTML += `<div class="hidden-cell"></div>`;
      computerField.innerHTML += `<div class="hidden-cell"></div>`;
    }
    // преобразовываем массивы ячеек в двумерные массивы

    //двумерный массив ячеек пользователя
    const arrayCellsUser = convertToTwoDimensionalArray([
      ...userField.querySelectorAll("*"),
    ]);
    //двумерный массив ячеек без верхней строки и левого столбца
    const userBoard = convertToBoard(arrayCellsUser);
    //двумерный массив ячеек компьютера
    const arrayCellsComputer = convertToTwoDimensionalArray([
      ...computerField.querySelectorAll("*"),
    ]);
    //двумерный массив ячеек без верхней строки и левого столбца
    const computerBoard = convertToBoard(arrayCellsComputer);

    //Отображение модального окна для ввода имени
    nameModalWimdow.classList.add("name-modal");
    let inputName = false;

    /** Ввод имени */
    document
      .querySelector(".input-name")
      .addEventListener("click", function () {
        if (!document.querySelector(".text-name").value) {
          alert("Пожалуйста, введите Ваше имя");
        } else {
          document.querySelector(
            ".name-user"
          ).innerHTML = document.querySelector(".text-name").value;
          nameModalWimdow.classList.remove("name-modal");
          inputName = true;
        }
        if (inputName) {
          const boardForUser = new Board(userBoard, "user");
          boardForUser.randomlyPost();
          const boardForComputer = new Board(computerBoard, "computer");
          boardForComputer.randomlyPost();
          // Начало игры
          Game(boardForUser, boardForComputer);
        }
      });
  }

  /**
   * преобразование одномерного массива ячеек в двумерный
   * @param {arraay} arrayCells массив всех ячеек игрового поля
   */
  function convertToTwoDimensionalArray(arrayCells) {
    let twoDimensioalArray = [];
    k = 0; // индекс в одномерном массиве
    for (let i = 0; i < 11; i++) {
      let innerArray = [];
      for (let j = 0; j < 12; j++) {
        if (innerArray.length < 11) {
          innerArray.push(arrayCells[k]);
          k++;
        } else {
          twoDimensioalArray.push(innerArray);
        }
      }
    }
    return twoDimensioalArray;
  }

  /**
   * Заполнение двумерного массива всех ячеек поля
   * @param {array} arrayCells
   */
  function convertToBoard(arrayCells) {
    let field = [];
    // создание двумерного массива
    // и преобразование верхней строки с цифрами игрового поля
    // и левого столбца с буквами
    for (let k = 0; k < 10; k++) {
      field[k] = [];
      arrayCells[0][0].classList.remove("hidden-cell");
      arrayCells[0][k + 1].classList.remove("hidden-cell");
      arrayCells[k + 1][0].classList.remove("hidden-cell");
      arrayCells[0][k + 1].classList.add("number-cell");
      arrayCells[0][k + 1].classList.add("symbol-cell");
      arrayCells[0][k + 1].innerHTML = `${k + 1}`;
      arrayCells[k + 1][0].classList.add("letter-cell");
      arrayCells[k + 1][0].classList.add("symbol-cell");
      arrayCells[k + 1][0].innerHTML = `${ALPHABET[k]}`;
    }

    for (let i = 0; i < arrayCells.length - 1; i++) {
      for (let j = 0; j < arrayCells.length - 1; j++) {
        field[i][j] = arrayCells[i + 1][j + 1];
      }
    }

    return field;
  }

  /**
   * Ход игры
   * @param {Board} user
   * @param {Board} computer
   */
  function Game(user, computer) {
    //обновление поля с информацией о ходе
    document.querySelector(".injury").innerHTML = "";

    let cellsComputer = computer.getField();
    //информационное поле - чей сейчас ход
    const whoseMove = document.querySelector(".move");
    //по умолчанию первый ход пользователя
    whoseMove.innerHTML = "Ваш ход";

    for (let i = 0; i < cellsComputer.length; i++) {
      for (let j = 0; j < cellsComputer.length; j++) {
        cellsComputer[i][j].addEventListener("click", function (event) {
          //массив ячеек пользователя
          let cellsUser = user.getField();
          //после сделанного пользавтеля хода, ходит компьютер
          if (computer.checkShot(event.target)) {
            whoseMove.innerHTML = "Ход компьютера";
            let x = user.getRandomInt(0, 9);
            let y = user.getRandomInt(0, 9);
            setTimeout(() => {
              whoseMove.innerHTML = "Ваш ход";
              let check = false;
              while (!check) {
                check = user.checkShot(cellsUser[x][y]);
                x = user.getRandomInt(0, 9);
                y = user.getRandomInt(0, 9);
                //проверка завершения игры
                if (user.isFilled()) {
                  document
                    .querySelectorAll(".modal-hidden")[1]
                    .classList.add("completed-modal");
                  document
                    .querySelector(".btn-close")
                    .addEventListener("click", createPlayingFields);
                  document.querySelector(".completed-text").innerHTML =
                    "В этой игре победил компьютер! Попробуйте снова!";
                  console.log(user.getTakenCells);
                }
              }
            }, 700);
          }
          //проверка завершения игры
          if (computer.isFilled()) {
            document
              .querySelectorAll(".modal-hidden")[1]
              .classList.add("completed-modal");
            document
              .querySelector(".btn-close")
              .addEventListener("click", createPlayingFields);
            document.querySelector(".completed-text").innerHTML =
              "Ура! Поздравляем! Вы победили!!";
            console.log(user.getTakenCells);
          }
        });
      }
    }
  }

  createPlayingFields();
});
