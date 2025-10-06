// src/components/SalesDashboard.jsx
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,} from "recharts";

 function SellingChart() {

  const data = [
    { name: "Sun", sales: 2000 },
    { name: "Mon", sales: 9000 },
    { name: "Tue", sales: 6000 },
    { name: "Wed", sales: 10000 },
    { name: "Thu", sales: 9500 },
    { name: "Fri", sales: 11000 },
    { name: "Sat", sales: 18000 },
  ];

  const products = [
    { img: "https://m.media-amazon.com/images/I/813K52JIyYL._UY1100_.jpg", name: "Red Dress", id: "202035", sold: 688 },
    { img: "https://rukminim2.flixcart.com/image/704/844/xif0q/hand-messenger-bag/7/n/0/exotic610-11-2-hb-610-handbag-exotic-8-5-original-imahc8zcygd8u2nv.jpeg?q=90&crop=false", name: "Black Handbag", id: "202045", sold: 512 },
    { img: "https://www.forevershoes.in/cdn/shop/files/LSD06481.jpg?v=1727959319", name: "Beige Heels", id: "202055", sold: 450 },
    { img: "https://assets.ajio.com/medias/sys_master/root/20240809/hNk9/66b5f1f31d763220fa6d0937/-473Wx593H-700274434-silver-MODEL.jpg", name: "Silver Earrings", id: "202075", sold: 391 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

      {/* Sales Trends */}
      <div className="p-5 shadow-lg rounded-xl bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Sales Trends</h3>
          <button className="text-sm text-blue-500 hover:underline">View</button>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line className="text-[#02B978]" type="linear" dataKey="sales" stroke="#05df72" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Best Selling Products */}
      <div className="p-5 shadow-lg rounded-xl bg-white ">
        <h3 className="text-lg font-medium mb-4">Best-selling Products</h3>
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
              <span className="font-medium">{product.sold}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SellingChart;