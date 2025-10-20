import React, { useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import CustomersTable from "../Components/CustomerDataTable";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faUpload, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Customers() {
  const navigate = useNavigate();

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);

  // ----- EXPORT FUNCTION -----
  const handleExport = async () => {
    try {
      setExportError(null);
      setExporting(true);

      const url = "http://dev-api.payonlive.com/api/user/export-customer";
      const response = await axios.get(url, { responseType: "blob" });

      let filename = "customers_export.xlsx";
      const disposition = response.headers["content-disposition"];
      if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Export failed:", err);
      setExportError("Failed to export customers.");
    } finally {
      setExporting(false);
    }
  };

  // ----- IMPORT HANDLERS -----
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [".xlsx", ".xls", ".csv"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      alert("Please upload an .xlsx, .xls or .csv file");
      e.target.value = "";
      return;
    }

    await uploadImportFile(file);
    e.target.value = "";
  };

  const uploadImportFile = async (file) => {
    try {
      console.log("Import initiated for file:", file.name);
      setImportError(null);
      setImportResult(null);
      setImporting(true);
      setImportProgress(0);

      const url = "http://dev-api.payonlive.com/api/user/import-customer";

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setImportProgress(percent);
            console.log("Import upload progress:", percent, "%");
          }
        },
        timeout: 120000,
      });

      console.log("Import API response:", response.data);

      if (response.data && response.data.success) {
        const data = response.data;

        // Map failed and duplicate rows for frontend display
        const failedCustomers = data.details.failed.map((f) => ({
          name: f.data["Customer Name"] || f.data.customerName,
          email: f.data["Email"] || f.data.email,
          error: f.reason,
        }));

        const duplicateCustomers = data.details.duplicates.map((d) => ({
          name: d.data["Customer Name"] || d.data.customerName,
          email: d.data["Email"] || d.data.email,
          error: d.reason,
        }));

        setImportResult({
          total: data.summary.total,
          successful: data.summary.successful,
          failed: data.summary.failed,
          duplicates: data.summary.duplicates,
          failedCustomers,
          duplicateCustomers,
        });

        console.log(
          `Import completed: ${data.summary.successful} successes, ${data.summary.failed} failed, ${data.summary.duplicates} duplicates.`
        );
      } else {
        setImportError(response.data?.message || "Import failed - unknown response");
        console.warn("Import returned false success flag:", response.data);
      }
    } catch (err) {
      console.error("Import failed response:", err.response?.data || err);
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
      <Navbar heading="Customer Management" />

      <div className="flex items-center justify-between px-6 mt-5 pb-3">
        <h2 className="text-lg font-semibold text-gray-800">Customers</h2>

        <div className="flex items-center gap-2">
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

          {importing && (
            <div className="text-sm text-gray-600 ml-2">
              Uploading: {importProgress}%
            </div>
          )}

          {/* {importResult && (
            <div className="ml-2 text-sm">
              <div className="text-green-600">
                Imported successfully: {importResult.successful} / {importResult.total}
              </div>

              {importResult.failed > 0 && (
                <div className="text-red-600 mt-1">
                  Failed: {importResult.failed}
                </div>
              )}

              {importResult.duplicates > 0 && (
                <div className="text-yellow-600 mt-1">
                  Duplicates: {importResult.duplicates}
                </div>
              )}
            </div>
          )} */}

          {importError && (
            <div className="ml-2 text-sm text-red-600">Import error: {importError}</div>
          )}

          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
            disabled={exporting}
          >
            <FontAwesomeIcon icon={faUpload} className="text-gray-600" />
            {exporting ? "Exporting..." : "Export"}
          </button>

          {exportError && (
            <span className="text-red-500 text-sm ml-2">{exportError}</span>
          )}

          <button
            onClick={() => navigate("/create-customer")}
            className="flex items-center gap-2 bg-[#02B978] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#04D18C] transition"
          >
            <FontAwesomeIcon icon={faPlus} className="text-white" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Failed Customers Details */}
      {importResult?.failedCustomers && importResult.failedCustomers.length > 0 && (
        <div className="p-4 mx-6 bg-white rounded shadow mt-3">
          <h4 className="font-medium mb-2">
            Failed Customers ({importResult.failedCustomers.length})
          </h4>
          <div className="text-xs text-gray-700 space-y-2 max-h-48 overflow-auto">
            {importResult.failedCustomers.map((f, idx) => (
              <div key={idx} className="border-b pb-2">
                <div><strong>{f.name}</strong></div>
                <div>Email: {f.email}</div>
                <div className="text-red-600">Error: {f.error}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duplicate Customers Details */}
      {importResult?.duplicateCustomers && importResult.duplicateCustomers.length > 0 && (
        <div className="p-4 mx-6 bg-white rounded shadow mt-3">
          <h4 className="font-medium mb-2">
            Duplicate Customers ({importResult.duplicateCustomers.length})
          </h4>
          <div className="text-xs text-gray-700 space-y-2 max-h-48 overflow-auto">
            {importResult.duplicateCustomers.map((d, idx) => (
              <div key={idx} className="border-b pb-2">
                <div><strong>{d.name}</strong></div>
                <div>Email: {d.email}</div>
                <div className="text-yellow-600">Error: {d.error}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CustomersTable />
    </div>
  );
}

export default Customers;
