const input = document.getElementById("taskInput");
const submit = document.querySelector("#submit");
const taskDisplay = document.querySelector("#taskDisplay");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

//Mostra as tarefas assim que o site é aberto
tasks.forEach((actTask) => {
  limitTime(actTask);
});
tasks.forEach((actTask) => {
  showTasks(actTask);
});

submit.addEventListener("click", addTask);
document.addEventListener("keydown", function (k) {
  if (k.key == "Enter") {
    addTask();
  }
});

//Adicionar as tarefas ao Local Storage
function addTask() {
  if (input.value) {
    let task = {
      name: input.value,
      complete: false,
      time: new Date(),
    };
    input.value = null;

    //Checa se a tarefa já foi adicionada(de forma ineficiente)
    for (let i in tasks) {
      if (tasks[i].name == task.name) {
        return false;
      }
    }

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks(tasks[tasks.length - 1]);
    return 0;
  }
  alert("Digite uma tarefa")
}

//Mostrar as tarefas na tela do usuário
function showTasks(task) {
  const div = document.createElement("div");

  div.innerHTML = `
  <span class="text">
    ${task.name} 
  </span>
  <span>
    <input type="checkbox" class="taskComplete taskbtns"> 
    <lord-icon
      src="https://cdn.lordicon.com/skkahier.json"
      trigger="hover"
      class="deleteTask"
      style="width:17px;height:17px">
    </lord-icon>
  </span>`;
  div.classList.add("task");
  taskDisplay.appendChild(div);

  if (task.complete == true) {
    document.querySelectorAll(".taskComplete")[
      tasks.indexOf(task)
    ].checked = true;
    div.classList.add("complete");
  }

  //Botões de concluir a tarefa ou deletá-la
  document.querySelectorAll(".taskComplete").forEach((el) => {
    el.addEventListener("click", function () {
      taskCompletes(el);
    });
  });
  document.querySelectorAll(".deleteTask").forEach((el) => {
    el.addEventListener("click", function () {
      deleteTask(el);
    });
  });
}

//Checa se as tarefas foram completas ou não
function taskCompletes(checkbox) {
  let actualTask = checkbox.parentElement.parentElement; // Obtém o pai do elemento atual, que é a <li> correspondente à tarefa
  let index = Array.from(actualTask.parentElement.children).indexOf(actualTask); // Obtém o índice do elemento atual dentro de seu contêiner

  let task = tasks[index]; // Obtém a tarefa correspondente ao índice

  // Muda a forma da task ser mostrada e sua prorprieadade no LocalStorage
  if (checkbox.checked) {
    actualTask.classList.add("complete");
    task.complete = true;
  } else {
    actualTask.classList.remove("complete");
    task.complete = false;
  }

  //Atualiza o LocalStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Deletar tarefas
function deleteTask(trashBtn) {
  let actualTask = trashBtn.parentElement.parentElement; // Obtém o pai do elemento atual, que é a <li> correspondente à tarefa
  let index = Array.from(actualTask.parentElement.children).indexOf(actualTask); // Obtém o índice do elemento atual dentro de seu contêiner

  tasks.splice(index, 1); // Remove a tarefa do array tasks
  actualTask.remove(); // Remove o elemento DOM

  // Atualiza os dados no localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function limitTime(task) {
  if (task.complete) {
    let actDate = new Date();
    const taskDate = new Date(task.time);

    // Definir horas, minutos, segundos e milissegundos como zero na data da tarefa
    taskDate.setHours(0, 0, 0, 0);

    // Definir horas, minutos, segundos e milissegundos como zero na data atual
    actDate.setHours(0, 0, 0, 0);

    if (actDate > taskDate) {
      alert(`Tarefa ${task.name} removida`);
      tasks.splice(tasks.indexOf(task), 1); // Remove a tarefa do array tasks
      // Atualiza os dados no localStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }
}
