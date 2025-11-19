import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAngleRight,
  faArrowLeft,
  faArrowRight,
  faCircleCheck,
  faCheckCircle,
  faUndo,
  faChevronDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Skeleton,
  CircularProgress,
} from "@mui/material";

const statusStyles = {
  enattente: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  payé: "bg-green-100 text-green-700 border border-green-300",
  expédié: "bg-blue-100 text-blue-700 border border-blue-300",
  annulé: "bg-red-100 text-red-700 border border-red-300",
  échoué: "bg-red-100 text-red-700 border border-red-300",
  remboursé: "bg-blue-100 text-blue-700 border border-blue-300", //"bg-blue-100 text-blue-700 border border-blue-300"
};

export default function PaymentDataTable({ onSelectionChange }) {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { paymentId } = useParams();

  const [activeTab, setActiveTab] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [showMethodFilter, setShowMethodFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [stats, setStats] = useState({
  totalRevenue: 0,
  outstandingCount: 0,
  outstandingAmount: 0,
  refunds: 0,
});


  const paymentsPerPage = 8;

  // Fetch Data
  useEffect(() => {
    axios
      .get("https://dev-api.payonlive.com/api/payment/payment-list")
      .then((res) => {
        const paymentsArray = res.data.data || [];
        const formatted = paymentsArray.map((item) => ({
          id: item.payment_id,
          amount: item.amount || "N/A",
          status: item.status || "En-attente",
          transactionId: item.payment_id || "N/A",
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

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  useEffect(() => {
    axios
      .get("https://dev-api.payonlive.com/api/payment/stats")
      .then((res) => {
        if (res.data.success) {
          const s = res.data.data;

          setStats({
            totalRevenue: s.totalRevenue || "€0",
            outstandingCount: s.outstandingPayments?.count || 0,
            outstandingAmount: s.outstandingPayments?.amount || "€0",
            refunds: s.refunds || "€0",
          });
        }
      })
      .catch((err) => {
        console.error("Stats API Error:", err);
      });
  }, []);

  // ---- Filtering ----
  let tabFiltered = payments;
  if (activeTab === "payé")
    tabFiltered = payments.filter((p) => p.status === "payé");
  if (activeTab === "remboursés")
    tabFiltered = payments.filter((p) => p.status === "remboursé");

  if (search.trim()) {
    const term = search.toLowerCase();
    tabFiltered = tabFiltered.filter(
      (p) =>
        p.status.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term) ||
        p.amount.toString().includes(term) ||
        p.id.toString().includes(term)
    );
  }

  const filteredPayments =
    filterMethod === "all"
      ? tabFiltered
      : tabFiltered.filter((p) => p.method === filterMethod);

  const sortedPayments = [...filteredPayments].sort((a, b) =>
    sortOrder === "desc" ? b.date - a.date : a.date - b.date
  );

  const totalPages = Math.ceil(sortedPayments.length / paymentsPerPage);
  const currentPayments = sortedPayments.slice(
    (currentPage - 1) * paymentsPerPage,
    currentPage * paymentsPerPage
  );

  // ---- Select / Deselect ----
  const handleSelectAll = () => {
    let newSelected = [];
    if (!selectAll) newSelected = currentPayments.map((p) => p.id);
    setSelectedRows(newSelected);
    setSelectAll(!selectAll);
    onSelectionChange(newSelected); // ✅ Notify parent
  };

  const handleSelectRow = (id) => {
    let newSelected;
    if (selectedRows.includes(id)) {
      newSelected = selectedRows.filter((r) => r !== id);
    } else {
      newSelected = [...selectedRows, id];
    }
    setSelectedRows(newSelected);
    onSelectionChange(newSelected); // ✅ Notify parent
  };

  // ✅ Open confirmation dialog
  const handleOpenConfirm = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one payment to delete.");
      return;
    }
    setConfirmOpen(true);
  };

  // ✅ Close dialog
  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  const addDecimal = (value) => {
  if (!value) return "€  0.00";

  // If value already contains a dot, leave it as is
  if (value.includes(".")) return value;

  // Otherwise add .00
  return `${value}.00`;
};


  // ---- Bulk Delete Functionality ----
  const handleBulkDelete = async () => {

    try {
      setDeleting(true);

      // Example API call (replace with your delete endpoint)
      await axios.post(
        "https://dev-api.payonlive.com/api/payment/bulk-delete",
        {
          payment_ids: selectedRows,
        }
      );

      // Remove from UI
      setPayments((prev) => prev.filter((p) => !selectedRows.includes(p.id)));
      setSelectedRows([]);
      setSelectAll(false);
      setConfirmOpen(false);
    } catch (error) {
      console.error("Bulk delete failed:", error);
      alert("Error deleting selected payments.");
    } finally {
      setDeleting(false);
    }
  };

  // ---- Skeleton Rows ----
  const skeletonRows = Array.from({ length: paymentsPerPage }).map((_, idx) => (
    <tr key={idx} className="border-b">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton
            variant="rectangular"
            width={i === 0 ? 20 : "100%"}
            height={20}
          />
        </td>
      ))}
    </tr>
  ));

  return (
    <div className="p-6">
      {/* Tabs and Filters */}
      <div className="flex justify-between items-center border-2 mb-5 border-gray-300 px-6 rounded-md p-2 relative">
        {/* Tabs Section */}
        <div className="flex gap-6">
          {[
            { key: "all", label: "Tous", icon: faCircleCheck },
            { key: "payé", label: "Payés", icon: faCheckCircle },
            { key: "remboursés", label: "Remboursés", icon: faUndo },
          ].map(({ key, label, icon }) => {
            const isActive = activeTab === key;

            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 text-sm px-2 pb-1 transition-colors duration-150 ${
                  isActive
                    ? "text-black font-medium border-b-2 border-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <FontAwesomeIcon icon={icon} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter + Sort */}
        <div className="flex gap-2 relative">
          <button
            onClick={() => setShowMethodFilter(!showMethodFilter)}
            className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition"
          >
            <img src="/icons/cuida_filter-outline.svg" alt="icon" />
            {filterMethod === "all" ? "Toutes les méthodes" : filterMethod}
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
                  {method === "all" ? "Toutes les méthodes" : method}
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
            Trier par date {sortOrder === "desc" ? "↓" : "↑"}
          </button>

          <button
            // onClick={handleBulkDelete}
            onClick={handleOpenConfirm}
            disabled={selectedRows.length === 0 || deleting}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-white transition ${
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
                Supprimer sélection ({selectedRows.length})
              </>
            )}
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
          placeholder="Recherche"
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
          <thead className="border-b text-left bg-gray-50">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  disabled={loading}
                />
              </th>
              <th className="p-3">Montant</th>
              <th className="p-3">ID de transaction</th>
              <th className="p-3">ID de commande</th>
              <th className="p-3">E-mail</th>
              <th className="p-3">Date</th>
              <th className="p-3">Méthode</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              skeletonRows
            ) : currentPayments.length > 0 ? (
              currentPayments.map((p) => (
                <tr
                  key={p.id}
                  className={`border-b hover:bg-gray-50 ${
                    selectedRows.includes(p.id) ? "bg-red-50" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(p.id)}
                      onChange={() => handleSelectRow(p.id)}
                    />
                  </td>
                  <td className="p-3">{p.amount}</td>
                  <td className="p-3">{p.transactionId}</td>
                  <td className="p-3">{p.orderId}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.date.toLocaleString()}</td>
                  <td className="p-3">{p.method}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[p.status]
                      }`}
                    >
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 text-left">
                    <button
                      onClick={() => navigate(`/user/view-payment/${p.id}`)}
                    >
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
          <FontAwesomeIcon icon={faArrowLeft} /> Précédent
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

        {/* Material UI Confirmation Dialog */}
        <Dialog
          open={confirmOpen}
          onClose={handleCloseConfirm}
          aria-labelledby="confirm-delete-title"
        >
          <DialogTitle id="confirm-delete-title">
            Confirmer Suppression En Masse
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong>{selectedRows.length}</strong> paiement sélectionné(s)? Cette action est irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm} color="inherit">
              Annuler
            </Button>
            <Button
              onClick={handleBulkDelete}
              color="error"
              variant="contained"
              disabled={deleting}
            >
              {deleting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Supprimer"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Suivant <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 md:w-3xl lg:w-3xl border-1 rounded-lg px-2 mt-6 mx-auto">
        <div className="bg-white border-r-1 border-gray-400 shadow p-6 text-center">
          <h3 className="text-gray-800 text-xl">Revenu total</h3>
          <p className="md:text-md lg:text-2xl font-medium mt-2">{addDecimal(stats.totalRevenue)} </p>
        </div>

        <div className="bg-white col-span-2 shadow p-6 border-r-1 border-gray-400 text-center">
          <h3 className="text-gray-800 text-xl">Paiements en attente</h3>
          <p className="md:text-md lg:text-2xl font-medium mt-2">{stats.outstandingCount} ({addDecimal(stats.outstandingAmount)}) </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-gray-800 text-xl">Remboursements</h3>
          <p className="md:text-md lg:text-2xl font-medium mt-2">{addDecimal(stats.refunds)} </p>
        </div>
      </div>
    </div>
  );
}
