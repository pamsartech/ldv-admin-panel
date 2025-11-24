import React, { useRef, useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
// import TopButton from "../Components/TopButton";
import { useNavigate } from "react-router-dom";
import OrdersDataTable from "../Components/OrderDataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faUpload,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../Components/AlertContext";


function Orders() {
  const navigate = useNavigate();
   const { showAlert } = useAlert(); // ✅ useAlert context

  // Export state
  const [exporting, setExporting] = useState(false);

  // Import state
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0); // 0-100
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (importResult?.failedOrders?.length > 0) {
      setFadeOut(false);
      const fadeTimer = setTimeout(() => setFadeOut(true), 9000); // start fade after 2.5s
      const removeTimer = setTimeout(() => setImportResult(null), 9000); // remove after 3s

      return () => {
        clearTimeout(fadeTimer);
      };
    }
  }, [importResult]);

  // Click handler for export - downloads file returned from server
  const handleExport = async () => {
    try {
      setExporting(true);

      const payload =
        selectedOrders.length > 0
          ? { orderIds: selectedOrders }
          : { orderIds: [] };

      const response = await axios.post(
        "https://dev-api.payonlive.com/api/order/export-orders",
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
      link.download = "orders_export.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      showAlert("Commandes exportées avec succès", "succès")
    } catch (error) {
      console.error("❌ Error exporting orders:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      alert("Failed to export orders");
    } finally {
      setExporting(false);
    }
  };

  // Called when file input changes
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // optional client-side validation
    const allowed = [".xlsx", ".xls", ".csv"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      alert("Veuillez télécharger un fichier .xlsx, .xls ou .csv");
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
      setImportResult(null);
      setImporting(true);

      const url = "https://dev-api.payonlive.com/api/order/import-orders"; // update as needed
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
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
        showAlert(
          `Importation terminée:succès: ${response.data.successCount} , échoué: ${response.data.failedCount} .`,"succès"
        );
      } else {
        showAlert(""+ response.data?.message, "info")
        setImportError(
          response.data?.message || "Échec de l'importation - réponse inconnue"
        );
        console.warn("L'importation a renvoyé un indicateur de réussite erroné :", response.data);
      }
    } catch (err) {
      console.error("Import failed:", err);
      // try more informative message
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Importation a échoué";
        showAlert(message, "erreur");
      // setImportError(message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <Navbar heading="Gestion des commandes" />

      {/* my order panel */}
      <div className="flex items-center justify-between px-6 mt-5 pb-3">
        {/* Left Section - Title */}
        <h2 className="text-lg font-semibold text-gray-800"> Mes commandes </h2>

        {/* Right Section - Buttons */}
        <div className="flex items-center gap-2">
          {/* Import Input (File Upload) */}
          <label
            className={`flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer ${
              importing ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <FontAwesomeIcon icon={faDownload} className="text-gray-600" />
            {importing ? "Importer..." : "Importer"}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              disabled={importing}
            />
          </label>

          {/* Export Button (wired to API) */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
            disabled={exporting}
          >
            <FontAwesomeIcon icon={faUpload} className="text-gray-600" />
            {exporting ? "Exporter..." : "Exporter"}
          </button>

          {/* Add Product Button */}
          <button
            onClick={() => navigate("/user/create-order")}
            className="flex items-center gap-2 bg-[#02B978] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#04D18C] transition"
          >
            <FontAwesomeIcon icon={faPlus} className="text-white" />
            Ajouter une commande
          </button>
        </div>
      </div>

      {/* Show failed orders details (if any) */}
      {importResult?.failedOrders && importResult.failedOrders.length > 0 && (
        <div
          className={`p-2 mx-2 bg-white rounded shadow mt-3 transition-opacity duration-500 ease-in-out ${
            fadeOut
              ? "opacity-0 translate-y-[-10px] h-0 p-0 m-0 overflow-hidden"
              : "opacity-100 translate-y-0"
          }`}
        >
          <h4 className="font-medium mb-2">Failed Orders ({importResult.failedOrders.length})</h4>
          <div className="text-xs text-gray-700 space-y-2 max-h-48 overflow-auto">
            {importResult.failedOrders.map((f, idx) => (
              <div key={idx} className="border-b pb-2">
                <div>
                  <strong>{f.customerName || f.orderKey}</strong>
                </div>
                <div className="text-gray-600">E-mail: {f.email}</div>
                <div className="text-red-600">Erreur: {f.error}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <OrdersDataTable onSelectionChange={setSelectedOrders} />
    </div>
  );
}

export default Orders;

