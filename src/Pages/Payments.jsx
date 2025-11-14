import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import PaymentDataTable from "../Components/PaymentDataTable";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faUpload,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../Components/AlertContext";

function Payments() {
  const navigate = useNavigate();
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [importResult, setImportResult] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);
  const { showAlert } = useAlert(); // ✅ useAlert context

  // ✅ Handle Import Excel File
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setImportResult({
        success: false,
        message: "Please upload a valid Excel file (.xlsx or .xls)",
      });
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // match multer field name

    try {
      setImporting(true);
      const res = await axios.post(
        "https://dev-api.payonlive.com/api/payment/import-payments",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      showAlert(res.data.message || "Import completed.", "success");

      setImportResult({
        success: true,
        message: res.data.message || "Payments imported successfully!",
        failedPayments: res.data.failedPayments || [],
      });
    } catch (error) {
      console.error("Import error:", error);
      // ❌ ERROR ALERT
      showAlert(
        error.response?.data?.message || "Failed to import payments.",
        "error"
      );

      setImportResult({
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to import payments. Please try again.",
        failedPayments: error.response?.data?.failedPayments || [],
      });
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  // ✅ Auto-fade + remove import result
  useEffect(() => {
    if (importResult) {
      setFadeOut(false);
      const fadeTimer = setTimeout(() => setFadeOut(true), 2500);
      const removeTimer = setTimeout(() => setImportResult(null), 3000);
      return () => {
        clearTimeout(fadeTimer);
      };
    }
  }, [importResult]);

  // ✅ Export Selected Payments
  const handleExport = async () => {
    try {
      setExporting(true);
      const payload =
        selectedPayments.length > 0
          ? { paymentIds: selectedPayments }
          : { paymentIds: [] };

      const response = await axios.post(
        "https://dev-api.payonlive.com/api/payment/export-payments",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        }
      );

      // trigger download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "payments_export.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Error exporting payments:", error);
      setImportResult({
        success: false,
        message: "Failed to export payments",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <Navbar heading="Gestion des paiements" />

      {/* add payments panel */}
      <div className="flex items-center justify-between px-6 mt-5 pb-3">
        <h2 className="text-lg font-semibold text-gray-800">Paiements</h2>

        <div className="flex items-center gap-2">
          {/* Import */}
          <label className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer">
            <FontAwesomeIcon icon={faDownload} className="text-gray-600" />
            {importing ? "Importing..." : "Importer"}
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          {/* Export */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faUpload} className="text-gray-600" />
            {exporting ? "Exporting..." : "Exporter"}
          </button>

          {/* Create Payment */}
          <button
            onClick={() => navigate("/user/create-payment")}
            className="flex items-center gap-2 bg-[#02B978] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#04D18C] transition"
          >
            <FontAwesomeIcon icon={faPlus} className="text-white" />
            Créer un paiement
          </button>
        </div>
      </div>

      {/* ✅ Import Result Block (with fade & collapse) */}
      {importResult && (
        <div
          className={`p-2 mx-2 bg-white rounded shadow mt-3 transition-opacity duration-500 ease-in-out ${
            fadeOut
              ? "opacity-0 translate-y-[-10px] h-0 p-0 m-0"
              : "opacity-100 translate-y-0 p-4"
          }`}
        >
          <h4 className="text-sm font-medium text-gray-800 mb-1">
            {importResult.message}
          </h4>

          {importResult.failedPayments?.length > 0 && (
            <div className="text-xs text-gray-700 space-y-1 max-h-32 overflow-auto">
              {importResult.failedPayments.map((f, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-1">
                  <div>
                    <strong>
                      {f.payment_id || f.customerName || `Payment ${idx + 1}`}
                    </strong>
                  </div>
                  <div className="text-gray-600">
                    Error: {f.error || "Unknown error"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ✅ Data Table */}
      <PaymentDataTable onSelectionChange={setSelectedPayments} />
    </div>
  );
}

export default Payments;
