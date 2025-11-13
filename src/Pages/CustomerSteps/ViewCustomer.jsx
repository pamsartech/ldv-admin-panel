import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faBan,
  faTimes,
  faLocationDot,
  faArrowLeft,
  faTrashCan,
  faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "../../Components/AlertContext";

// 🧩 Material UI
import { Skeleton } from "@mui/material"; 
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";


/* -------------------- StatusBadge Component -------------------- */
const STATUS_STYLES = {
   payment: {
    payé: "text-green-700 bg-green-100 border-green-700",
    enattente: "text-amber-700 bg-amber-100 border-amber-700",
    échoué: "text-red-700 bg-red-100 border-red-700",
    default: "text-gray-600 bg-gray-100 border-gray-600",
  },
  delivery: {
    livraison: "text-green-700 bg-green-100 border-green-700",
    expédié: "text-blue-700 bg-blue-100 border-blue-700",
    "in transit": "text-amber-700 bg-amber-100 border-amber-700",
    annulé : "text-red-700 bg-red-100 border-red-700",
    enattente: "text-amber-700 bg-amber-100 border-amber-700",
    default: "text-gray-600 bg-gray-100 border-gray-600",
  },
  general: {
    actif: "text-green-700 bg-green-100 border-green-700",
    inactif: "text-gray-600 bg-gray-100 border-gray-600",
  },
};

const StatusBadge = ({ status, type = "general" }) => {
  const normalized = status?.toLowerCase() || "";
  const styleSet = STATUS_STYLES[type] || STATUS_STYLES.general;
  const classes = styleSet[normalized] || styleSet.default;

  return (
    <span
      className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize ${classes}`}
    >
      {status}
    </span>
  );
};

/* -------------------- ToggleSwitch & ActionButton -------------------- */
const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#02B978] peer-focus:ring-4 peer-focus:ring-[#04D18C] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
    </label>
  </div>
);

const BUTTON_VARIANTS = {
  danger: "bg-[#B21E1E] text-white border-red-600 pr-5 hover:bg-red-700",
  default: "bg-white text-gray-700 border-gray-400 pr-10 hover:bg-gray-100",
};

const ActionButton = ({ children, onClick, variant = "default" }) => {
  const baseClasses =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-colors";
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${BUTTON_VARIANTS[variant]}`}
    >
      {children}
    </button>
  );
};

/* -------------------- Main Component -------------------- */
const ViewCustomer = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { showAlert } = useAlert(); // ✅ useAlert context

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  /* Add this new state near the top, below other states */
  const [isBlocking, setIsBlocking] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false); // 🔹 MUI confirm dialog

  /* Add this function inside ViewCustomer component */
  const handleBlockCustomer = async () => {
    if (!customer) return;

    const currentlyBlocked = customer.status?.toLowerCase() === "inactif";
    const actionText = currentlyBlocked ? "unblock" : "block";

    try {
      setIsBlocking(true);

      const response = await axios.put(
        `https://dev-api.payonlive.com/api/user/block/${customerId}`,
        { block: !currentlyBlocked }, // ✅ Send correct JSON body
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.success) {
        showAlert(
          `Customer has been ${
            currentlyBlocked ? "unblocked" : "blocked"
          } successfully!`, "success"
        );
        // Refresh UI immediately
        setCustomer((prev) => ({
          ...prev,
          status: currentlyBlocked ? "Actif" : "Inactif",
        }));
      } else {
        showAlert(response.data?.message || "Failed to update block status.", "info");
      }
    } catch (error) {
      showAlert(error.response?.data?.message || error.message,"info");
    } finally {
      setIsBlocking(false);
    }
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(
          `https://dev-api.payonlive.com/api/user/user-details/${customerId}`
        );

        const result = response.data;
        if (!result.success) throw new Error(result.message || "API error");

        const user = result.data.user;
        const stats = result.data.statistics;
        const orders = result.data.allOrders || [];

        setCustomer({
          id: user._id,
          name: user.customerName,
          email: user.email,
          status: user.isActive ? "Actif" : "Inactif",
          customerID: user._id,
          totalSpend: stats.totalSpent || 0,
          totalOrders: stats.totalOrders || 0,
          preferences: {
            emailMarketing: user.communicationMethod === "email",
            smsMarketing: user.communicationMethod === "sms",
          },
          dateJoined: user.dateJoined,
          lastLogin: user.lastUpdated,
          address: `${user.address?.street || ""}, ${
            user.address?.city || ""
          }, ${user.address?.state || ""}, ${user.address?.zipcode || ""}, ${
            user.address?.country || ""
          }`,
          phone: user.phoneNumber,
          dob: user.dob,
        });

        const mappedOrders = orders.map((order) => ({
          id: order.orderId,
          productName: order.items[0]?.productName || "Unknown",
          productImage:
            order.items[0]?.productDetails?.images?.[0] ||
            order.items[0]?.productImage ||
            "https://via.placeholder.com/80",
          paymentStatus: order.paymentStatus,
          deliveryStatus: order.shippingStatus,
          price: order.orderTotal,
        }));

        setOrders(mappedOrders);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (customerId) fetchCustomer();
  }, [customerId]);

  const handleDeleteCustomer = async () => {
    
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `https://dev-api.payonlive.com/api/user/delete-customer/${customerId}`
      );
      if (response.status === 200) {
        showAlert("Customer deleted successfully!", "success");
        navigate("/user/Customers");
      } else
        showAlert(
          `Failed to delete customer: ${
            response.data.message || "Unknown error"
          }`, "info"
        );
    } catch (err) {
      showAlert(`Error: ${err.response?.data?.message || err.message}`, "info");
    } finally {
      setIsDeleting(false);
      setOpenConfirm(false); // close confirmation dialog
    }
  };

  const handleCancelOrder = (id) => alert(`Cancel order with id: ${id}`);

  return (
    <div>
      <Navbar heading="Gestion des clients " />

      {/* Header Buttons */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Profil client</h1>
        <div>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={200}
              height={36}
              animation="wave"
            />
          ) : (
            <>
              <button
                onClick={() => setOpenConfirm(true)}
                disabled={isDeleting}
                className={`px-3 py-1 border rounded-md ${
                  isDeleting
                    ? "bg-gray-300 text-gray-500"
                    : "text-[#B21E1E] bg-red-50 hover:bg-red-100"
                }`}
              >
                <FontAwesomeIcon icon={faTrashCan} className="px-2" />
                {isDeleting ? "Supprimer..." : "Supprimer client"}
              </button>

              <button
                onClick={() =>
                  navigate(`/user/update-customer/${customerId}`, {
                    state: customer,
                  })
                }
                className="mx-2 px-3 py-1 border rounded-md text-[#114E9D] bg-blue-50 hover:bg-blue-100"
              >
                <FontAwesomeIcon icon={faArrowRotateLeft} className="px-2" />{" "}
                Mise à jour
              </button>

              <button
                onClick={() => navigate("/user/Customers")}
                className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="text-white px-2"
                />{" "}
                Dos la vue principale
              </button>
            </>
          )}
        </div>
      </div>

      {/* 🔹 MUI Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">
          {"Confirm Customer Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to permanently delete this customer? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCustomer}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <div className="p-4 mx-auto space-y-6">
        {/* Profile Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:mx-4">
            {[...Array(3)].map((_, idx) => (
              <Skeleton
                key={idx}
                variant="rectangular"
                width="100%"
                height={200}
                animation="wave"
                className="rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:mx-4">
            {/* Customer Card */}
            <div className="border border-gray-400 rounded-2xl p-6">
              <div className="flex flex-col items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Customer Avatar"
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
                <h2 className="font-medium text-lg">{customer.name}</h2>
                <p className="text-gray-900 text-sm mt-2 mb-4">
                  {customer.email}
                </p>
                <hr className="w-full border-gray-400 mb-4" />

                <div className="w-full space-y-2 text-sm">
                  <div className="flex py-2 justify-between">
                    <span>Statut :</span>
                    <StatusBadge status={customer.status} />
                  </div>
                  <div className="flex justify-between">
                    <span>ID client :</span>
                    <span className="font-mono">{customer.customerID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dépenses totales :</span>
                    <span>€ {customer.totalSpend}</span>
                  </div>
                  <div className="flex py-2 justify-between">
                    <span>Commandes totales :</span>
                    <span>{customer.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Numéro de téléphone :</span>
                    <span>{customer.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences & Info */}
            <div className="border border-gray-400 rounded-2xl p-6">
              <h3 className="font-medium mb-4">Préférences et informations</h3>
              <ToggleSwitch
                label="Marketing par e-mail :"
                checked={customer.preferences?.emailMarketing}
                onChange={() => {}}
              />
              <ToggleSwitch
                label="Marketing par SMS :"
                checked={customer.preferences?.smsMarketing}
                onChange={() => {}}
              />
              <div className="flex justify-between text-sm mb-1">
                <span>Date d'inscription :</span>
                <span>
                  {new Date(customer.dateJoined).toLocaleDateString()}
                </span>
              </div>
              <div className="flex py-2 justify-between text-sm mb-4">
                <span>Last Login :</span>
                <span>{new Date(customer.lastLogin).toLocaleString()}</span>
              </div>

              <h4 className="font-medium mb-2">Actions rapides</h4>
              <div className="space-y-3 mt-3">
                <ActionButton onClick={() => alert("Add address clicked")}>
                  <FontAwesomeIcon icon={faLocationDot} />
                  Ajouter une adresse
                </ActionButton>
                <ActionButton onClick={() => alert("Send Email clicked")}>
                  <FontAwesomeIcon icon={faEnvelope} /> Envoyer E-mail
                </ActionButton>
                <ActionButton
                  variant="danger"
                  onClick={handleBlockCustomer}
                  disabled={isBlocking}
                >
                  <FontAwesomeIcon icon={faBan} />{" "}
                  {isBlocking ? "Bloc..." : "Bloc Client"}
                </ActionButton>
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        <div className="border border-gray-400 rounded-2xl p-6 mx-4 lg:w-5xl">
          <h3 className="font-medium mb-4">Commandes passées par le client</h3>
          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, idx) => (
                <Skeleton
                  key={idx}
                  variant="rectangular"
                  width="100%"
                  height={40}
                  animation="wave"
                  className="rounded-md"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="py-2 px-3 font-medium">Nom du produit</th>
                    <th className="py-2 px-3 font-medium">
                      Statut du paiement
                    </th>
                    <th className="py-2 px-3 font-medium">
                      Statut de livraison
                    </th>
                    <th className="py-2 px-3 font-medium">Prix</th>
                    <th className="py-2 px-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(
                    ({
                      id,
                      productName,
                      productImage,
                      paymentStatus,
                      deliveryStatus,
                      price,
                    }) => (
                      <tr key={id} className="border-t border-gray-200">
                        <td className="py-2 px-3 flex items-center gap-3">
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <span>{productName}</span>
                        </td>
                        <td className="py-2 px-3">
                          <StatusBadge status={paymentStatus} type="payment" />
                        </td>
                        <td className="py-2 px-3">
                          <StatusBadge
                            status={deliveryStatus}
                            type="delivery"
                          />
                        </td>
                        <td className="py-2 px-3">{price}</td>
                        <td className="py-2 px-3">
                          <button
                            onClick={() => handleCancelOrder(id)}
                            className="flex items-center gap-1 text-red-600 border border-red-600 rounded-full px-3 py-1 text-sm hover:bg-red-600 hover:text-white transition"
                          >
                            <FontAwesomeIcon icon={faTimes} /> Annuler commande
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCustomer;
