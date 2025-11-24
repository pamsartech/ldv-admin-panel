import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";

import DataTable from "../Components/ProductDataTable";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faUpload,
  faPlus,
  faBoxArchive,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAlert } from "../Components/AlertContext";
useAlert
function Products() {
  const navigate = useNavigate();
  const { showAlert } = useAlert(); // ✅ useAlert context

  const [bestSelling, setBestSelling] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [importMessage, setImportMessage] = useState("");
   const [selectedProduct, setSelectedPrducts] = useState([]);
    const [exporting, setExporting] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

  // Fetch best-selling products
  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const res = await axios.get(
          "https://dev-api.payonlive.com/api/product/best-selling"
        );
        setBestSelling(res.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBestSelling();
  }, []);

  // Fetch recent products
  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const res = await axios.get(
          "https://dev-api.payonlive.com/api/product/latest-products"
        );
        setRecentProducts(res.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecentProducts();
  }, []);

  // message
  useEffect(() => {
        if (importMessage.length > 0) {
          setFadeOut(false);
          const fadeTimer = setTimeout(() => setFadeOut(true), 4000); // start fade after 2.5s
    
          return () => {
            clearTimeout(fadeTimer);
          };
        }
      }, [importMessage]);

  
  // ✅ Handle Product Import
const handleImport = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  setImportMessage("Importer des produits... ⏳");

  try {
    const res = await axios.post(
      "https://dev-api.payonlive.com/api/product/import-products",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("Import response:", res.data);

    const data = res.data;

    // ---------------------------------------------
    // SUCCESS RESPONSE HANDLING
    // ---------------------------------------------
    if (data.success) {
      // Build detailed success summary
      const summaryText =
        `Importation terminée avec succès!\n\n` +
        `Total Rangées: ${data.summary.totalRows}\n` +
        `Inséré: ${data.summary.insertedToDatabase}\n` +
        `Doublons ignorés: ${data.summary.duplicatesSkipped}\n` +
        `Erreurs de traitement: ${data.summary.processingErrors}\n` +
        `Erreurs d'insertion: ${data.summary.insertionErrors}\n`;

      // Show SUCCESS alert
      showAlert(summaryText, "succès");

      // Also update the small message on top
      setImportMessage(
        `✅ Importé: ${data.summary.insertedToDatabase} / ${data.summary.totalRows} • Doublons: ${data.summary.duplicatesSkipped}`
      );
    }

    // ---------------------------------------------
    // INSERTION ERRORS (product code errors)
    // ---------------------------------------------
    if (data.details?.insertionErrors?.length > 0) {
      let errorText = "Certains produits n'ont pas pu être importés.:\n\n";

      data.details.insertionErrors.forEach((item) => {
        errorText += `• ${item.productCode} → ${item.message}\n`;
      });

      // Show ERROR alert
      showAlert(errorText, "info");
    }
  } catch (err) {
    console.error("Import error:", err);

    // Show backend message or fallback error
    showAlert(
      err.response?.data?.message || "❌ Error importing products.",
      "erreyr"
    );

    setImportMessage("❌Importation a échoué.");
  }
};

 

    // Click handler for export - downloads file returned from server
    const handleExport = async () => {
      try {
        setExporting(true);
  
         const payload =
          selectedProduct.length > 0 ? { productIds: selectedProduct } : {productIds:[]};
  
        const response = await axios.post(
          "https://dev-api.payonlive.com/api/product/export-products",
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
        link.download = "products_export.xlsx";
        document.body.appendChild(link);
        link.click();
        link.remove();
        showAlert("Produits exportés avec succès", "succès")
      } catch (error) {
        console.error("❌ Error exporting products:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
        showAlert("Échec de l'exportation des produits.", "erreur");
      } finally {
        setExporting(false);
      }
    };

  return (
    <div>
      <Navbar heading="Gestion des produits " />

      <div className="flex items-center justify-between px-6 mt-5 pb-3">
        <h2 className="text-lg font-semibold text-gray-800"> Mes produits </h2>

        <div className="flex items-center gap-2">
          {/* Import Button */}
            <label className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer">
                     <FontAwesomeIcon icon={faDownload} className="text-gray-600" />
                     Importer
                     <input
                       type="file"
                       accept=".xlsx,.xls"
                       className="hidden"
                       onChange={handleImport}
                     />
                   </label>

         
          {/* Export Button (keep as is for now) */}
                   <button
                     onClick={handleExport}
                     disabled={exporting}
                     className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                   >
                     <FontAwesomeIcon icon={faUpload} className="text-gray-600" />
                     {exporting ? "Exporter..." : "Exporter"}
                   </button>

          {/* Add Product */}
          <button
            onClick={() => navigate("/user/add-product")}
            className="flex items-center gap-2 bg-[#02B978] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#04D18C] transition"
          >
            <FontAwesomeIcon icon={faPlus} className="text-white" />
            Ajouter un produit
          </button>
        </div>
      </div>

     
       {/* Import Summary */}
      {importMessage && (
        <p
          // className="px-6 text-sm text-gray-700 mt-2"
          className={`p-2 mx-2 bg-white rounded shadow mt-3 transition-opacity duration-500 ease-in-out ${
            fadeOut
              ? "opacity-0 translate-y-[-10px] h-0 p-0 m-0 overflow-hidden"
              : "opacity-100 translate-y-0"
          }`}
        >
          {importMessage}
        </p>
      )}

     <DataTable onSelectionChange={setSelectedPrducts} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Best Selling Products */}
        <div className="p-5 shadow-lg border border-gray-400 rounded-xl bg-white ">
          <h3 className="text-lg font-semibold mb-4">Produits les plus vendus</h3>
          <ul className="space-y-4">
            {bestSelling.map((product, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={product.productImages?.[0]}
                    alt={product.productCategory || "Product"}
                    className=" w-10 h-10 border-1 rounded-lg border-gray-400"
                  />
                  <div>
                    <p className="font-medium">
                      {product.productName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.productCode || "N/A"}
                    </p>
                  </div>
                </div>
                <span className="font-semibold">
                  {product.salesStats?.totalQuantitySold || 0}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recently Added Products */}
        <div className="p-5 shadow-lg border border-gray-400 rounded-xl bg-white ">
          <h3 className="text-lg font-semibold mb-4">Produits récemment ajoutés</h3>
          <ul className="space-y-4">
            {recentProducts.map((product, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={product.images?.[0]}
                    alt={product.productName || "Product"}
                    className=" w-10 h-10 border-1 rounded-lg border-gray-400"
                  />
                  <div>
                    <p className="font-medium">{product.productName || "N/A"}</p>
                    <p className="text-sm text-gray-500">
                      {product.productCode || "N/A"}
                    </p>
                  </div>
                </div>
                <span className="font-semibold">€{product.price.toFixed(2) || 0}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Products;
