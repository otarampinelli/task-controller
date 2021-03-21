import React from "react";

import Task from "../Tasks/Task";
import './style.css';

export default function Status(props) {
  const { status, tasks, addTask, deleteTask, addEmptyTask, moveTask } = props;

  let taskList, tasksForStatus;

  function handleAddEmpty() {
    addEmptyTask(status);
  }

  if (tasks) {
    tasksForStatus = tasks.filter((task) => {
      return task.status === status;
    });
  }

  if (tasksForStatus) {
    taskList = tasksForStatus.map((task) => {
      return (
        <Task
          addTask={(task) => addTask(task)}
          deleteTask={(id) => deleteTask(id)}
          moveTask={(id, status) => moveTask(id, status)}
          key={task.id}
          task={task}
        />
      );
    });
  }

  return (
    <div className={`container mt-3 mb-3 pt-3 pb-3 StatusLine ${status === 'In Progress' ? 'InProgress' : status}`}>
      <h3>{status}</h3>
      {taskList}
      <div className="TaskButton">
        <button onClick={handleAddEmpty} className="btn mt-2 btn-primary button AddTask">
          Add
        </button>
      </div>
    </div>
  );
}
