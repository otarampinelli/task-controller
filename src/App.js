import React from 'react';
import axios from 'axios';

import Status from './components/Status/Status';
import Menu from './components/Menu/Menu';

function App() {
    const [tasks, setTasks] = React.useState([]);

    React.useEffect(() => {
        loadTasks();
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
            id: newTaskId,
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

        saveTasks(newTaskList);
    }

    function deleteTask(taskId) {
        let filteredTasks = tasks.filter(task => {
          return task.id !== taskId;
        })
        
        setTasks(filteredTasks);

        deleteTasks(taskId);
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

        // Add method to update status on db.json

    }

    function saveTasks(tasks) {
        // remove this localStorage - usage for inital developement
        localStorage.setItem("tasks", JSON.stringify(tasks));
      
        for (const task of tasks) {
          const idTitle = searchId(task.id);
          idTitle.then(response => {
            if (task.id !== response) {
              axios.post('http://localhost:3000/lists', {
              id: task.id,
              title: task.title
            }).then(response => {
              console.log(response);
            })

            axios.post('http://localhost:3000/tasks', {
              listId: task.id,
              title: task.description,
              urgency: task.urgency,  
              status: task.status
            }).then(response => {
              console.log(response);
            })  
            }
          })
        }
    }

    async function searchId(taskId) {
      return axios.get(`http://localhost:3000/lists/${taskId}`).then(response => {
        return response.data.id;
      }).catch(err => {
        console.log(err);
      });
    }

    function deleteTasks(tasksId) {
      axios.delete(`http://localhost:3000/lists/${tasksId}`).then(response => {
        console.log(response);
      })
    }

    function loadTasks() {
        // change to load data from db.json
        let loadedTasks = localStorage.getItem("tasks");

        let tasks = JSON.parse(loadedTasks);

        if (tasks) {
          setTasks(tasks);
        }
    }

    return (
        <div>
            <Menu />
            <div className="container">
              <main>
                  <div className="row">
                    <div className="col-12 col-md-4 col-lg-4">
                      <section>                      
                          <Status 
                          tasks={tasks}
                          addEmptyTask={addEmptyTask}
                          addTask={addTask}
                          deleteTask={deleteTask}
                          moveTask={moveTask}
                          status="Backlog"
                          />
                        </section>
                      </div>
                      <div className="col-12 col-md-4 col-lg-4">
                        <section>
                          <Status 
                          tasks={tasks}
                          addEmptyTask={addEmptyTask}
                          addTask={addTask}
                          deleteTask={deleteTask}
                          moveTask={moveTask}
                          status="In Progress"
                          />
                        </section>
                      </div>
                      <div className="col-12 col-md-4 col-lg-4">
                        <section>
                          <Status 
                          tasks={tasks}
                          addEmptyTask={addEmptyTask}
                          addTask={addTask}
                          deleteTask={deleteTask}
                          moveTask={moveTask}
                          status="Done"
                          />
                        </section>
                      </div>
                  </div>
              </main>
            </div>
        </div>
    );
}

export default App;
