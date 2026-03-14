import { useState } from "react";
import { submitDamage } from "../../services/api";

function SubmitDamage() {
  const [form, setForm] = useState({
    wasteType: "",
    address: ""
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");

    const res = await submitDamage(form);

    if (res.message) {
      setMessage(res.message);
      setForm({ wasteType: "", address: "" });
    } else {
      setMessage("Submission failed");
    }
  };

  return (
    <main className="main-content citizen-container">
      <div className="welcome-section">
        <h1>Submit Request for Repair</h1>
        <p>Enter the damage type and location</p>
      </div>

      <div className="form-card wide">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Damage Type *</label>
            <input
              required
              placeholder="Enter your request here"
              value={form.wasteType}
              onChange={(e) =>
                setForm({ ...form, wasteType: e.target.value })
              }
            >

            </input>

          </div>

          <div className="form-group">
            <label>Location Address *</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </div>

          <button className="action-btn">Submit for Validation</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </main>
  );
}

export default SubmitDamage;
