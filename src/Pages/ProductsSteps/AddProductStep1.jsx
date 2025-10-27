// AddProductStep1.jsx
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faXmark ,faCheck } from "@fortawesome/free-solid-svg-icons";

function AddProductStep1({ formData, setFormData, nextStep }) {
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // stop page reload
    nextStep(); // only called if all required fields are valid
  };

  return (
    <div>
      <Navbar heading="Product Management" />

      <h1 className="mt-5 text-start mx-5 font-medium text-lg">Product Creation</h1>
      <h1 className="text-center mt-5 text-gray-800 font-medium text-2xl">
        Create a product
      </h1>

      <div className="max-w-lg mx-auto mt-2 bg-white p-6 shadow rounded">

        {/* Progress indicator unchanged */}
          <div className="flex justify-center items-center gap-4 mb-10">
          <div className="flex flex-col items-center text-black font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#02B978] text-white border border-[#02B978]">
             1
            </div>
            <span className="mt-3 text-sm font-bold text-[#02B978] ">Enter Product Info</span>
          </div>

          <div className="flex-1 pb-5 border-t-3 border-gray-800"></div>

          <div className="flex flex-col items-center text-gray-400 font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white border border-gray-300">2</div>
            <span className="mt-3 font-bold text-sm">Add variations</span>
          </div>

          <div className="flex-1 pb-5 border-t-3 border-gray-800"></div>

          <div className="flex flex-col items-center text-gray-400 font-semibold">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white border border-gray-300">3</div>
            <span className="mt-3 text-sm">Add images</span>
          </div>
        </div>



        {/* ✅ Wrap inputs in a <form> */}
        <form
          onSubmit={handleSubmit}
          className="border border-gray-300 rounded-xl shadow-sm p-7 bg-gray-50 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl">
              <label className="block text-sm font-medium mb-1">
                TikTok session
              </label>
              <input
                required
                name="tiktokSessionId"
                type="text"
                placeholder="Clothing code 2025"
                value={formData.tiktokSessionId || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                required
                name="price"
                type="number"
                placeholder="€12"
                value={formData.price || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                required
                name="productName"
                type="text"
                placeholder="Denim shirt 202045"
                value={formData.productName || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Product Code</label>
              <input
                required
                name="productCode"
                type="text"
                placeholder="3211"
                value={formData.productCode || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            

         {/* ✅ Status Dropdown */}
          <div className=" col-span-2"> 
            <label className=" text-sm font-medium mb-1">Status</label>
            <select
              required
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">Select Status</option>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>
             
          </div>

          {/* navigation buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/user/Products")}
              className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
            >
              <FontAwesomeIcon
                icon={faXmark}
                size="lg"
                className="text-red-700 px-2"
              />
              Discard Product
            </button>

            {/* ✅ make Next button submit the form */}
            <button
              type="submit"
              className="px-4 py-2 bg-[#02B978] text-white rounded-lg hover:bg-[#04D18C]"
            >
              Next
              <FontAwesomeIcon
                icon={faArrowRight}
                size="lg"
                className="text-white px-3 "
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductStep1;


