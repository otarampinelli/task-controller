import { useState } from "react";

export default function Task(props) {
  const { addTask, deleteTask, moveTask, task } = props;

  const [urgencyLevel, setUrgencyLevel] = useState(task.urgency);
  const [collapsed, setCollapsed] = useState(task.isCollapsed);
  const [formAction, setFormAction] = useState("");

  function setUrgency(event) {
    setUrgencyLevel(event.target.attributes.urgency.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (formAction === "save") {
      if (collapsed) {
        setCollapsed(false);
      } else {
        let newTask = {
          id: task.id,
          title: event.target.elements.title.value,
          description: event.target.elements.description.value,
          urgency: urgencyLevel,
          status: task.status,
          isCollapsed: true
        };
        
        // todo daqui que vem o objeto para salvar
        addTask(newTask);
        setCollapsed(true);
      }
    }

    if (formAction === "delete") {
      deleteTask(task.id);
    }
  }

  function handleMoveLeft() {
    let newStatus = "";

    if (task.status === "In Progress") {
      newStatus = "Backlog";
    } else if (task.status === "Done") {
      newStatus = "In Progress";
    }

    if (newStatus !== "") {
      moveTask(task.id, newStatus);
    }
  }

  function handleMoveRight() {
    let newStatus = "";

    if (task.status === "Backlog") {
      newStatus = "In Progress";
    } else if (task.status === "In Progress") {
      newStatus = "Done";
    }

    if (newStatus !== "") {
      moveTask(task.id, newStatus);
    }
  }

  return (
    <div className={`task ${collapsed ? "collapsedTask" : ""}`}>
      <form onSubmit={handleSubmit} className={collapsed ? "collapsed" : ""}>
      <div className="form-group">
      <input
          type="text"
          className="title input form-control"
          name="title"
          placeholder="Enter Title"
          disabled={collapsed}
          defaultValue={task.title}
          id="low"
        />
      </div>
      <div className="form-group">
        <textarea
          rows="2"
          className="description input form-control"
          name="description"
          placeholder="Enter Description"
          defaultValue={task.description}
        />
      </div>
        <div className="form-check form-check-inline urgencyLabels">
            <label className={`low ${urgencyLevel === "low" ? "selected" : ""}`}>
              <input
                className="form-check-input"
                urgency="low"
                onChange={setUrgency}
                type="radio"
                name="urgency"
              />
              low
            </label>
          </div>
          <div className="form-check form-check-inline urgencyLabels">
            <label
              className={`medium ${urgencyLevel === "medium" ? "selected" : ""}`}
            >
              <input
                className="form-check-input"
                urgency="medium"
                onChange={setUrgency}
                type="radio"
                name="urgency"
              />
              medium
            </label>
          </div>
          <div className="form-check form-check-inline urgencyLabels">
            <label
              className={`high ${urgencyLevel === "high" ? "selected" : ""}`}
            >
              <input
                className="form-check-input"
                urgency="high"
                onChange={setUrgency}
                type="radio"
                name="urgency"
              />
              high
            </label>
        </div>
        <div className="form-group">
          <button onClick={handleMoveLeft} className="button moveTask">
            &#171;
          </button>
          <button onClick={handleMoveRight} className="button moveTask">
            &#187;
          </button>
        </div>
        <div className="form-group">
          <button
            onClick={() => {
              setFormAction("save");
            }}
            className="btn btn-primary button mr-1"
          >
            {collapsed ? "Edit" : "Save"}
          </button>
          {collapsed && (
            <button
              onClick={() => {
                setFormAction("delete");
              }}
              className="btn btn-danger button delete"
            >
              X
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
