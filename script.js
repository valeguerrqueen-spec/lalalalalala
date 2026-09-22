/* =====================================================
   BRAIN DUMP
   JAVASCRIPT PRINCIPAL
   ===================================================== */


/* =====================================================
   DATOS
   ===================================================== */

const STORAGE_KEYS = {
  tasks: "brainDump_tasks",
  ideas: "brainDump_ideas",
  theme: "brainDump_theme",
  drawingAlert: "brainDump_drawingAlert"
};


/* =====================================================
   ELEMENTOS DEL DOM
   ===================================================== */

const navButtons =
  document.querySelectorAll(".nav-btn");

const sections =
  document.querySelectorAll(".section");

const sectionButtons =
  document.querySelectorAll("[data-section]");


/* =====================================================
   NAVEGACIÓN SPA
   ===================================================== */

function showSection(sectionId) {

  sections.forEach(section => {
    section.classList.toggle(
      "active",
      section.id === sectionId
    );
  });

  navButtons.forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.section === sectionId
    );
  });

  /*
    Si salimos de Mini Paint,
    pausamos el contador.
  */

  if (sectionId === "paint") {
    startPaintTimer();
  } else {
    stopPaintTimer();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


sectionButtons.forEach(button => {

  button.addEventListener("click", () => {

    const sectionId =
      button.dataset.section;

    showSection(sectionId);

  });

});


/* =====================================================
   FECHA
   ===================================================== */

function updateDate() {

  const dateElement =
    document.getElementById("currentDate");

  const now = new Date();

  const formatted =
    now.toLocaleDateString("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });

  dateElement.textContent =
    formatted.charAt(0).toUpperCase()
    + formatted.slice(1);
}

updateDate();


/* =====================================================
   DASHBOARD
   ===================================================== */

const reminders = [
  "Broder, ¿ya hiciste la tarea del cole? La entrega es en 2 días.",
  "Tu yo del futuro está esperando que hagas ESA cosa.",
  "No necesitas ordenar toda tu vida. Empieza por una cosa.",
  "Si llevas 40 minutos pensando en hacerlo, técnicamente ya podrías haberlo hecho.",
  "Recordatorio amistoso: beber agua también cuenta como productividad.",
  "¿Eso que llevas posponiendo? Sí. Eso.",
  "No tienes que terminarlo ahora. Solo tienes que empezar.",
  "Tu cerebro tiene 47 pestañas abiertas. Cerremos una.",
  "Haz primero la cosa pequeña. El monstruo suele ser menos monstruo después.",
  "Cinco minutos de trabajo siguen siendo cinco minutos de trabajo."
];


function updateGreeting() {

  const greeting =
    document.getElementById("greeting");

  const hour =
    new Date().getHours();

  if (hour < 12) {
    greeting.textContent =
      "Buenos días. Vamos despacio.";
  } else if (hour < 18) {
    greeting.textContent =
      "Buenas. Sobrevivimos otro día.";
  } else {
    greeting.textContent =
      "Buenas noches. ¿Qué queda por sacar de la cabeza?";
  }
}


function randomReminder() {

  const element =
    document.getElementById("randomReminder");

  const random =
    reminders[
      Math.floor(
        Math.random() * reminders.length
      )
    ];

  element.textContent = random;
}


updateGreeting();
randomReminder();


/* =====================================================
   TAREAS
   ===================================================== */

let tasks =
  JSON.parse(
    localStorage.getItem(
      STORAGE_KEYS.tasks
    )
  ) || [];


const taskInput =
  document.getElementById("taskInput");

const taskCategory =
  document.getElementById("taskCategory");

const addTaskBtn =
  document.getElementById("addTaskBtn");


function saveTasks() {

  localStorage.setItem(
    STORAGE_KEYS.tasks,
    JSON.stringify(tasks)
  );

}


function addTask() {

  const text =
    taskInput.value.trim();

  if (!text) {

    taskInput.focus();

    return;
  }


  const newTask = {

    id:
      Date.now(),

    text,

    category:
      taskCategory.value,

    completed:
      false

  };


  tasks.unshift(newTask);

  saveTasks();

  taskInput.value = "";

  renderTasks();

  taskInput.focus();
}


addTaskBtn.addEventListener(
  "click",
  addTask
);


taskInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {
      addTask();
    }

  }
);


function toggleTask(taskId) {

  tasks =
    tasks.map(task => {

      if (task.id === taskId) {

        return {
          ...task,
          completed: !task.completed
        };

      }

      return task;

    });

  saveTasks();

  renderTasks();
}


function deleteTask(taskId) {

  tasks =
    tasks.filter(
      task => task.id !== taskId
    );

  saveTasks();

  renderTasks();
}


function renderTasks() {

  const categories = [
    "Cole",
    "Casa",
    "Otros"
  ];


  categories.forEach(category => {

    const container =
      document.getElementById(
        `${category}-tasks`
      );

    const column =
      container.closest(".task-column");

    const number =
      column.querySelector(".task-number");


    container.innerHTML = "";


    const categoryTasks =
      tasks.filter(
        task =>
          task.category === category
      );


    number.textContent =
      categoryTasks.length;


    if (categoryTasks.length === 0) {

      container.innerHTML = `
        <div class="empty-state">
          Nada aquí. Sospechosamente tranquilo.
        </div>
      `;

      return;
    }


    categoryTasks.forEach(task => {

      const item =
        document.createElement("div");

      item.className =
        "task-item"
        + (task.completed
          ? " completed"
          : "");


      item.innerHTML = `

        <input
          type="checkbox"
          class="task-checkbox"
          ${task.completed ? "checked" : ""}
          aria-label="Completar tarea"
        >

        <span class="task-text">
          ${escapeHTML(task.text)}
        </span>

        <button
          class="delete-task"
          aria-label="Eliminar tarea"
          title="Eliminar"
        >
          ×
        </button>

      `;


      const checkbox =
        item.querySelector(
          ".task-checkbox"
        );

      checkbox.addEventListener(
        "change",
        () => toggleTask(task.id)
      );


      const deleteButton =
        item.querySelector(
          ".delete-task"
        );

      deleteButton.addEventListener(
        "click",
        () => deleteTask(task.id)
      );


      container.appendChild(item);

    });

  });


  updateDashboardStats();
}


function updateDashboardStats() {

  const pending =
    tasks.filter(
      task => !task.completed
    ).length;


  document.getElementById(
    "pendingCount"
  ).textContent = pending;


  document.getElementById(
    "ideaCount"
  ).textContent = ideas.length;
}


/*
  Evita insertar directamente
  texto HTML introducido por el usuario.
*/

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


renderTasks();


/* =====================================================
   IDEAS
   ===================================================== */

const defaultIdeas = [
  "Colgar los posters",
  "Ver una peli",
  "Hacer un dibujo absurdo",
  "Reorganizar una esquina del cuarto",
  "Hacer una playlist nueva",
  "Probar un outfit que nunca uso",
  "Buscar referencias para un proyecto artístico",
  "Hacer stickers",
  "Salir a caminar un rato",
  "Ordenar 10 cosas y parar",
  "Hacer un collage",
  "Aprender algo random durante 15 minutos"
];


let ideas =
  JSON.parse(
    localStorage.getItem(
      STORAGE_KEYS.ideas
    )
  );


if (!Array.isArray(ideas)) {

  ideas =
    defaultIdeas.map(
      (text, index) => ({
        id:
          Date.now() + index,

        text
      })
    );

  localStorage.setItem(
    STORAGE_KEYS.ideas,
    JSON.stringify(ideas)
  );
}


const ideaInput =
  document.getElementById("ideaInput");

const addIdeaBtn =
  document.getElementById("addIdeaBtn");

const ideasList =
  document.getElementById("ideasList");


function saveIdeas() {

  localStorage.setItem(
    STORAGE_KEYS.ideas,
    JSON.stringify(ideas)
  );

}


function addIdea() {

  const text =
    ideaInput.value.trim();

  if (!text) {

    ideaInput.focus();

    return;
  }


  ideas.push({

    id:
      Date.now(),

    text

  });


  saveIdeas();

  ideaInput.value = "";

  renderIdeas();

  ideaInput.focus();
}


addIdeaBtn.addEventListener(
  "click",
  addIdea
);


ideaInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {
      addIdea();
    }

  }
);


function deleteIdea(id) {

  ideas =
    ideas.filter(
      idea => idea.id !== id
    );

  saveIdeas();

  renderIdeas();
}


function renderIdeas() {

  ideasList.innerHTML = "";


  if (ideas.length === 0) {

    ideasList.innerHTML = `
      <div class="empty-state">
        No tienes ideas guardadas todavía.
      </div>
    `;

    return;
  }


  ideas.forEach(idea => {

    const card =
      document.createElement("div");

    card.className = "idea-card";


    card.innerHTML = `

      <p>
        ${escapeHTML(idea.text)}
      </p>

      <button
        class="delete-idea"
        title="Eliminar idea"
        aria-label="Eliminar idea"
      >
        ×
      </button>

    `;


    card.querySelector(
      ".delete-idea"
    ).addEventListener(
      "click",
      () => deleteIdea(idea.id)
    );


    ideasList.appendChild(card);

  });


  updateDashboardStats();
}


renderIdeas();


/* =====================================================
   DOPAMINA
   ===================================================== */

const dopamineBtn =
  document.getElementById(
    "dopamineBtn"
  );

const ideaSuggestion =
  document.getElementById(
    "ideaSuggestion"
  );

const ideaDescription =
  document.getElementById(
    "ideaDescription"
  );


dopamineBtn.addEventListener(
  "click",
  () => {

    if (ideas.length === 0) {

      ideaSuggestion.textContent =
        "Primero añade algunas ideas.";

      ideaDescription.textContent =
        "Necesitamos combustible para el botón.";

      return;
    }


    const randomIdea =
      ideas[
        Math.floor(
          Math.random() * ideas.length
        )
      ];


    ideaSuggestion.textContent =
      randomIdea.text;

    ideaDescription.textContent =
      "No tienes que hacerlo perfecto. Solo hazlo durante 5 minutos.";

  }
);


/* =====================================================
   MINI PAINT
   ===================================================== */

const canvas =
  document.getElementById(
    "paintCanvas"
  );

const canvasContainer =
  document.querySelector(
    ".canvas-container"
  );

const ctx =
  canvas.getContext("2d");


let drawing = false;

let currentTool = "brush";

let brushSize = 8;

let brushColor = "#252525";

let currentLayer = 1;


/*
  El canvas utiliza una resolución
  interna independiente de su tamaño visual.
*/

function resizeCanvas() {

  const rect =
    canvasContainer.getBoundingClientRect();

  const oldImage =
    canvas.width > 0 && canvas.height > 0
      ? canvas.toDataURL()
      : null;


  canvas.width =
    Math.max(300, rect.width);

  canvas.height =
    Math.max(400, rect.height);


  ctx.lineCap = "round";
  ctx.lineJoin = "round";


  if (oldImage) {

    const image =
      new Image();

    image.onload = () => {

      ctx.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );

    };

    image.src = oldImage;
  }

}


window.addEventListener(
  "resize",
  resizeCanvas
);


setTimeout(
  resizeCanvas,
  100
);


/* =====================================================
   HERRAMIENTAS
   ===================================================== */

const brushTool =
  document.getElementById(
    "brushTool"
  );

const eraserTool =
  document.getElementById(
    "eraserTool"
  );

const colorPicker =
  document.getElementById(
    "colorPicker"
  );

const brushSizeInput =
  document.getElementById(
    "brushSize"
  );

const brushSizeValue =
  document.getElementById(
    "brushSizeValue"
  );


function selectTool(tool) {

  currentTool = tool;


  brushTool.classList.toggle(
    "active",
    tool === "brush"
  );

  eraserTool.classList.toggle(
    "active",
    tool === "eraser"
  );

}


brushTool.addEventListener(
  "click",
  () => selectTool("brush")
);


eraserTool.addEventListener(
  "click",
  () => selectTool("eraser")
);


colorPicker.addEventListener(
  "input",
  event => {

    brushColor =
      event.target.value;

  }
);


brushSizeInput.addEventListener(
  "input",
  event => {

    brushSize =
      Number(event.target.value);

    brushSizeValue.textContent =
      `${brushSize} px`;

  }
);


/* =====================================================
   CAPAS VIRTUALES
   ===================================================== */

const layerButtons =
  document.querySelectorAll(
    ".layer-btn"
  );


layerButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      currentLayer =
        Number(button.dataset.layer);


      layerButtons.forEach(
        layer =>
          layer.classList.remove(
            "active"
          )
      );


      button.classList.add(
        "active"
      );


      /*
        Son capas virtuales.
        La Capa 1 se comporta como fondo
        y la Capa 2 como dibujo.

        Para mantener el sistema simple,
        ambas terminan en el mismo canvas.
      */

    }
  );

});


/* =====================================================
   DIBUJAR
   ===================================================== */

function getCanvasPosition(event) {

  const rect =
    canvas.getBoundingClientRect();


  return {

    x:
      (event.clientX - rect.left)
      * (canvas.width / rect.width),

    y:
      (event.clientY - rect.top)
      * (canvas.height / rect.height)

  };

}


function startDrawing(event) {

  drawing = true;

  const position =
    getCanvasPosition(event);


  ctx.beginPath();

  ctx.moveTo(
    position.x,
    position.y
  );

}


function draw(event) {

  if (!drawing) return;


  const position =
    getCanvasPosition(event);


  ctx.lineWidth =
    brushSize;


  if (currentTool === "eraser") {

    ctx.globalCompositeOperation =
      "destination-out";

  } else {

    ctx.globalCompositeOperation =
      "source-over";

    ctx.strokeStyle =
      brushColor;

  }


  ctx.lineTo(
    position.x,
    position.y
  );

  ctx.stroke();

}


function stopDrawing() {

  drawing = false;

  ctx.closePath();

  ctx.globalCompositeOperation =
    "source-over";
}


canvas.addEventListener(
  "pointerdown",
  startDrawing
);

canvas.addEventListener(
  "pointermove",
  draw
);

canvas.addEventListener(
  "pointerup",
  stopDrawing
);

canvas.addEventListener(
  "pointerleave",
  stopDrawing
);


/* =====================================================
   LIMPIAR CANVAS
   ===================================================== */

const clearCanvasBtn =
  document.getElementById(
    "clearCanvasBtn"
  );


clearCanvasBtn.addEventListener(
  "click",
  () => {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

  }
);


/* =====================================================
   DESCARGAR DIBUJO
   ===================================================== */

const downloadBtn =
  document.getElementById(
    "downloadBtn"
  );


downloadBtn.addEventListener(
  "click",
  () => {

    const link =
      document.createElement("a");


    link.download =
      `mi-dibujo-${Date.now()}.png`;


    link.href =
      canvas.toDataURL(
        "image/png"
      );


    link.click();

  }
);


/* =====================================================
   TEMPORIZADOR DE DIBUJO
   ===================================================== */

let paintTimerInterval = null;

let paintSeconds = 0;

let alertAlreadyShown = false;


const paintTimer =
  document.getElementById(
    "paintTimer"
  );


const timeAlert =
  document.getElementById(
    "timeAlert"
  );


const drawingAlertToggle =
  document.getElementById(
    "drawingAlert"
  );


function formatTime(totalSeconds) {

  const minutes =
    Math.floor(
      totalSeconds / 60
    );

  const seconds =
    totalSeconds % 60;


  return (
    String(minutes).padStart(2, "0")
    + ":"
    + String(seconds).padStart(2, "0")
  );
}


function startPaintTimer() {

  if (paintTimerInterval) return;


  paintTimerInterval =
    setInterval(
      () => {

        paintSeconds++;


        paintTimer.textContent =
          formatTime(paintSeconds);


        /*
          5 minutos = 300 segundos.
        */

        if (
          paintSeconds >= 300
          &&
          drawingAlertToggle.checked
          &&
          !alertAlreadyShown
        ) {

          showTimeAlert();

          alertAlreadyShown = true;

        }

      },
      1000
    );
}


function stopPaintTimer() {

  if (!paintTimerInterval) return;


  clearInterval(
    paintTimerInterval
  );

  paintTimerInterval = null;
}


function showTimeAlert() {

  timeAlert.classList.add(
    "visible"
  );

}


document.getElementById(
  "closeAlert"
).addEventListener(
  "click",
  () => {

    timeAlert.classList.remove(
      "visible"
    );

  }
);


/* =====================================================
   TEMAS
   ===================================================== */

const themeButtons =
  document.querySelectorAll(
    ".theme-btn"
  );


function setTheme(theme) {

  document.body.dataset.theme =
    theme;


  localStorage.setItem(
    STORAGE_KEYS.theme,
    theme
  );


  themeButtons.forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.themeChoice === theme
    );

  });

}


themeButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      setTheme(
        button.dataset.themeChoice
      );

    }
  );

});


const savedTheme =
  localStorage.getItem(
    STORAGE_KEYS.theme
  );


if (savedTheme) {
  setTheme(savedTheme);
}


/* =====================================================
   ALERTA DE DIBUJO
   ===================================================== */

const savedAlert =
  localStorage.getItem(
    STORAGE_KEYS.drawingAlert
  );


if (savedAlert !== null) {

  drawingAlertToggle.checked =
    savedAlert === "true";

}


drawingAlertToggle.addEventListener(
  "change",
  event => {

    localStorage.setItem(
      STORAGE_KEYS.drawingAlert,
      event.target.checked
    );

  }
);


/* =====================================================
   BORRAR TODOS LOS DATOS
   ===================================================== */

const resetDataBtn =
  document.getElementById(
    "resetDataBtn"
  );


resetDataBtn.addEventListener(
  "click",
  () => {

    const confirmed =
      confirm(
        "¿Seguro que quieres borrar todas tus tareas e ideas? Esta acción no se puede deshacer."
      );


    if (!confirmed) return;


    localStorage.removeItem(
      STORAGE_KEYS.tasks
    );

    localStorage.removeItem(
      STORAGE_KEYS.ideas
    );


    tasks = [];

    ideas = [];


    renderTasks();

    renderIdeas();


    /*
      Recreamos las ideas iniciales
      para que la sección no quede vacía.
    */

    ideas =
      defaultIdeas.map(
        (text, index) => ({
          id:
            Date.now() + index,

          text
        })
      );


    saveIdeas();

    renderIdeas();

  }
);


/* =====================================================
   ATAJOS DE TECLADO
   ===================================================== */

document.addEventListener(
  "keydown",
  event => {

    /*
      Escape cierra la alerta.
    */

    if (
      event.key === "Escape"
    ) {

      timeAlert.classList.remove(
        "visible"
      );

    }

  }
);
