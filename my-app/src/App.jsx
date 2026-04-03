import { useState, useCallback } from "react";
import { DarkContext } from "./context/DarkContext";
import makeStyles from "./utils/makestyles";
import { exportToCSV } from "./utils/helpers";
import SEED_DATA from "./data/seed";
import Sidebar from "./components/sidebar";
import Topbar from "./components/navbar";
import Modal from "./components/modal";
import DashboardPage from "./pages/dashboard";
import TransactionsPage from "./pages/transaction";
import InsightsPage from "./pages/insight";

const loadTransactions = () => {
  try {
    const stored = localStorage.getItem("ledger_tx");
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(SEED_DATA));
  } catch {
    return JSON.parse(JSON.stringify(SEED_DATA));
  }
};
const App = () => {
  const [dark,         setDark]        = useState(() => localStorage.getItem("ledger_dark") === "true");
  const [transactions, setTransactions] = useState(loadTransactions);
  const [role,         setRole]         = useState("admin");
  const [activePage,   setActivePage]   = useState("dashboard");
  const [modal,        setModal]        = useState(null);

  const s = makeStyles(dark);

  const updateTransactions = (updated) => {
    setTransactions(updated);
    localStorage.setItem("ledger_tx", JSON.stringify(updated));
  };

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("ledger_dark", next);
  };

  const handleSave = (form) => {
    if (modal && modal.id) {
      updateTransactions(
        transactions.map((t) => (t.id === modal.id ? { ...t, ...form } : t))
      );
    } else {
      const newId = Math.max(0, ...transactions.map((t) => t.id)) + 1;
      updateTransactions([...transactions, { id: newId, ...form }]);
    }
    setModal(null);
  };

  const handleDelete = useCallback(
    (id) => updateTransactions(transactions.filter((t) => t.id !== id)),
    [transactions]
  );

  return (
    <DarkContext.Provider value={dark}>
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          background: s.bg,
          color: s.text,
          fontFamily: "DM Mono, monospace",
        }}
      >

        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          role={role}
        />

        <div style={{ flex: 1, overflowY: "auto", background: s.bg }}>
          <Topbar
            activePage={activePage}
            role={role}
            onRoleChange={setRole}
            onToggleDark={toggleDark}
            onExport={() => exportToCSV(transactions)}
            onAdd={() => setModal("add")}
          />

          <div style={{ padding: 24 }}>
            {activePage === "dashboard" && (
              <DashboardPage transactions={transactions} />
            )}
            {activePage === "transactions" && (
              <TransactionsPage
                transactions={transactions}
                role={role}
                onEdit={(tx) => setModal(tx)}
                onDelete={handleDelete}
              />
            )}
            {activePage === "insights" && (
              <InsightsPage transactions={transactions} />
            )}
          </div>
        </div>

        {modal && (
          <Modal
            tx={modal === "add" ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </div>
    </DarkContext.Provider>
  );
};

export default App;
