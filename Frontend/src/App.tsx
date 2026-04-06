import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  sex: string;
}

// Prioritate: runtime (Docker/K8s) > build-time (Vite dev) > fallback
const apiBaseUrl =
  window.__ENV__?.API_BASE_URL?.startsWith("http")
    ? window.__ENV__.API_BASE_URL
    : (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000");

function FormPage({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    sex: ""
  });
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiBaseUrl}/api/user`, form);
      setMessage(res.data.message);
      setForm({ firstName: "", lastName: "", birthDate: "", sex: "" });
      onSubmitSuccess();
    } catch {
      setMessage("Eroare la trimitere. Verifica conexiunea.");
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Adauga persoane</h2>

        <input
          name="firstName"
          placeholder="Prenume"
          value={form.firstName}
          onChange={handleChange}
        />
        <input
          name="lastName"
          placeholder="Nume"
          value={form.lastName}
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
        />
        <select name="sex" value={form.sex} onChange={handleChange}>
          <option value="">Selecteaza genul</option>
          <option value="M">Masculin</option>
          <option value="F">Feminin</option>
        </select>

        {/* <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
          />
          Sunt de acord cu termenii si conditiile
        </label> */}

        <button onClick={handleSubmit} disabled={loading || !agreed}>
          {loading ? "Se trimite..." : "Salveaza"}
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{message}</h3>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ListPage({ users, loading }: { users: User[]; loading: boolean }) {
  return (
    <div className="page">
      <div className="list-card">
        <h2>Lista persoane inregistrate</h2>

        {loading ? (
          <p className="empty-msg">Se incarca...</p>
        ) : users.length === 0 ? (
          <p className="empty-msg">Nicio persoana inregistrata inca.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Prenume</th>
                <th>Nume</th>
                <th>Data nasterii</th>
                <th>Gen</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td>{new Date(u.birthDate).toLocaleDateString("ro-RO")}</td>
                  <td>
                    <span className={`badge ${u.sex === "M" ? "badge-m" : "badge-f"}`}>
                      {u.sex === "M" ? "Masculin" : "Feminin"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<"form" | "list">("form");
  const [users, setUsers] = useState<User[]>([]);
  const [listLoading, setListLoading] = useState(false);

  const loadUsers = async () => {
    setListLoading(true);
    try {
      const res = await axios.get(`${apiBaseUrl}/api/user`);
      setUsers(res.data);
    } catch {
      // ignoram eroarea daca backend-ul nu e disponibil
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmitSuccess = () => {
    loadUsers();
    setTab("list");
  };

  return (
    <div className="app">
      <div className="tabs">
        <button className={tab === "form" ? "active" : ""} onClick={() => setTab("form")}>
          Adauga persoana
        </button>
        <button className={tab === "list" ? "active" : ""} onClick={() => setTab("list")}>
          Lista persoane ({users.length})
        </button>
      </div>

      {tab === "form" ? (
        <FormPage onSubmitSuccess={handleSubmitSuccess} />
      ) : (
        <ListPage users={users} loading={listLoading} />
      )}
    </div>
  );
}
