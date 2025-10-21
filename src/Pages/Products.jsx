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

function Products() {
  const navigate = useNavigate();

  const products = [
    {
      img: "https://m.media-amazon.com/images/I/813K52JIyYL._UY1100_.jpg",
      name: "Red Dress",
      id: "202035",
      sold: 688,
    },
    {
      img: "https://rukminim2.flixcart.com/image/704/844/xif0q/hand-messenger-bag/7/n/0/exotic610-11-2-hb-610-handbag-exotic-8-5-original-imahc8zcygd8u2nv.jpeg?q=90&crop=false",
      name: "Black Handbag",
      id: "202045",
      sold: 512,
    },
    {
      img: "https://www.forevershoes.in/cdn/shop/files/LSD06481.jpg?v=1727959319",
      name: "Beige Heels",
      id: "202055",
      sold: 450,
    },
    {
      img: "https://assets.ajio.com/medias/sys_master/root/20240809/hNk9/66b5f1f31d763220fa6d0937/-473Wx593H-700274434-silver-MODEL.jpg",
      name: "Silver Earrings",
      id: "202075",
      sold: 391,
    },
  ];

  return (
    <div>
      <Navbar heading="Product Management" />

      {/* my product panel */}
      <div className="flex items-center justify-between px-6 mt-5  pb-3">
        {/* Left Section - Title */}
        <h2 className="text-lg font-semibold text-gray-800"> My Product </h2>

        {/* Right Section - Buttons */}
        <div className="flex items-center gap-2">
          {/* Import Input (File Upload) */}
          <label className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer">
            <FontAwesomeIcon icon={faDownload} className="text-gray-600" />
            Import
            <input type="file" accept=".jpg,.jpeg,.png" className="hidden" />
          </label>

          {/* Export Input (Button) */}
          <label className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer">
            <FontAwesomeIcon icon={faUpload} className="text-gray-600" />
            Export
            <input type="file" accept=".jpg,.jpeg,.png" className="hidden" />
          </label>

          {/* Add Product Button */}
          <button
            onClick={() => navigate("/user/add-product")}
            className="flex items-center gap-2 bg-[#02B978] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#04D18C] transition"
          >
            <FontAwesomeIcon icon={faPlus} className="text-white" />
            Add Product
          </button>
        </div>
      </div>

       

      <DataTable />

      {/* best selling and recently products section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Best Selling Products */}
        <div className="p-5 shadow-lg border border-gray-400 rounded-xl bg-white ">
          <h3 className="text-lg font-semibold mb-4">Best-selling Products</h3>
          <ul className="space-y-4">
            {products.map((product, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={product.img}
                    className=" w-10 h-10 border-1 rounded-lg border-gray-400"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.id}</p>
                  </div>
                </div>
                <span className="font-semibold">{product.sold}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recently Products */}
        <div className="p-5 shadow-lg border border-gray-400 rounded-xl bg-white ">
          <h3 className="text-lg font-semibold mb-4">
            Recently added Products
          </h3>
          <ul className="space-y-4">
            {products.map((product, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={product.img}
                    className=" w-10 h-10 border-1 rounded-lg border-gray-400"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.id}</p>
                  </div>
                </div>
                <span className="font-semibold">{product.sold}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Products;
