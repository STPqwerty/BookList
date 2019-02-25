class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static addBookToList(book) {
    const list = document.getElementById('book-list');
    // Create tr element
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X<a></td>
    `;
  
    list.appendChild(row);
  }

  showAlert(message, className) {
    // Создаем div
    const div = document.createElement('div');
    // Добавляем класс
    div.className = `alert ${className}`;
    // Добавляем текст в сообщение
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');

    container.insertBefore(div, form);

    // Ставим Timeout на 3 секунды
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 3000);
  }

  static deleteBook(target) {
    if(target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  static clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Класс для работы с Local Storage
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book){
      const ui  = new UI;

      UI.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function(book, index){
     if(book.isbn === isbn) {
      books.splice(index, 1);
     }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener для добавления книг
document.getElementById('book-form').addEventListener('submit', function(e){
  // Получаем данные из полей ввода
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

  // Создается экземпляр книги
  const book = new Book(title, author, isbn);

  // Экземпляр UI
  const ui = new UI();

  console.log(ui);

  if(title === '' || author === '' || isbn === '') {
    // Alert с ошибкой в случае пустых полей
    ui.showAlert('Пожалуйста, заполните все поля!', 'error');
  } else {
    // Добавляем книгу в список
    UI.addBookToList(book);

    // Добавляем в Local Storage
    Store.addBook(book);

    // Alert с сообщением об успешном добавлении
    ui.showAlert('Книга добавлена!', 'success');
  
    // Очищаем все поля
    UI.clearFields();
  }

  e.preventDefault();
});

// Event Listener для удаления
document.getElementById('book-list').addEventListener('click', function(e){

  // Экземпляр UI
  const ui = new UI();

  // Удаляем книгу
  UI.deleteBook(e.target);

  // Удаляем книгу из Local Storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Alert с сообщением об успешном удалении книги
  ui.showAlert('Книга удалена!', 'success');

  e.preventDefault();
});