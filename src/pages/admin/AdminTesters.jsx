import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminTesters = () => {
  const [testers, setTesters] = useState([]);
  const [name, setName] = useState("");

  const loadTesters = async () => {
    const res = await axios.get(
      "https://sabriaz-backend.onrender.com/api/testers"
    );
    setTesters(res.data);
  };

  const addTester = async () => {
    if (!name.trim()) return alert("Enter tester name");

    await axios.post("https://sabriaz-backend.onrender.com/api/testers", {
      name,
    });
    setName("");
    loadTesters();
  };

  const deleteTester = async (id) => {
    await axios.delete(
      `https://sabriaz-backend.onrender.com/api/testers/${id}`
    );
    loadTesters();
  };

  useEffect(() => {
    loadTesters();
  }, []);

  return (
    <div className="p-8 pt-24">
      <h1 className="text-2xl font-bold mb-4">Manage Tester Perfumes</h1>

      {/* ADD NEW */}
      <div className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter tester name"
          className="border p-2 rounded w-64"
        />
        <button
          onClick={addTester}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Tester Name</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {testers.map((t) => (
            <tr key={t._id} className="border-b">
              <td className="p-3">{t.name}</td>

              <td className="p-3">
                <button
                  onClick={() => deleteTester(t._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTesters;
