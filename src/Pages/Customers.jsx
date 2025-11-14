import React, { useRef, useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import CustomersTable from "../Components/CustomerDataTable";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faUpload,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../Components/AlertContext";

function Customers() {
  const navigate = useNavigate();
  const { showAlert } = useAlert(); // ✅ useAlert context

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (
      importResult?.failedCustomers?.length > 0 ||
      importResult?.duplicateCustomers?.length > 0
    ) {
      setFadeOut(false);
      const fadeTimer = setTimeout(() => setFadeOut(true), 2500); // start fade after 2.5s
      const removeTimer = setTimeout(() => setImportResult(null), 3000); // remove after 3s

      return () => {
        clearTimeout(fadeTimer);
      };
    }
  }, [importResult]);

  // ----- EXPORT FUNCTION -----
  const handleExport = async () => {
    try {
      setExporting(true);

      // if no user selected, export all
      const payload =
        selectedUsers.length > 0 ? { userIds: selectedUsers } : { userIds: [] };

      console.log("Selected User IDs:", selectedUsers); // ✅ Log before sending

      const response = await axios.post(
        "https://dev-api.payonlive.com/api/user/export-customer",
        payload, // :white_check_mark: Body for POST
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        }
      );

      console.log("Export API Response:", response);

      // ✅ Create and trigger download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "customer_export.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Error exporting customer:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      alert("Failed to export customer");
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

      setImporting(true);

      const url = "https://dev-api.payonlive.com/api/user/import-customer";

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
        // show success alert
        showAlert(
          `Import completed — Total: ${data.summary.total}, Successful: ${data.summary.successful}, Failed: ${data.summary.failed}, Duplicates: ${data.summary.duplicates}`,
          "success"
        );

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
        setImportError(
          response.data?.message || "Import failed - unknown response"
        );
        console.warn("Import returned false success flag:", response.data);
      }
    } catch (err) {
      console.error("Import failed response:", err.response?.data || err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Import failed";
      showAlert(message, "info")
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <Navbar heading="Gestion des clients" />

      <div className="flex items-center justify-between px-6 mt-5 pb-3">
        <h2 className="text-lg font-semibold text-gray-800">Clients</h2>

        <div className="flex items-center gap-2">
          <label
            className={`flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer ${
              importing ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <FontAwesomeIcon icon={faDownload} className="text-gray-600" />
            {importing ? "Importing..." : "Importer"}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              disabled={importing}
            />
          </label>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
            disabled={exporting}
          >
            <FontAwesomeIcon icon={faUpload} className="text-gray-600" />
            {exporting ? "Exporting..." : "Exporter"}
          </button>

          {exportError && (
            <span className="text-red-500 text-sm ml-2">{exportError}</span>
          )}

          <button
            onClick={() => navigate("/user/create-customer")}
            className="flex items-center gap-2 bg-[#02B978] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#04D18C] transition"
          >
            <FontAwesomeIcon icon={faPlus} className="text-white" />
            Ajouter un client
          </button>
        </div>
      </div>

      {/* Failed Customers Details */}
      {importResult?.failedCustomers &&
        importResult.failedCustomers.length > 0 && (
          <div className="p-4 mx-6 bg-white rounded shadow mt-3">
            <h4 className="font-medium mb-2">
              Failed Customers ({importResult.failedCustomers.length})
            </h4>
            <div className="text-xs text-gray-700 space-y-2 max-h-48 overflow-auto">
              {importResult.failedCustomers.map((f, idx) => (
                <div key={idx} className="border-b pb-2">
                  <div>
                    <strong>{f.name}</strong>
                  </div>
                  <div>Email: {f.email}</div>
                  <div className="text-red-600">Error: {f.error}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Duplicate Customers Details */}
      {importResult?.duplicateCustomers &&
        importResult.duplicateCustomers.length > 0 && (
          <div
            // className="p-4 mx-6 bg-white rounded shadow mt-3"
            className={`p-4 mx-6 bg-white rounded shadow mt-3 transition-opacity duration-500 ease-in-out ${
              fadeOut ? "opacity-0" : "opacity-100"
            }`}
          >
            <h4 className="font-medium mb-2">
              Duplicate Customers ({importResult.duplicateCustomers.length})
            </h4>
            <div className="text-xs text-gray-700 space-y-2 max-h-48 overflow-auto">
              {importResult.duplicateCustomers.map((d, idx) => (
                <div key={idx} className="border-b pb-2">
                  <div>
                    <strong>{d.name}</strong>
                  </div>
                  <div>Email: {d.email}</div>
                  <div className="text-yellow-600">Error: {d.error}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      <CustomersTable onSelectionChange={setSelectedUsers} />
    </div>
  );
}

export default Customers;
