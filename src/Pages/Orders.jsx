import React, { useRef, useState } from "react";
import Navbar from "../Components/Navbar";
// import TopButton from "../Components/TopButton";
import { useNavigate } from "react-router-dom";
import OrdersDataTable from "../Components/OrderDataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faUpload, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Orders() {
  const navigate = useNavigate();

  // Export state
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  // Import state
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0); // 0-100
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);

  // Click handler for export - downloads file returned from server
  const handleExport = async () => {
    try {
      console.log("Export triggered");
      setExportError(null);
      setExporting(true);

      const url = "https://la-dolce-vita.onrender.com/api/order/export-orders"; // update as needed

      const response = await axios.get(url, {
        responseType: "blob",
      });

      console.log("Export API response headers:", response.headers);

      let filename = "orders_export.xlsx";
      const disposition = response.headers["content-disposition"];
      if (disposition) {
        const filenameMatch = disposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) filename = filenameMatch[1];
      }

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);

      console.log("Export download started:", filename);
    } catch (err) {
      console.error("Export failed:", err);
      setExportError("Failed to export orders. See console for details.");
    } finally {
      setExporting(false);
    }
  };

  // Called when file input changes
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // optional client-side validation
    const allowed = [ ".xlsx", ".xls", ".csv" ];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      alert("Please upload an .xlsx, .xls or .csv file");
      e.target.value = "";
      return;
    }

    // auto-start import (or prompt user)
    await uploadImportFile(file);
    // reset input so same file can be uploaded again if needed
    e.target.value = "";
  };

  // Upload file to backend import endpoint
  const uploadImportFile = async (file) => {
    try {
      console.log("Import initiated for file:", file.name);
      setImportError(null);
      setImportResult(null);
      setImporting(true);
      setImportProgress(0);

      const url = "https://la-dolce-vita.onrender.com/api/order/import-orders"; // update as needed
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setImportProgress(percent);
            console.log("Import upload progress:", percent, "%");
          }
        },
        timeout: 120000, // 2 min (increase if you expect very large files)
      });

      console.log("Import API response:", response.data);

      if (response.data && response.data.success) {
        setImportResult(response.data);
        // show success toast / message
        console.log(`Import completed: ${response.data.successCount} successes, ${response.data.failedCount} failed.`);
      } else {
        setImportError(response.data?.message || "Import failed - unknown response");
        console.warn("Import returned false success flag:", response.data);
      }
    } catch (err) {
      console.error("Import failed:", err);
      // try more informative message
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Import failed";
      setImportError(message);
    } finally {
      setImporting(false);
      setImportProgress(0);
    }
  };

  return (
    <div>
      <Navbar heading="Order Management" />

      {/* my order panel */}
      <div className="flex items-center justify-between px-6 mt-5 pb-3">
        {/* Left Section - Title */}
        <h2 className="text-lg font-semibold text-gray-800"> My Order </h2>

        {/* Right Section - Buttons */}
        <div className="flex items-center gap-2">
          {/* Import Input (File Upload) */}
          <label
            className={`flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer ${
              importing ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <FontAwesomeIcon icon={faDownload} className="text-gray-600" />
            {importing ? "Importing..." : "Import"}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              disabled={importing}
            />
          </label>

          {/* Import progress / result info */}
          {importing && (
            <div className="text-sm text-gray-600 ml-2">
              Uploading: {importProgress}% 
            </div>
          )}
          {importResult && (
            <div className="ml-2 text-sm text-green-600">
              Imported: {importResult.successCount} | Failed: {importResult.failedCount}
            </div>
          )}
          {importError && (
            <div className="ml-2 text-sm text-red-600">
              Import error: {importError}
            </div>
          )}

          {/* Export Button (wired to API) */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
            disabled={exporting}
          >
            <FontAwesomeIcon icon={faUpload} className="text-gray-600" />
            {exporting ? "Exporting..." : "Export"}
          </button>

          {/* Export error message (simple inline) */}
          {exportError && (
            <span className="text-red-500 text-sm ml-2">{exportError}</span>
          )}

          {/* Add Product Button */}
          <button
            onClick={() => navigate("/user/create-order")}
            className="flex items-center gap-2 bg-[#02B978] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#04D18C] transition"
          >
            <FontAwesomeIcon icon={faPlus} className="text-white" />
            Add Order
          </button>
        </div>
      </div>

      {/* Show failed orders details (if any) */}
      {importResult?.failedOrders && importResult.failedOrders.length > 0 && (
        <div className="p-4 mx-6 bg-white rounded shadow mt-3">
          <h4 className="font-medium mb-2">Failed Orders ({importResult.failedOrders.length})</h4>
          <div className="text-xs text-gray-700 space-y-2 max-h-48 overflow-auto">
            {importResult.failedOrders.map((f, idx) => (
              <div key={idx} className="border-b pb-2">
                <div><strong>{f.customerName || f.orderKey}</strong></div>
                <div className="text-gray-600">Email: {f.email}</div>
                <div className="text-red-600">Error: {f.error}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <OrdersDataTable />
    </div>
  );
}

export default Orders;

