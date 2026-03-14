import { useState } from "react";
import { raiseIssue } from "../../services/api";

function RaiseIssue() {
  const [form, setForm] = useState({
    title: "",
    description: ""
  });
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await raiseIssue(form);
    setMessage(res.message);
    setForm({ title: "", description: "" });
  };

  return (
    <main className="main-content sanitization-container">
      <div className="welcome-section">
        <h1>Raise an Issue</h1>
        <p>Report field or technical issues to Admin</p>
      </div>

      <div className="form-card wide">
        <form onSubmit={submit}>
          <div className="form-group">
            <input
              placeholder="Issue Title"
              value={form.title}
              required
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Issue Description"
              rows="6"
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <button className="action-btn red">Submit to Admin</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </main>
  );
}

export default RaiseIssue;
