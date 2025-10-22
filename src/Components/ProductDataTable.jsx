import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faAngleRight,
  faBoxArchive,
  faCircleCheck,
  faChartLine,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function ProductTable() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  const rowsPerPage = 7;

  const getImageUrl = (img) => {
    if (!img) return "/placeholder-image.png";
    return img.startsWith("http")
      ? img
      : `https://la-dolce-vita.onrender.com${img}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://dev-api.payonlive.com/api/product/product-list"
        );
        if (res.data && res.data.data) {
          setProducts(res.data.data);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ============================
  // 🔸 Filtering Logic (Fixed)
  // ============================
  let filteredProducts = [...products];

  // Normalize all possible status values
  const normalizeStatus = (status) => {
    if (!status) return "unknown";
    const s = status.toString().toLowerCase().trim();
    if (["active", "1", "true", "enabled"].includes(s)) return "active";
    if (["inactive", "0", "false", "disabled"].includes(s)) return "inactive";
    return s;
  };

  const capitalizeStatus = (status) => {
    if (!status) return "Unknown";
    const lower = status.toString().toLowerCase().trim();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  // product status color
  const statusColors = {
    Active: "bg-green-100 text-green-700 border border-green-300",
    Inactive: "bg-red-100 text-red-700 border border-red-300",
  };

  // ✅ Status-based filter
  if (activeTab !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => normalizeStatus(p.status) === activeTab
    );
  }

  // ✅ Search filter
  if (search.trim()) {
    const term = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.productName?.toLowerCase().includes(term) ||
        p.productCode?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p._id?.toLowerCase().includes(term)
    );
  }

  // ✅ Category filter
  if (selectedCategory !== "All") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  // ✅ Sorting
  filteredProducts.sort((a, b) => {
    const nameA = a.productName?.toLowerCase() || "";
    const nameB = b.productName?.toLowerCase() || "";
    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  // ✅ Pagination
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // ✅ Checkbox selection
  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelected(currentProducts.map((p) => p._id));
    else setSelected([]);
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allSelected =
    currentProducts.length > 0 &&
    currentProducts.every((p) => selected.includes(p._id));

  // ============================
  // 🔸 UI Rendering
  // ============================
  return (
    <div>
      {/* Tabs */}
      <div className="flex justify-between items-center border-2 border-gray-300 px-6 mt-5 rounded-md p-2 mx-6">
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
            <FontAwesomeIcon icon={faCircleCheck} /> All
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
            <FontAwesomeIcon icon={faChartLine} /> Active
          </button>
          <button
            onClick={() => {
              setActiveTab("inactive");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "inactive"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faBoxArchive} /> Inactive
          </button>
        </div>

        {/* Sort & Filter */}
        <div className="flex gap-2 relative">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition"
            >
              Filter
              <FontAwesomeIcon
                icon={faChevronDown}
                className="ml-1 text-gray-600"
              />
            </button>
            {showFilter && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md z-50">
                {["All", "Clothing", "Shoes", "Accessories"].map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                      setShowFilter(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort((prev) => !prev)}
              className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition"
            >
              Sort
              <FontAwesomeIcon
                icon={faChevronDown}
                className="ml-1 text-gray-600"
              />
            </button>
            {showSort && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md z-50">
                <div
                  onClick={() => {
                    setSortOrder("asc");
                    setShowSort(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  A → Z
                </div>
                <div
                  onClick={() => {
                    setSortOrder("desc");
                    setShowSort(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Z → A
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search bar */}
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
      {loading ? (
        <p className="text-center py-6">Loading products...</p>
      ) : error ? (
        <p className="text-center py-6 text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto border-gray-400 rounded-lg shadow bg-white mx-6 mt-5">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-600   border-b">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="p-3">Image</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Product Code</th>
                <th className="p-3">Size</th>
                <th className="p-3">Color</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((item) => (
                <tr
                  key={item._id}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    selected.includes(item._id) ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={() => toggleSelect(item._id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={getImageUrl(item.images?.[0])}
                      alt={item.productName}
                      className="w-10 h-10 rounded-md object-cover border"
                    />
                  </td>
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">{item.price}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.productCode}</td>
                  <td className="p-3">{item.size}</td>
                  <td className="p-3">{item.color}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[capitalizeStatus(item.status)] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {capitalizeStatus(item.status)}
                    </span>
                  </td>
                  <td className="p-3 flex gap-4 justify-center">
                    <button
                      onClick={() => navigate(`/user/view-product/${item._id}`)}
                      className="text-gray-600 hover:text-black"
                    >
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-3 text-sm text-gray-600 bg-gray-50 border-t">
            <span className="text-gray-500">
              Showing {startIndex + 1}–
              {Math.min(startIndex + rowsPerPage, filteredProducts.length)} of{" "}
              {filteredProducts.length}
            </span>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded flex items-center gap-1 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon icon={faChevronLeft} /> Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded flex items-center gap-1 ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Next <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
