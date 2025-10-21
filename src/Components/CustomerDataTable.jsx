import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faArrowLeft,
  faArrowRight,
  faFilter,
  faUpDown,
  faSearch,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export default function CustomersTable() {
  const navigate = useNavigate();

  // API data
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // table state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  // ---- GET API call ----
  useEffect(() => {
    axios
      .get("http://dev-api.payonlive.com/api/user/customer-list") // <-- your API endpoint
      .then((res) => {
        console.log("API Response:", res.data);
        const customersArray = res.data.data || [];

        // format data if needed
        const formatted = customersArray.map((item) => ({
          id: item._id,
          customerCode: item.customerCode,
          name: item.customerName || "N/A",
          spend: item.totalSpend ? `€${item.totalSpend}` : "€0",
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "N/A",
          email: item.email || "N/A",
          orders: item.orders || 0,
          status: item.status || "Deactive",
        }));

        setCustomersData(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to fetch customers");
        setLoading(false);
      });
  }, []);

  // ---- Filtering + Sorting + Search ----
  const filteredData = useMemo(() => {
    let data = [...customersData];

    // search
    if (search.trim()) {
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.id.toString().includes(search)
      );
    }

    // filter by status
    if (filterStatus !== "All") {
      data = data.filter((c) => c.status === filterStatus);
    }

    // sort
    if (sortField) {
      data.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === "spend") {
          valA = parseFloat(valA.replace("€", ""));
          valB = parseFloat(valB.replace("€", ""));
        }
        if (sortField === "orders") {
          valA = Number(valA);
          valB = Number(valB);
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [customersData, search, filterStatus, sortField, sortOrder]);

  // ---- Pagination ----
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentRows = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, filteredData.length);

  // toggle sort
  const handleSort = (field) => {
    if (sortField === field) setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (loading) return <p className="p-6">Loading customers...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div>
      {/* filter bar */}
      <div className="flex gap-2 mx-6 relative mt-2">
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

        {/* Filter dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 border border-gray-400 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faFilter} />
            Filter
            <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
          </button>

          {showFilter && (
            <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow-lg z-10">
              {["All", "Active", "Deactive"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setShowFilter(false);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    filterStatus === status ? "bg-gray-200 font-medium" : ""
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort button */}
        <button
          className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
          onClick={() => handleSort("spend")}
        >
          <FontAwesomeIcon icon={faUpDown} />
          Sort
        </button>
      </div>

      {/* customer data table */}
      <div className="p-6 bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-gray-600">
              <th className="py-3 px-3">Customer ID</th>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Total Spend</th>
              <th className="py-3 px-3">Date Joined</th>
              <th className="py-3 px-3">Email</th>
              <th className="py-3 px-3">Total Orders</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{customer.customerCode}</td>
                  <td className="py-3 px-3">{customer.name}</td>
                  <td className="py-3 px-3">{customer.spend}</td>
                  <td className="py-3 px-3">{customer.date}</td>
                  <td className="py-3 px-3">{customer.email}</td>
                  <td className="py-3 px-3">{customer.orders}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-3 text-center py-1 rounded-xl text-sm font-medium ${
                        customer.status === "Active"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-500 cursor-pointer">
                    <button onClick={() => navigate(`/user/view-customer/${customer.id}` , { state: customer })}>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500 italic">
                  No matching results
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination + Info */}
        <div className="flex flex-col md:flex-row justify-center items-center mt-4 text-sm text-gray-600 gap-3">
          <p className="px-2">
            Showing <span className="font-medium">{startIndex}</span>–
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{filteredData.length}</span> customers
          </p>

          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-3 py-1 border rounded ${
                  currentPage === index + 1
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
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
        </div>
      </div>
    </div>
  );
}
