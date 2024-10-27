let allBooks = []
const emptyBookList = document.querySelector("#emptyBookList")
const fields = document.querySelectorAll("input")
const modal = document.querySelector("#myModal")
const modalTitle = document.querySelector("#modalTitle")
const synopsis = document.querySelector("#synopsis")
const txtSynopsis = document.querySelector("#txtSynopsis")
const btnRegister = document.querySelector("#btnRegister")
const btnSearch = document.querySelector("#btnSearch")

function findBook() {
  return allBooks.findIndex((elem) => elem.bookName === (event.target.parentNode.className))
}

function showSynopsis(event) {
  if (event.target.id === "btnSinopsys") {
    modalTitle.innerHTML = `Sinopse do livro "${allBooks[findBook()].bookName}"`
    txtSynopsis.innerHTML = allBooks[findBook()].synopsis
    modal.style.display = "block"
  }
}

function showError(bookName) {
  const contentModel = document.querySelector("#contentModel")
  modalTitle.innerHTML = `Livro "${bookName}" não encontrado!`
  txtSynopsis.innerHTML = ""
  contentModel.style.width = "50%"
  modal.style.display = "block"
}

function closeModal(event) {
  modal.style.display = "none"
}

function closeModalWindow(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

function clearFields() {
  fields.forEach(function (elem) {
    elem.value = ""
  })
  synopsis.value = ""
}

function createCard(bookCard, bookName, bookAuthor, bookPublisher, numberOfPages, bookCover, isLoaned, loanedTo) {
  bookCard.className = bookName
  bookCard.innerHTML = `
    <p id="bookTitle">${bookName}</p>
    <img src="${bookCover}"/>
    Autor: ${bookAuthor}
    <br>Editora: ${bookPublisher}
    <br>Págs: ${numberOfPages}
    <br>Status: ${isLoaned ? `Emprestado para ${loanedTo}` : "Disponível"}
    <button id="btnSinopsys">Sinopse</button>
    <button id="btnLoan">${isLoaned ? "Devolver" : "Emprestar"}</button>
    <button id="btnRemove">Remover</button>
    `
}

function appendElements(divSelect, bookCard) {
  const btnCloseModal = document.querySelector("#btnCloseModal")
  divSelect.append(bookCard)
  divSelect.addEventListener("click", showSynopsis)
  divSelect.addEventListener("click", handleLoan)
  btnCloseModal.addEventListener("click", closeModal)
  window.addEventListener("click", closeModalWindow)
}

function handleLoan(event) {
  if (event.target.id === "btnLoan") {
    const bookIndex = findBook();
    const book = allBooks[bookIndex];

    if (book.isLoaned) {
      // Devolução do livro
      book.isLoaned = false;
      book.loanedTo = null;
      alert(`Livro "${book.bookName}" foi devolvido com sucesso!`);
    } else {
      // Empréstimo do livro
      const user = prompt("Digite o nome do usuário que deseja emprestar o livro:");
      if (user) {
        book.isLoaned = true;
        book.loanedTo = user;
        alert(`Livro "${book.bookName}" foi emprestado para ${user}.`);
      }
    }
    updateBookList();
  }
}

function updateBookList() {
  const listOfAllBooks = document.querySelector("#listOfAllBooks");
  listOfAllBooks.innerHTML = ""; // Limpar a lista para atualização

  if (allBooks.length === 0) {
    listOfAllBooks.innerHTML = "<p id='emptyBookList'>Nenhum livro cadastrado</p>";
    return;
  }

  allBooks.forEach(book => {
    const bookCard = document.createElement("div");
    createCard(bookCard, book.bookName, book.bookAuthor, book.bookPublisher, book.numberOfPages, book.bookCover, book.isLoaned, book.loanedTo);
    appendElements(listOfAllBooks, bookCard);
  });
}

function registerBook() {
  const bookName = document.querySelector("#bookName").value;
  const bookAuthor = document.querySelector("#bookAuthor").value;
  const bookPublisher = document.querySelector("#bookPublisher").value;
  const numberOfPages = Number(document.querySelector("#numberOfPages").value);
  const bookCover = document.querySelector("#bookCover").value;

  event.preventDefault();

  allBooks.push({
    bookName,
    bookAuthor,
    bookPublisher,
    numberOfPages,
    bookCover,
    synopsis: synopsis.value,
    isLoaned: false,
    loanedTo: null
  });

  updateBookList();
  clearFields();
}

function searchBook() {
  const bookNameSearch = document.querySelector("#bookNameSearch").value;
  const listOfBooksSearch = document.querySelector("#listOfBooksSearch");
  const foundBooks = document.querySelector("#foundBooks");
  const bookCard = document.createElement("div");

  foundBooks.innerHTML = "";
  listOfBooksSearch.append(foundBooks);

  const findBook = allBooks.filter(elem => elem.bookName === bookNameSearch);

  if (findBook.length !== 0) {
    findBook.forEach(elem => {
      createCard(bookCard, elem.bookName, elem.bookAuthor, elem.bookPublisher, elem.numberOfPages, elem.bookCover, elem.isLoaned, elem.loanedTo);
      appendElements(foundBooks, bookCard);
    });
  } else {
    showError(bookNameSearch);
  }

  clearFields();
}

btnRegister.addEventListener("click", registerBook);
btnSearch.addEventListener("click", searchBook);
