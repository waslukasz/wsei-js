const notepad = document.querySelector('#notepad');
const create = document.querySelector('.create');
let notes = [];

InitiateNotes();

const btn = document.querySelector('.create button')
btn.addEventListener('click', (event) => {
    let note = {
        title: document.querySelector('#title').value,
        content: document.querySelector('#content').value,
        isPinned: document.querySelector('#pin').checked,
        color: document.querySelector('#color').value,
        date: Date.now()
    }
    SaveNote(note);
    DisplayNotes();
    event.preventDefault();
});

function DisplayNotes() {
    notepad.querySelectorAll('.note').forEach(el => el.remove());
    UpdateLocalStorage();

    notes.sort(function (a,b) {
        return a.isPinned - b.isPinned || b.date - a.date;
    });

    for (let i = 0; i < notes.length; i++) {
        const data = notes[i];
        
        // data: title, content, isPinned, color, date
        let note = document.createElement('div');
        let title = document.createElement('div');
        let content = document.createElement('div');
        let date = document.createElement('div');
        let edit = document.createElement('button');
        let remove = document.createElement('button');
        
        let editing = false;

        note.classList.add('note');
        title.classList.add('title');
        content.classList.add('content');
        date.classList.add('date');
        edit.classList.add('edit');
        remove.classList.add('remove');
        note.append(title, content, date, edit, remove);

        title.innerText = data.title;
        content.innerText = data.content;
         if (data.isPinned) note.classList.add('pinned');
        note.style.borderColor = data.color;
        let time = new Date(data.date);
        date.innerText = time.toLocaleString();
        edit.innerText = 'Edytuj';
        remove.innerText = 'Usuń';

        const editListener = edit.addEventListener('click', () => {
            if (!editing) {
                editing = true;
                let save = document.createElement('button');
                save.innerText = "Zapisz";
    
                let newTitle = document.createElement('input');
                let newContent = document.createElement('input');
                newTitle.setAttribute('type', 'text');
                newContent.setAttribute('type', 'text');
                newTitle.value = data.title;
                newContent.value = data.content;
                title.style.display = 'none';
                content.style.display = 'none';
                title.before(newTitle);
                content.before(newContent);
    
                saveListener = save.addEventListener('click', () => {
                    let newData = data;
                    newData.title = newTitle.value;
                    newData.content = newContent.value;
                    UpdateNote(data, newData);

                    newTitle.remove();
                    newContent.remove();
                    title.removeAttribute('style');
                    content.removeAttribute('style');
                    save.removeEventListener('click', saveListener);
                    save.remove();
                    editing = false;
                })
    
                edit.before(save);
            }
        });
        remove.addEventListener('click', () => DeleteNote(data));
        notepad.prepend(note);
    }
}

function SaveNote(note) {
    notes.push(note);
    DisplayNotes();
}

function UpdateNote(oldNote, newNote) {
    notes[notes.indexOf(oldNote)] = newNote;
    DisplayNotes();
}

function DeleteNote(item) {
    notes.splice(notes.indexOf(item), 1);
    DisplayNotes();
}

function InitiateNotes() {
    if (localStorage.getItem('notes') != null) {
        notes = JSON.parse(localStorage.getItem('notes'));
    }
    if (notes.length > 0) {
        DisplayNotes();
    } else {
        notes = []
    }
}

function UpdateLocalStorage() {
    localStorage.removeItem('notes');
    localStorage.setItem('notes', JSON.stringify(notes));
}