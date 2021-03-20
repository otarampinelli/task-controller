import React from 'react';
import axios from 'axios';

import Status from './components/Status/Status';

function App() {
    const [tasks, setTasks] = React.useState([]);

    React.useEffect(() => {
        console.log("using effect")
        loadTasks()
    }, [])

    function addEmptyTask(status) {
        const lastTask = tasks[tasks.length - 1];
        let newTaskId = 1;

        if (lastTask !== undefined) {
          newTaskId = lastTask.id + 1;
        }

        setTasks(tasks => [
          ...tasks,
          {
            // arrumar id
            id: 10,
            title: "",
            description: "",
            urgency: "",
            status: status
          },
        ]);
    }

    function addTask(taskToAdd) {
        let filteredTasks = tasks.filter(task => {
          return task.id !== taskToAdd.id;
        })

        let newTaskList = [...filteredTasks, taskToAdd];

        setTasks(newTaskList);

        // alterar para salver no db.json
        // saveTasks(newTaskList);
    }

    function deleteTask(taskId) {
        let filteredTasks = tasks.filter(task => {
          return task.id !== taskId;
        })
        
        setTasks(filteredTasks);

        // // alterar para deletar no db.json
        deleteTasks(taskId);
        // saveTasks(filteredTasks);
    }

    function moveTask(id, newStatus) {
        let task = tasks.filter(task => {
          return task.id === id;
        })

        let filteredTasks = tasks.filter(task => {
          return task.id !== id;
        })

        task.status = newStatus;

        let newTaskList = [...filteredTasks, task];

        setTasks(newTaskList);


        saveTasks(newTaskList);
    }

    function saveTasks(tasks) {
        // localStorage.setItem("tasks", JSON.stringify(tasks));

        for (const task of tasks) {
          axios.post('http://localhost:3000/lists', {
            // verificar e corrigir erro do id
            id: task.id,
            title: task.title
          }).then(response => {
            console.log(response);
          })

          axios.post('http://localhost:3000/tasks', {
            listId: task.id,
            title: task.description
          }).then(response => {
            console.log(response);
          })
        }
    }

    function deleteTasks(tasksId) {
      axios.delete(`http://localhost:3000/lists/${tasksId}`).then(response => {
        console.log(response);
      })
    }


    function loadTasks() {
        let loadedTasks = localStorage.getItem("tasks");

        let tasks = JSON.parse(loadedTasks);

        if (tasks) {
          setTasks(tasks);
        }
    }

    return (
        <div>
            <h1>Task Controller</h1>
            <main>
                <section>
                    <Status 
                    tasks={tasks}
                    addEmptyTask={addEmptyTask}
                    addTask={addTask}
                    deleteTask={deleteTask}
                    moveTask={moveTask}
                    status="Backlog"
                    />
                    <Status 
                    tasks={tasks}
                    addEmptyTask={addEmptyTask}
                    addTask={addTask}
                    deleteTask={deleteTask}
                    moveTask={moveTask}
                    status="In Progress"
                    />
                    <Status 
                    tasks={tasks}
                    addEmptyTask={addEmptyTask}
                    addTask={addTask}
                    deleteTask={deleteTask}
                    moveTask={moveTask}
                    status="Done"
                    />
                </section>
            </main>
        </div>
    );
}

export default App;
