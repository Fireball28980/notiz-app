const notesListEl = document.querySelector(".notes-list");
const saveButtonEl = document.querySelector(".save-note");
const deleteButtonEl = document.querySelector(".delete-note");
const createButtonEl = document.querySelector(".create-new");
const titleInputEl = document.getElementById("title-input");
const contentInputEl = document.getElementById("content-input");
const searchInputEl = document.querySelector(".search-input");

saveButtonEl.addEventListener("click", clickSaveButton);
createButtonEl.addEventListener("click", newNote);
deleteButtonEl.addEventListener("click", clickDeleteButton);
searchInputEl.addEventListener("input", searchNotes);

displayNotesList();
applyListeners();

function applyListeners() {
  const noteEntriesEls = document.querySelectorAll(".note-entry");

  noteEntriesEls.forEach((noteEntry) => {
    noteEntry.addEventListener("click", () =>
      selectNote(noteEntry.getAttribute("data-id"))
    );
  });
}

function displayNotesList() {
  const notes = getNotes();

  const sortedNotes = notes.sort(
    (noteA, noteB) => noteB.lastupdated - noteA.lastupdated
  );

  let html = "";

  sortedNotes.forEach((note) => {
    html += `
        <div class="note-entry" data-id="${note.id}">
            <div class="note-title">${escapeHtml(note.title)}</div>
            <div class="note-teaser">
                ${escapeHtml(note.content)}
            </div>
            <div class="note-date">${new Date(note.lastupdated).toLocaleString(
              "de-DE"
            )}</div>
        </div>
    `;
  });

  notesListEl.innerHTML = html;
}

function clickSaveButton() {
  const title = titleInputEl.value;
  const content = contentInputEl.value;

  if (!title || !content) {
    alert("Bitte Titel und Inhalt ausfüllen!!!");
    return;
  }

  saveNote(title, content, Number(getCurrentlySelectedId()));

  titleInputEl.value = "";
  contentInputEl.value = "";

  displayNotesList();
  applyListeners();
}

function clickDeleteButton() {
  const currentlySelecteId = getCurrentlySelectedId();

  if (!currentlySelecteId) return;

  deleteNote(currentlySelecteId);

  titleInputEl.value = "";
  contentInputEl.value = "";

  displayNotesList();
  applyListeners();
}

function selectNote(id) {
  const selectNoteEl = document.querySelector(`.note-entry[data-id="${id}"]`);

  if (selectNoteEl.classList.contains("selected-note")) return;

  removeSelectedClassAllNotes();

  selectNoteEl.classList.add("selected-note");

  const notes = getNotes();

  const selecteNote = notes.find((note) => note.id === Number(id));

  if (!selecteNote) return;

  titleInputEl.value = selecteNote.title;
  contentInputEl.value = selecteNote.content;
}

function newNote() {
  titleInputEl.value = "";
  contentInputEl.value = "";

  removeSelectedClassAllNotes();
}

function removeSelectedClassAllNotes() {
  const noteEntriesEls = document.querySelectorAll(".note-entry");
  noteEntriesEls.forEach((noteEntry) => {
    noteEntry.classList.remove("selected-note");
  });
}

function getCurrentlySelectedId() {
  let currentId = undefined;
  const currentlySelecteNoteEl = document.querySelector(".selected-note");

  if (currentlySelecteNoteEl) {
    currentId = currentlySelecteNoteEl.getAttribute("data-id");
  }

  return currentId;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function searchNotes() {
  console.log("Search function called");
  const searchTerm = searchInputEl.value.toLowerCase();
  console.log("Search term:", searchTerm);
  const notes = getNotes();

  const filteredNotes = notes.filter((note) => {
    const title = note.title.toLowerCase();
    const content = note.content.toLowerCase();
    return title.includes(searchTerm) || content.includes(searchTerm);
  });

  displayFilteredNotes(filteredNotes);
}

// Function to display filtered notes
function displayFilteredNotes(filteredNotes) {
  let html = "";

  filteredNotes.forEach((note) => {
    html += `
          <div class="note-entry" data-id="${note.id}">
              <div class="note-title">${escapeHtml(note.title)}</div>
              <div class="note-teaser">
                  ${escapeHtml(note.content)}
              </div>
              <div class="note-date">${new Date(
                note.lastupdated
              ).toLocaleString("de-DE")}</div>
          </div>
      `;
  });

  notesListEl.innerHTML = html;
  applyListeners();
}
