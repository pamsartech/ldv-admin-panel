import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAngleRight,
  faArrowLeft,
  faArrowRight,
  faCircleCheck,
  faChartLine,
  faBoxArchive,
  faChevronDown,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";

// Tailwind styles for statuses
const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  Paid: "bg-green-100 text-green-700 border border-green-300",
  Failed: "bg-red-100 text-red-700 border border-red-300",
  Refunded: "bg-blue-100 text-blue-700 border border-blue-300",
};

const statusIcons = {
  Pending: faClock,
  Paid: faCheckCircle,
  Failed: faTimesCircle,
  Refunded: faUndo,
};

export default function PaymentDataTable() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("all"); // all, Paid, Refunded
  const [filterMethod, setFilterMethod] = useState("all");
  const [showMethodFilter, setShowMethodFilter] = useState(false);

  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [search, setSearch] = useState("");

  const paymentsPerPage = 8;

  // ---- GET API Call ----
  useEffect(() => {
    axios
      .get("https://la-dolce-vita.onrender.com/api/payment/payment-list")
      .then((res) => {
        const paymentsArray = res.data.data || [];
        console.log("Payment list Response:", res.data);

        // const formatted = paymentsArray.map((item) => ({
        //   id: item._id,
        //   amount: item.orderDetails?.amount || "N/A",
        //   status: item.paymentStatus || "Pending",
        //   transactionId: item.orderDetails?.transactionID || "N/A",
        //   orderId: item.orderDetails?.orderID || "N/A",
        //   email: item.customerDetails?.email || "N/A",
        //   date: item.createdAt ? new Date(item.createdAt) : new Date(),
        //   method: item.orderDetails?.paymentMethod || "N/A",
        // }));

        const formatted = paymentsArray.map((item) => ({
          id: item.payment_id,
          amount: item.amount || "N/A",
          status: item.status || "Pending",
          transactionId: item.transactionId || "N/A",
          orderId: item.orderId || "N/A",
          email: item.email || "N/A",
          date: item.createdAt ? new Date(item.createdAt) : new Date(),
          method: item.method || "N/A",
        }));

        setPayments(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to fetch payments");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading payments...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  // ---- Filtering ----
  let tabFiltered = payments;

  if (activeTab === "Paid")
    tabFiltered = payments.filter((p) => p.status === "Paid");
  if (activeTab === "Refunded")
    tabFiltered = payments.filter((p) => p.status === "Refunded");

  // search logic
  if (search.trim()) {
    const term = search.toLowerCase();
    tabFiltered = tabFiltered.filter(
      (p) =>
        p.status.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.amount.toString().includes(search) ||
        p.id.toString().includes(search)
    );
  }

  const filteredPayments =
    filterMethod === "all"
      ? tabFiltered
      : tabFiltered.filter((p) => p.method === filterMethod);

  // ---- Sorting ----
  const sortedPayments = [...filteredPayments].sort((a, b) =>
    sortOrder === "desc" ? b.date - a.date : a.date - b.date
  );

  // ---- Pagination ----
  const totalPages = Math.ceil(sortedPayments.length / paymentsPerPage);
  const currentPayments = sortedPayments.slice(
    (currentPage - 1) * paymentsPerPage,
    currentPage * paymentsPerPage
  );

  // ---- Row selection ----
  const handleSelectAll = () => {
    if (selectAll) setSelectedRows([]);
    else setSelectedRows(currentPayments.map((p) => p.id));
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id))
      setSelectedRows(selectedRows.filter((r) => r !== id));
    else setSelectedRows([...selectedRows, id]);
  };

  return (
    <div className="p-6">
      {/* Tabs and Filter */}
      <div className="flex justify-between items-center border-2 mb-5 border-gray-300 px-6  rounded-md p-2 relative">
        {/* Tabs Section */}
        <div className="flex gap-6">
          <button
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "all"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faCircleCheck} />
            All
          </button>

          <button
            onClick={() => {
              setActiveTab("Paid");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "Paid"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
            Paid
          </button>

          <button
            onClick={() => {
              setActiveTab("Refunded");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "Refunded"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faUndo} />
            Refunded
          </button>
        </div>

        {/* Filter Dropdown */}
        <div className="flex gap-2 relative">
          <button
            onClick={() => setShowMethodFilter(!showMethodFilter)}
            className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition"
          >
            <img src="/icons/cuida_filter-outline.svg" alt="icon" />
            {filterMethod === "all" ? "All Methods" : filterMethod}
            <FontAwesomeIcon icon={faChevronDown} />
          </button>

          {showMethodFilter && (
            <div className="absolute right-0 top-12 w-48 bg-white border rounded-md shadow-md p-2 z-50">
              {["all", "Stripe", "PayPal"].map((method) => (
                <button
                  key={method}
                  onClick={() => {
                    setFilterMethod(method);
                    setCurrentPage(1);
                    setShowMethodFilter(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                    filterMethod === method ? "font-medium text-black" : ""
                  }`}
                >
                  {method === "all" ? "All Methods" : method}
                </button>
              ))}
            </div>
          )}

          {/* Sort Button */}
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition"
          >
            <img src="/icons/flowbite_sort-outline.svg" alt="icon" />
            Sort by Date {sortOrder === "desc" ? "↓" : "↑"}
          </button>
        </div>
      </div>

      {/* search bar code */}
      <div className="flex gap-2  relative my-5">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-3 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Transaction ID</th>
              <th className="p-3">Order ID</th>
              <th className="p-3">Email</th>
              <th className="p-3">Date</th>
              <th className="p-3">Method</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(p.id)}
                      onChange={() => handleSelectRow(p.id)}
                    />
                  </td>
                  <td className="p-3">{p.amount}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[p.status]
                      }`}
                    >
                      {/* <FontAwesomeIcon icon={statusIcons[p.status]} /> */}
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">{p.transactionId}</td>
                  <td className="p-3">{p.orderId}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.date.toLocaleString()}</td>
                  <td className="p-3">{p.method}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => navigate(`/view-payment/${p.id}`)}>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-6 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Previous
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 border rounded ${
              currentPage === idx + 1 ? "bg-black text-white" : ""
            }`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 md:w-3xl lg:w-3xl border-1 rounded-lg px-2 mt-6 mx-auto">
        <div className="bg-white border-r-1 border-gray-400 shadow p-6 text-center">
          <h3 className="text-gray-800 text-xl">Total revenue</h3>
          <p className="md:text-md lg:text-2xl font-medium mt-2">€28000</p>
        </div>

        <div className="bg-white col-span-2 shadow p-6 border-r-1 border-gray-400 text-center">
          <h3 className="text-gray-800 text-xl">Outstanding payments</h3>
          <p className="md:text-md lg:text-2xl font-medium mt-2">37 (€540)</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-gray-800 text-xl">Refunds</h3>
          <p className="md:text-md lg:text-2xl font-medium mt-2">€178</p>
        </div>
      </div>
    </div>
  );
}
