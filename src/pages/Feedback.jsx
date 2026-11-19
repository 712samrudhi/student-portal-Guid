import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { addFeedback } from "../data/store.js";

export default function Feedback() {
  const { user, module } = useAuth();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    addFeedback({ userId: user.id, module: module?.title, rating, text });
    setText("");
    setDone(true);
  };

  return (
    <div>
      <h2>Feedback Form</h2>
      <form className="card" onSubmit={submit}>
        <label>
          Rating
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} {"★".repeat(n)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Your feedback
          <textarea rows="5" value={text} onChange={(e) => { setText(e.target.value); setDone(false); }} required />
        </label>
        {done && <div className="success">Thank you for your feedback!</div>}
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
