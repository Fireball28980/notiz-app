const LOCAL_STORAGE_KEY = "notizapp-notizen";

function getNotes() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

function saveNote(title, content, id = undefined) {
  const notes = getNotes();

  if (!id) {
    notes.push({
      title,
      content,
      id: getNextId(),
      lastupdated: new Date().getTime(),
    });
  } else {
    const indexOfNoteWithId = notes.findIndex((note) => note.id === id);

    if (indexOfNoteWithId > -1) {
      notes[indexOfNoteWithId] = {
        title,
        content,
        id,
        lastupdated: new Date().getTime(),
      };
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
}

function deleteNote(id) {
  if (!id) return;

  const notes = getNotes();

  const filterNotes = notes.filter((note) => note.id !== Number(id));

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filterNotes));
}

function getNextId() {
  const notes = getNotes();

  const sortedIds = notes.map((note) => note.id).sort((a, b) => b - a);

  if (sortedIds.length === 0) {
    return 1;
  }

  return sortedIds[0] + 1;
}
