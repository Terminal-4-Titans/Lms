import React, { useState } from "react";
import ReturnBook from "./ReturnBook";
import NotReturnedBooks from "./NotReturnedBooks";
import OverdueBooks from "./OverdueBooks";

function ReturnBookModule() {
  const [tab, setTab] = useState("returnBook");

  const innerBtnStyle = {
    padding: "10px 20px",
    marginRight: "10px",
    marginBottom: "20px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px"
  };

  return (
    <div style={{ padding: "10px" }}>
      <h2>Return Book Module</h2>

      <button style={innerBtnStyle} onClick={() => setTab("returnBook")}>
        Return Book
      </button>


      {tab === "returnBook" && <ReturnBook />}
      {tab === "notReturned" && <NotReturnedBooks />}
      {tab === "overdueBooks" && <OverdueBooks />}
    </div>
  );
}

export default ReturnBookModule;