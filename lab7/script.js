const notepad = document.querySelector('#notepad');
const create = document.querySelector('.create');
let notes = [];

if (localStorage.getItem('notes') != null) {
    notes = JSON.parse(localStorage.getItem('notes'));
}
if (notes.length > 0) {
    notes.forEach(note => {
        InsertNote(note);
    });
} else {
    notes = []
}

const btn = document.querySelector('.create button')
btn.addEventListener('click', (event) => {
    let newNote = {
        title: document.querySelector('#title').value,
        content: document.querySelector('#content').value,
        isPinned: document.querySelector('#pin').checked,
        color: document.querySelector('#color').value,
        date: Date.now()
    }
    InsertNote(newNote)
    SaveNote(newNote);
    console.log(notes);
    event.preventDefault();
});

function InsertNote(note) {
        let item = document.createElement('div');
        item.classList.add('note');
        if (note.isPinned) item.classList.add('pinned');
        let title = document.createElement('div');
        title.classList.add('title');
        title.style.color = note.color;
        title.innerText = note.title;
        item.append(title);

        let content = document.createElement('div');
        content.classList.add('content');
        content.innerText = note.content;
        item.append(content);

        let date = document.createElement('div');
        content.classList.add('date');
        let time = new Date(note.date);
        content.innerText = time.getDay() + '.' + time.getMonth() + '.' + time.getFullYear();
        item.append(date);
        notepad.prepend(item);
}

function SaveNote(note) {
    notes.push(note);
    localStorage.removeItem('notes');
    localStorage.setItem('notes', JSON.stringify(notes));
}