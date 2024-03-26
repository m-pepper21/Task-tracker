//?  TASK MANAGER PROJECT
//form
const taskNameInput = document.getElementById("taskName");
const taskDescriptionInput = document.getElementById("taskDescription");
const projectInput = document.getElementById("projectName");
const dateInput = document.getElementById("dueDate");
const priorityInput = document.getElementById("priority");
const statusInput = document.getElementById("status");
const addTaskBtn = document.getElementById("addTaskBtn");
//table
const tableBody = document.getElementById("taskTableBody");
//progress chart
const progressChart = document.getElementById("progressChart");

// Saving to Local Storage
//stringify items
const storedFormData = JSON.parse(localStorage.getItem("formDetails")) || [];

function saveFormData(formDetails) {
  storedFormData.push(formDetails);
  localStorage.setItem("formDetails", JSON.stringify(storedFormData));
}

const saveToLocalStorage = (event) => {
  event.preventDefault();
  // saving Form details into an object
  const formDetails = {
    name: taskNameInput.value,
    description: taskDescriptionInput.value,
    project: projectInput.value,
    date: dateInput.value,
    priority: priorityInput.value,
    status: statusInput.value,
  };
  saveFormData(formDetails);
  localStorage.setItem("formDetails", JSON.stringify(storedFormData));
  location.reload();
};

console.log(localStorage);

addTaskBtn.addEventListener("click", saveToLocalStorage);

//Dislay Task List
function displayTask() {
  for (let i = 0; i < storedFormData.length; i++) {
    const task = storedFormData[i];
    const row = document.createElement("tr");
    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);
    const nameCell = document.createElement("td");
    nameCell.textContent = task.name;
    nameCell.setAttribute("contenteditable", "true");
    row.appendChild(nameCell);
    const descriCell = document.createElement("td");
    descriCell.textContent = task.description;
    descriCell.setAttribute("contenteditable", "true");
    row.appendChild(descriCell);
    const projectCell = document.createElement("td");
    projectCell.textContent = task.project;
    projectCell.setAttribute("contenteditable", "true");
    row.appendChild(projectCell);

    const dateCell = document.createElement("td");

    const dateSelect = document.createElement("input");
    dateSelect.type = "date";
    dateSelect.value = task.date ? task.date : "";
    dateCell.appendChild(dateSelect);
    row.appendChild(dateCell);

    const priorityCell = document.createElement("td");
    priorityCell.textContent = task.priority;
    priorityCell.setAttribute("contenteditable", "true");
    row.appendChild(priorityCell);
    const statusCell = document.createElement("td");
    statusCell.textContent = task.status;
    statusCell.setAttribute("contenteditable", "true");
    statusCell.classList.add(getStatusClass(task.status));
    row.appendChild(statusCell);

    const deleteCell = document.createElement("td");
    const deleteBut = document.createElement("button");
    deleteBut.innerHTML = "Delete";
    deleteCell.appendChild(deleteBut);
    row.appendChild(deleteCell);
    // had to add it here since variable is declared in the function
    deleteBut.addEventListener("click", clearTask);

    tableBody.appendChild(row);
  }
}
// function to be able to switch color
function getStatusClass(status) {
  switch (status) {
    case "complete":
      return "complete-status";
    case "inprogress":
      return "inprogress-status";
    default:
      return "incomplete-status";
  }
}

window.addEventListener("load", displayTask);

const clearTask = () => {
  for (i = 0; i < tableBody.rows.length; i++) {
    const row = tableBody.rows[i];
    const checkbox = row.querySelector("input[type='checkbox']");
    if (checkbox.checked) {
      tableBody.deleteRow(i);
      storedFormData.splice(i, 1);
      localStorage.setItem("formDetails", JSON.stringify(storedFormData));
    }
  }
};

//  Adding Voice Recognition
const voiceBtn = document.getElementById("voiceBtn");
const outputDiv = document.getElementById("output");
const addvoiceTaskBtn = document.getElementById("addvoiceTaskBtn");

const recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition)();
recognition.lang = "en-US";

recognition.onstart = () => {
  voiceBtn.textContent = "Listening...";
};

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  outputDiv.textContent = transcript;
};

recognition.onend = () => {
  voiceBtn.textContent = "Start Voice Input";
};

voiceBtn.addEventListener("click", () => {
  recognition.start();
});

//Adding the voice recognition task into the Task list

function addVoiceTask() {
  const newTask = outputDiv.textContent.trim();
  if (newTask !== "") {
    const newVoiceTask = {
      name: newTask,
      description: "",
      project: "",
      date: "",
      priority: "",
      status: "incomplete",
    };
    saveFormData(newVoiceTask);
    location.reload();
  } else {
    alert("please state your task!");
  }
}
addvoiceTaskBtn.addEventListener("click", addVoiceTask);

//Progress Chart Generation:
function updateProgressChart() {
  const completedTasks = storedFormData.filter(
    (task) => task.status === "complete"
  ).length;
  const totalTasks = storedFormData.length;
  const incompleteTasks = totalTasks - completedTasks;

  const completePercentage = (completedTasks / totalTasks) * 100;
  const incompletePercentage = (incompleteTasks / totalTasks) * 100;

  const chart = document.getElementById("progressChart").getContext("2d");
  const progressChart = new Chart(chart, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Incomplete/In Progress"],
      datasets: [
        {
          data: [completePercentage, incompletePercentage],
          backgroundColor: ["#41EAD4", "#F71735"],
        },
      ],
    },
    options: {
      cutoutPercentage: 80,
      responsive: false,
      plugins: {
        legend: {
          position: "right",
          align: "start",
          labels: {
            boxWidth: 10,
            padding: 20,
            font: {
              size: 14,
            },
          },
        },
        doughnutlabel: {
          labels: [
            {
              text: completePercentage.toFixed(2) + "%",
              font: {
                size: 18,
                weight: "bold",
              },
            },
          ],
        },
      },
      elements: {
        arc: {
          borderWidth: 0,
        },
      },
    },
  });
}
//event listener
window.addEventListener("load", () => {
  updateProgressChart();
});

// Filtering the table

function filterBar() {
  const filter = input.value.toUpperCase();
  const tr = tableBody.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    let found = false;
    const tds = tr[i].getElementsByTagName("td");
    for (let y = 0; y < tds.length; y++) {
      const td = tds[y];
      if (td) {
        const txtValue = td.textContent || td.innerText;
        if (txtValue.toLocaleUpperCase().indexOf(filter) > -1) {
          found = true;
          break;
        }
      }
    }
    if (found) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}

const input = document.getElementById("filterInput");
input.addEventListener("input", filterBar);

// Editing the table

tableBody.addEventListener("blur", handleCellEdit, true);

function handleCellEdit(event) {
  const editedCell = event.target;

  if (editedCell.tagName.toLowerCase() !== "td") return;

  const rowIndex = editedCell.parentNode.rowIndex;
  const columnIndex = editedCell.cellIndex;

  const taskIndex = rowIndex - 1;
  const task = storedFormData[taskIndex];

  switch (columnIndex) {
    case 1:
      task.name = editedCell.textContent;
      break;
    case 2:
      task.description = editedCell.textContent;
      break;
    case 3:
      task.project = editedCell.textContent;
      break;
    // case 4:
    //   const dateInput = editedCell.querySelector("input[type='date']");
    //   if (dateInput) {
    //     task.date = dateInput.value;
    //   }
    //   break;
    case 5:
      task.priority = editedCell.textContent;
      break;
    case 6:
      task.status = editedCell.textContent;
      break;
    default:
      break;
  }
  localStorage.setItem("formDetails", JSON.stringify(storedFormData));
}

//Add Sticky Notes
document
  .getElementById("stickyForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const noteText = document.getElementById("noteText").value.trim();
    if (noteText !== "") {
      addStickyNoteToLocalStorage(noteText, { x: 10, y: 10 }); // Start with a small offset
      addStickyNoteToUI(noteText, { x: 10, y: 10 }); // Start with a small offset
      document.getElementById("noteText").value = "";
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  const storedNotes = JSON.parse(localStorage.getItem("stickyNotes")) || [];
  storedNotes.forEach(function (noteData) {
    addStickyNoteToUI(noteData.text, noteData.position);
  });
});

function addStickyNoteToLocalStorage(text, position) {
  const storedNotes = JSON.parse(localStorage.getItem("stickyNotes")) || [];
  storedNotes.push({ text, position });
  localStorage.setItem("stickyNotes", JSON.stringify(storedNotes));
}

function addStickyNoteToUI(text, position = { x: 10, y: 10 }) {
  const stickyNotesContainer = document.getElementById("sticky-notes");
  const note = document.createElement("div");
  note.classList.add("sticky-note");
  //
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkBoxNote");

  const deleteBtnNote = document.createElement("button");
  deleteBtnNote.classList.add("deleteBtnNote");
  deleteBtnNote.textContent = "Delete";
  deleteBtnNote.addEventListener("click", () => {
    removeStickyNoteFromUI(note);
  });
  //
  note.textContent = text;
  note.style.position = "relative";
  note.addEventListener("dragstart", dragStart);
  note.addEventListener("dragend", dragEnd);
  stickyNotesContainer.appendChild(note);
  //
  note.appendChild(checkbox);
  note.appendChild(deleteBtnNote);
}
function removeStickyNoteFromUI(note) {
  const stickyNotesContainer = document.getElementById("sticky-notes");
  stickyNotesContainer.removeChild(note);

  const storedNotes = JSON.parse(localStorage.getItem("stickyNotes")) || [];
  const noteId = note.dataset.noteId;
  const noteIndex = storedNotes.findIndex((note) => note.id === noteId);
  if (noteIndex !== -1) {
    storedNotes.splice(noteIndex, 1);
    localStorage.setItem("stickyNotes", JSON.stringify(storedNotes));
  }
}

// let currentNote = null;

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  currentNote = event.target;
}

function dragEnd(event) {
  event.target.style.visibility = "visible";
  const stickyNotesRect = document
    .getElementById("sticky-notes")
    .getBoundingClientRect();
  const noteRect = event.target.getBoundingClientRect();
  let x = noteRect.left - stickyNotesRect.left;
  let y = noteRect.top - stickyNotesRect.top;

  // Check if the note is outside the container's bounds
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + noteRect.width > stickyNotesRect.width)
    x = stickyNotesRect.width - noteRect.width;
  if (y + noteRect.height > stickyNotesRect.height)
    y = stickyNotesRect.height - noteRect.height;

  updateNotePosition(event.target.id, x, y);
}

// const stickyNotesContainer = document.getElementById("sticky-notes");
// stickyNotesContainer.addEventListener("dragover", dragOver);
// stickyNotesContainer.addEventListener("drop", drop);

// function dragOver(event) {
//   event.preventDefault();
// }

// function drop(event) {
//   event.preventDefault();
// }

// function updateNotePosition(note, x, y) {
//   const storedNotes = JSON.parse(localStorage.getItem("stickyNotes")) || [];
//   const noteIndex = storedNotes.findIndex(
//     (note) => note.text === currentNote.textContent
//   );
//   if (noteIndex !== -1) {
//     storedNotes[noteIndex].position = { x, y };
//     localStorage.setItem("stickyNotes", JSON.stringify(storedNotes));
//   }
// }

// Deleting Sticky Notes

// const clearStickyNotes = () => {
//   const stickyNotesContainer = document.getElementById("sticky-notes");
//   const storedNotes = JSON.parse(localStorage.getItem("stickyNotes")) || [];

//   for (let i = 0; i < stickyNotesContainer.children.length; i++) {
//     const note = stickyNotesContainer.children[i];
//     const checkbox = note.querySelector(".checkBoxNote");
//     if (checkbox.checked) {
//       // Remove the note from local storage
//       const noteId = note.dataset.noteId;
//       const noteIndex = storedNotes.findIndex((note) => note.id === noteId);
//       if (noteIndex !== -1) {
//         storedNotes.splice(noteIndex, 1);
//         localStorage.setItem("stickyNotes", JSON.stringify(storedNotes));
//       }

//       // Remove the note from the UI
//       stickyNotesContainer.removeChild(note);
//     }
//   }
// };
