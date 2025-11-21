import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SketchPicker } from "react-color";
import Navbar from "../../Components/Navbar";
import { useAlert } from "../../Components/AlertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faXmark,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

// 🧩 Material UI imports
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

function UpdateProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [btnLoading, setBtnLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState("Men");
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [images, setImages] = useState([]);
  const [stockError, setStockError] = useState("");

  const [productDetails, setProductDetails] = useState({
    productName: "",
    productCode: "",
    price: "",
    stock: "",
    category: "",
    status: "",
  });

  // ✅ Fetch product details
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const res = await axios.get(
  //         `https://dev-api.payonlive.com/api/product/product-details/${productId}`
  //       );
  //       if (res.data.success) {
  //         const data = res.data.data;
  //         setProductDetails({
  //           productName: data.productName || "",
  //           productCode: data.productCode || "",
  //           price: data.price || "",
  //           stock: data.stock || "",
  //           category: data.category || "",
  //           status: data.status || "",
  //         });
  //         setSelectedGender(data.gender || "Men");
  //         setSelectedSize(data.size || "M");
  //         setSelectedColor(data.color || "#FF0000");
  //         setImages(data.images || []);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching product:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProduct();
  // }, [productId]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://dev-api.payonlive.com/api/product/product-details/${productId}`
        );
        // if (res.data.success) {
        //   const data = res.data.data;

        //   // ✅ Normalize color
        //   let normalizedColor = "#FF0000";
        //   if (Array.isArray(data.color)) {
        //     // pick first valid color if array
        //     normalizedColor = data.color[0] || "#FF0000";
        //   } else if (
        //     typeof data.color === "string" &&
        //     data.color.trim() !== ""
        //   ) {
        //     normalizedColor = data.color;
        //   }

        //   // ✅ Normalize size
        //   let normalizedSize = "M";
        //   if (Array.isArray(data.size)) {
        //     // pick first valid size if array
        //     normalizedSize = data.size[0] || "M";
        //   } else if (typeof data.size === "string" && data.size.trim() !== "") {
        //     normalizedSize = data.size;
        //   }

        //   // ✅ Set all states
        //   setProductDetails({
        //     productName: data.productName || "",
        //     productCode: data.productCode || "",
        //     price: data.price || "",
        //     stock: data.stock || "",
        //     category: data.category || "",
        //     status: data.status || "",
        //   });
        //   setSelectedGender(data.gender || "Men");
        //   setSelectedSize(Array.isArray(data.size) ? data.size : [data.size]);
        //   // setSelectedColor(
        //   //   Array.isArray(data.color) ? data.color : [data.color]
        //   // );
        //   setSelectedColor(
        //     Array.isArray(data.color)
        //       ? data.color.filter(Boolean)
        //       : data.color
        //       ? [data.color]
        //       : []
        //   );

        //   setImages(data.images || []);
        // }
        if (res.data.success) {
          const data = res.data.data;

          // ---------- FIX N/A SIZE & COLOR ----------
          const normalizeArray = (value) => {
            // backend sends: "N/A", [], ["N/A"], or real array
            if (!value) return [];
            if (value === "N/A") return [];
            if (Array.isArray(value)) {
              return value.filter((v) => v !== "N/A" && v.trim() !== "");
            }
            if (typeof value === "string") {
              return value === "N/A" ? [] : [value];
            }
            return [];
          };

          const cleanColors = normalizeArray(data.color);
          const cleanSizes = normalizeArray(data.size);

          // apply to state
          setSelectedColor(cleanColors);
          setSelectedSize(cleanSizes);

          // The rest of your code continues...
          setProductDetails({
            productName: data.productName || "",
            productCode: data.productCode || "",
            price: data.price || "",
            stock: data.stock || "",
            category: data.category || "",
            status: data.status || "",
          });

          setSelectedGender(data.gender || "Men");
          setImages(data.images || []);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color) => setSelectedColor(color.hex);
  const handleColorCommit = (color) => setSelectedColor(color.hex);

  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    const newImage = URL.createObjectURL(file);
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = newImage;
      return updated;
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStock = (value) => {
    if (value === "" || value === null) {
      return "Le stock ne peut pas être vide.";
    }
    if (Number(value) < 1) {
      return "Le stock doit être supérieur à 0.";
    }
    return "";
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // block submit if stock is invalid
    const error = validateStock(productDetails.stock);
    if (error) {
      setStockError(error);
      return;
    }

    setBtnLoading(true);

    const payload = {
      productName: productDetails.productName,
      productCode: productDetails.productCode,
      price: Number(productDetails.price),
      status: productDetails.status,
      gender: selectedGender,
      // color: Array.isArray(selectedColor) ? selectedColor : [selectedColor],
      // size: Array.isArray(selectedSize) ? selectedSize : [selectedSize],
      color: selectedColor,
      size: selectedSize,
      stock: Number(productDetails.stock),
      category: productDetails.category,
      images: images,
    };

    try {
      const response = await axios.put(
        `https://dev-api.payonlive.com/api/product/update-product/${productId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        showAlert("Produit mis à jour avec succès !", "succès", () =>
          navigate("/user/products")
        );
      } else {
        showAlert("La mise à jour du produit a échoué.", "erreur");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      showAlert("La mise à jour du produit a échoué.", "erreur");
    } finally {
      // ✅ Always stop the spinner
      setBtnLoading(false);
    }
  };

  // 🧩 Skeleton Loader (replaces plain loading text)
  if (loading)
    return (
      <div>
        <Navbar heading="Gestion de produits" />
        <div className="max-w-6xl mx-auto mt-10 bg-white rounded-lg shadow-sm p-6">
          <Stack spacing={3}>
            <Skeleton variant="text" width={220} height={35} animation="wave" />
            <Skeleton variant="rectangular" height={80} animation="wave" />
            <Skeleton variant="rectangular" height={300} animation="wave" />
            <Skeleton variant="rectangular" height={180} animation="wave" />
            <Skeleton variant="text" width={180} height={35} animation="wave" />
            <Skeleton variant="rectangular" height={250} animation="wave" />
            <Skeleton variant="rectangular" height={120} animation="wave" />
          </Stack>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar heading="Gestion de produits" />

      {/* Top Bar */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">
          Mettre à jour les détails du produit
        </h1>
        <button
          onClick={() => navigate("/user/Products")}
          className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" className="px-2" />
          Dos la vue principale
        </button>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-10 mt-10">
          {/* Basic Info */}
          <section className="border border-gray-300 rounded-xl shadow-sm p-7 bg-gray-50">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Prix</label>
                <input
                  required
                  type="number"
                  name="price"
                  value={productDetails.price}
                  onChange={handleChange}
                  placeholder="€12"
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  required
                  type="text"
                  name="productName"
                  value={productDetails.productName}
                  onChange={handleChange}
                  placeholder="Nom du produit"
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Code produit
                </label>
                <input
                  required
                  type="text"
                  name="productCode"
                  value={productDetails.productCode}
                  onChange={handleChange}
                  placeholder="3211"
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select
                  required
                  name="status"
                  value={productDetails.status}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="">Sélectionner le statut</option>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>
          </section>

          {/* Image Upload */}
          <section className="bg-gray-100 mx-auto p-6 rounded-2xl w-full max-w-5xl">
            <h3 className="font-semibold text-gray-800 mb-3">
              Ajouter des images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Image */}
              <div className="relative col-span-2">
                <label
                  htmlFor="mainImageUpload"
                  className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-xl h-64 cursor-pointer bg-white hover:bg-gray-50 overflow-hidden"
                >
                  {images[0] ? (
                    <img
                      src={images[0]}
                      alt="Main Upload"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-500">Add Main Image</span>
                  )}
                </label>
                <input
                  id="mainImageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 0)}
                />
                {images[0] && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(0)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"
                  >
                    <FontAwesomeIcon icon={faTimes} size="sm" />
                  </button>
                )}
              </div>

              {/* Side Images */}
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="relative">
                    <label
                      htmlFor={`sideImageUpload-${index}`}
                      className="w-15 h-15 flex items-center justify-center bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 overflow-hidden"
                    >
                      {images[index] ? (
                        <img
                          src={images[index]}
                          alt={`Upload ${index}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-gray-600"
                        />
                      )}
                    </label>
                    <input
                      id={`sideImageUpload-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, index)}
                    />
                    {images[index] && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
                      >
                        <FontAwesomeIcon icon={faTimes} size="sm" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Color / Size / Stock */}
        <section className="p-6 border border-gray-300 rounded-2xl shadow-md bg-gray-50 mx-10 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left */}
            <div className="space-y-6">
              {/* Gender */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Genre</h3>
                <div className="flex gap-3">
                  {["Men", "Women", "Unisex"].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setSelectedGender(gender)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        selectedGender === gender
                          ? "bg-[#6750A4] text-white"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* ✅ Fixed Color Picker Section */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Couleurs</h3>
                <div className="flex gap-3 items-center flex-wrap">
                  {selectedColor.map((color, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full border cursor-pointer transition duration-200 ${
                        selectedColor.includes(color)
                          ? "ring-2 ring-purple-600 scale-110"
                          : ""
                      }`}
                      style={{ backgroundColor: color, cursor: "pointer" }}
                      onClick={() =>
                        setSelectedColor((prev) =>
                          prev.filter((c) => c !== color)
                        )
                      }
                      title="Click to remove color"
                    ></div>
                  ))}

                  {/* Add Color Button */}
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>

                {showColorPicker && (
                  <div className="mt-3 relative z-50">
                    <SketchPicker
                      color={
                        selectedColor[selectedColor.length - 1] || "#000000"
                      } // shows last picked color
                      onChange={(color) => {
                        // Smooth live updates, no overwrite
                        setSelectedColor((prev) => {
                          if (!prev.includes(color.hex)) {
                            return [...prev, color.hex]; // ✅ always add new color
                          }
                          return prev;
                        });
                      }}
                      onChangeComplete={() => {
                        // Optional: close picker after final selection
                        setShowColorPicker(false);
                      }}
                      styles={{
                        default: {
                          picker: {
                            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                            borderRadius: "12px",
                            zIndex: 9999,
                          },
                          saturation: {
                            borderRadius: "10px",
                            overflow: "hidden",
                          },
                          hue: {
                            height: "12px",
                            borderRadius: "8px",
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Taille</h3>
                <div className="flex gap-3 flex-wrap">
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setSelectedSize((prev) =>
                          prev.includes(size)
                            ? prev.filter((s) => s !== size)
                            : [...prev, size]
                        )
                      }
                      className={`px-4 py-2 rounded-lg border transition ${
                        selectedSize.includes(size)
                          ? "bg-[#6750A4] text-white"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Produits en stock
                </h3>
                <input
                  min="1"
                  type="number"
                  name="stock"
                  value={productDetails.stock}
                  // onChange={handleChange}
                  // className="w-full border rounded-lg border-gray-400 px-3 py-2 bg-gray-50"
                  onChange={(e) => {
                    const { value } = e.target;

                    const error = validateStock(value);
                    setStockError(error);

                    setProductDetails((prev) => ({ ...prev, stock: value }));
                  }}
                  className={`w-full border rounded-lg px-3 py-2 bg-gray-50 ${
                    stockError ? "border-red-500" : "border-gray-400"
                  }`}
                />
                {stockError && (
                  <p className="text-red-600 text-sm mt-1">{stockError}</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Catégorie</h3>
                <select
                  required
                  name="category"
                  value={productDetails.category}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-400 rounded-lg px-3 py-2"
                >
                  <option value="vêtements">Vêtements</option>
                  <option value="chaussures">Chaussures</option>
                  <option value="accessoires">Accessoires</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <hr className="text-gray-400 mx-10 mt-8" />
        <div className="flex justify-between max-w-5xl mx-auto my-10">
          <div className="mt-4">
            <button
              type="button"
              onClick={() => navigate("/user/Products")}
              className="px-3 py-2 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faXmark} size="lg" className="px-2" />
              Jeter Produit
            </button>
          </div>

          <div className=" mt-4">
            <button
              type="submit"
              disabled={btnLoading}
              className="bg-[#114E9D] text-white px-6 py-2 rounded-lg hover:bg-blue-500 flex items-center gap-2"
            >
              {btnLoading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {btnLoading ? "Mise à jour..." : "Mise à jour Produits"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdateProduct;
