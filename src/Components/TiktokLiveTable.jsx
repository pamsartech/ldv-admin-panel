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
  faChevronDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

export default function TiktokLiveTable() {
  const navigate = useNavigate();

  const [liveData, setLiveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const itemsPerPage = 10;

  // ---- Fetch live events ----
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://dev-api.payonlive.com/api/event/event-list"
        );

        const eventsArray = res.data.data || [];

        const formatted = eventsArray.map((item) => ({
          id: item._id,
          name: item.eventDetails?.eventName || "N/A",
          sessionID: item.eventDetails?.sessionID || "N/A",
          start: item.eventDetails?.startDateTime
            ? new Date(item.eventDetails.startDateTime).toLocaleString()
            : "N/A",
          end: item.eventDetails?.endDateTime
            ? new Date(item.eventDetails.endDateTime).toLocaleString()
            : "N/A",
          status: item.eventDetails?.status
            ? item.eventDetails.status.charAt(0).toUpperCase() +
              item.eventDetails.status.slice(1).toLowerCase()
            : "Inactive",
        }));

        setLiveData(formatted);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch live events");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  // ---- Filtering & Sorting Logic ----
  let tabFilteredData = liveData;
  if (activeTab === "active")
    tabFilteredData = liveData.filter((e) => e.status === "Active");

  if (search.trim()) {
    tabFilteredData = tabFilteredData.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.sessionID.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toString().includes(search)
    );
  }

  const filteredData =
    selectedStatus !== "All"
      ? tabFilteredData.filter((e) => e.status === selectedStatus)
      : tabFilteredData;

  // const sortedData = [...filteredData].sort((a, b) =>
  //   sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  // );
  // ---- Sort by Date (start date) ----
const sortedData = [...filteredData].sort((a, b) => {
  const dateA = new Date(a.start);
  const dateB = new Date(b.start);
  return sortAsc ? dateA - dateB : dateB - dateA;
});


  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirst, indexOfLast);

  // ---- Select Logic ----
  const handleSelectAll = () => {
    if (selectAll) setSelectedRows([]);
    else setSelectedRows(currentData.map((item) => item.id));
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id))
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    else setSelectedRows([...selectedRows, id]);
  };

  // ---- Bulk Delete ----
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one event to delete.");
      return;
    }
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      // Example API endpoint – replace with your actual delete API
      await axios.post(
        "https://dev-api.payonlive.com/api/event/bulk-delete",
        {
        event_ids: selectedRows,
        }
      );

      setLiveData((prev) =>
        prev.filter((item) => !selectedRows.includes(item.id))
      );

      setSelectedRows([]);
      setSelectAll(false);
      setOpenConfirm(false);
    } catch (error) {
      console.error("Error deleting events:", error);
      alert("Failed to delete selected events.");
    } finally {
      setDeleting(false);
    }
  };

   const handleFilterSelect = (status) => {
    setSelectedStatus(status);
    setShowFilter(false);
    setCurrentPage(1);
  };

  const handleCloseConfirm = () => setOpenConfirm(false);

  // ---- Status Styling ----
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600 border border-green-400";
      case "Inactive":
        return "bg-orange-100 text-orange-600 border border-orange-400";
      case "About to come":
        return "bg-blue-100 text-blue-600 border border-blue-400";
      case "Suspended":
        return "bg-red-100 text-red-600 border border-red-400";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-400";
    }
  };

  // ---- Skeleton ----
  const skeletonRows = Array.from({ length: itemsPerPage }).map((_, i) => (
    <tr key={i} className="border-b">
      {Array.from({ length: 7 }).map((__, j) => (
        <td key={j} className="p-3">
          <Skeleton variant="rounded" width={80} height={35} />
        </td>
      ))}
    </tr>
  ));

  return (
    <div>
      {/* Tabs & Filters (same as before) */}

      <div className="flex justify-between items-center border-2 border-gray-300 px-6 mt-5 rounded-md p-2 mx-6 relative">
        {/* Tabs */}
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
              setActiveTab("active");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "active"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faChartLine} />
            Active
          </button>
        </div>

        {/* Filter & Sort */}
        <div className="flex gap-2 relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition"
          >
            <img src="/icons/cuida_filter-outline.svg" alt="icon" />
            {selectedStatus === "All" ? "Filter" : selectedStatus}
            <FontAwesomeIcon icon={faChevronDown} />
          </button>

          {showFilter && (
            <div className="absolute right-0 top-12 w-48 bg-white border rounded-md shadow-md p-2 z-50">
              {["All", "Active", "Inactive", "About to come", "Suspended"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterSelect(status)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                      selectedStatus === status ? "font-medium text-black" : ""
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          )}

          {/* <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition"
          >
            <img src="/icons/flowbite_sort-outline.svg" alt="icon" />
            Sort {sortAsc ? "A → Z" : "Z → A"}
          </button> */}

          <button
  onClick={() => setSortAsc(!sortAsc)}
  className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition"
>
  <img src="/icons/flowbite_sort-outline.svg" alt="icon" />
  Sort by Date 
  {/* {sortAsc ? "Oldest → Newest" : "Newest → Oldest"} */}
</button>


           {/* Bulk Delete button */}
          <button
            onClick={handleBulkDelete}
            disabled={selectedRows.length === 0 || deleting}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-white transition ${
              selectedRows.length === 0 || deleting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {deleting ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <>
                <FontAwesomeIcon icon={faTrash} />
                Delete Selected ({selectedRows.length})
              </>
            )}
          </button>
        </div>
      </div>

      {/* search bar code */}
      <div className="flex gap-2 mx-6 relative mt-5">
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
      <div className="p-6">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    disabled={loading}
                  />
                </th>
                <th className="p-3">Event Name</th>
                <th className="p-3">Session ID</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                skeletonRows
              ) : currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                      />
                    </td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.sessionID}</td>
                    <td className="p-3">{item.start}</td>
                    <td className="p-3">{item.end}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-left">
                      <button
                        onClick={() =>
                          navigate(`/user/live-event-detail/${item.id}`)
                        }
                      >
                        <FontAwesomeIcon icon={faAngleRight} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No events found for selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (unchanged) */}
        <div className="flex justify-center items-center space-x-2 mt-4">
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

      {/* ✅ Confirmation Modal */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{selectedRows.length}</strong> selected event(s)? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
