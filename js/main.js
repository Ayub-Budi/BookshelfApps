const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

//menghasilkan identitas unik pada setiap item todo
function generateId() {
  return +new Date();
}

//merupakan onjrct yang ingi di buat
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = bookObject.year;

  const divButton = document.createElement("div");
  divButton.classList.add("action");

  const textArticle = document.createElement("article");
  textArticle.classList.add("book_item");
  textArticle.append(textTitle, textAuthor, textYear, divButton);
  textArticle.setAttribute("id", `book-${bookObject.id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum selesai di Baca";
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    divButton.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Selesai dibaca";
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    divButton.append(checkButton, trashButton);
  }

  return textArticle;
}

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;

  const generatedID = generateId(); //membuat id

  //membuat object
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    false
  );

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  const listCompleted = document.getElementById("completeBookshelfList");

  // clearing list item
  uncompletedBookList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});

function cari() {
  var input, input2, filter, div, article, div2, article2, mencari, mencari2;
  input = document.getElementById("searchBookTitle");
  filter = input.value.toUpperCase();
  div = document.getElementById("incompleteBookshelfList");
  article = div.getElementsByTagName("article");

  div2 = document.getElementById("completeBookshelfList");
  article2 = div2.getElementsByTagName("article");

  for (var i = 0; i < article.length; i++) {
    mencari = article[i].getElementsByTagName("h3")[0];
    if (mencari.innerHTML.toUpperCase().indexOf(filter) > -1) {
      article[i].style.display = "";
    } else {
      article[i].style.display = "none";
    }
  }

  for (var i = 0; i < article2.length; i++) {
    mencari2 = article2[i].getElementsByTagName("h3")[0];
    if (mencari2.innerHTML.toUpperCase().indexOf(filter) > -1) {
      article2[i].style.display = "";
    } else {
      article2[i].style.display = "none";
    }
  }
}
