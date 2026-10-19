
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Bookings from "./Pages/Bookings.jsx";
import Categories from "./Pages/Categories.jsx";
import Customers from "./Pages/Customers.jsx";
import Orders from "./Pages/Order.jsx";
import Adminplumbingorder from "./Pages/Adminplumbingorder.jsx";
import About from "./Pages/About.jsx";
import Shop from "./Pages/Shop.jsx";
import Contact from "./Pages/Contact.jsx";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Registration from "./Pages/Ragistertion.jsx";
import EBooking from "./Pages/EBooking.jsx";
import EBO from "./Pages/EBO.jsx";
import Pbooking from "./Pages/Pbooking.jsx";
import Electerproduect from "./Pages/Electerproduect.jsx";
import Plumberproduct from "./Pages/Plumberproduct.jsx";
import PBO from "./Pages/PBO.jsx"
import AllElecterproduct from "./Pages/AllElecterproduct.jsx";
import Allplumberproduct from "./Pages/Allplumberproduct.jsx";
import ElectricalShop from "./Pages/ElectricalShop.jsx";
import PlumbingShop from "./Pages/PlumbingShop.jsx";
import Electerproupdate from "./Pages/Electerproupdate.jsx";
import Plumbproupdate from "./Pages/Plumbproupdate.jsx";
import AllOrder from "./Pages/AllOrder.jsx";
import Adminelectericalorder from "./Pages/Adminelectericalorder.jsx";
import Shopdashbord from "./Pages/Shopdashbord.jsx";
import Allproduct from "./Pages/Allproduct.jsx";
import AllEPorders from "./Pages/AllEPorders.jsx";
import Regshop from "./Pages/Regshop.jsx";
import Allseller from "./Pages/Allseller.jsx";
import Admindashbord from "./Pages/Admindashbord.jsx";
import Admin2ndsidebar from "./components/Admin2ndsidebar.jsx";
import AdminAllproduct from "./Pages/AdminAllproduct.jsx";
import AdminAllorder from "./Pages/AdminAllorder.jsx";
import Adminshop from "./Pages/Adminshop.jsx";
import Electritioncreate from "./Pages/Electritioncreate.jsx";
import ElectricianMap from "./Pages/ElectricianMap.jsx";
import Pumbercreate from "./Pages/Pumbercreate.jsx";
import PlumberMap from "./Pages/PlumberMap.jsx";
import UserAllPlumberworker from "./Pages/UserAllPlumberworker.jsx";
import Userelectri from "./Pages/Userelectri.jsx";
import AdminAllworker from "./Pages/AdminAllworker";


function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen">
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/About" element={<About />} />
          <Route path="/Shop" element={<Shop />} />
          <Route path="/Contact" element={<Contact />} />

          <Route path="/Login" element={<Login />} />
          <Route path="/SiginUp" element={<Registration />} />

          <Route path="/booking" element={<Bookings />} />


          <Route path="/Electrition/:findMyWorkers" element={<EBooking />} />



<Route
  path="/PlumberBooking/:findMyWorkers"
  element={<Pbooking />}
/>




          <Route path="/admin/Categories" element={<Categories />} />


          <Route
            path="/plumbingorders/:orderFindoneobj"
            element={<Orders />}
          />

          <Route path="/admin/customers" element={<Customers />} />


          <Route path="Adminplumbingorder" element={<Adminplumbingorder />} />


          <Route path="/ElectritionOrder" element={<EBO />} />
          <Route path="/Plumberorder" element={<PBO />} />
          <Route path="/AdminEproductCraete" element={<Electerproduect />} />
          <Route path="/AdminPproductcreate" element={<Plumberproduct />} />
          <Route path="/AllElecterproduct" element={<AllElecterproduct />} />
          <Route path="/Allplumbingproduct" element={<Allplumberproduct />} />
          <Route path="/ElectricalShop" element={<ElectricalShop />} />
          <Route path="/PlumbingShop" element={<PlumbingShop />} />
          <Route path="/Electerproupdate/:allfindoneid" element={<Electerproupdate />} />
          <Route path="/plumbproupdate/:Allfindoneobj" element={<Plumbproupdate />} />
          <Route path="/ElectericalOrder/:orderFindoneobj" element={<AllOrder />} />
          <Route path="Adminelectericalorder" element={<Adminelectericalorder />} />
          <Route path="/onlineshopowerdashbord" element={<Shopdashbord />} />
          <Route path="/shoponwerallproduct" element={<Allproduct />} />
          <Route path="/shoponwerallorders" element={<AllEPorders />} />
          <Route path="/shopregfram" element={<Regshop/>} />
          <Route path="/Allseller" element={<Allseller/>} />
          <Route path="/Admindashbord" element={<Admindashbord/>} />
          <Route path="/Admin2ndsidebar" element= {<Admin2ndsidebar/>} />
          <Route path="/AdminAllproduct" element={<AdminAllproduct/>} />
          <Route path="/AdminAllorder" element={<AdminAllorder/>} />
          <Route path="/Adminshop" element={<Adminshop/>} />
          <Route path="/shopownerEC" element={<Electritioncreate/>} />
          <Route path="/AllElectricianworker" element={<ElectricianMap/>} />\
          <Route path="/Pumbercreate" element={<Pumbercreate/>} />
          <Route path="/AllPlumberworker" element={<PlumberMap />} />
          <Route path="/UserAllPlumberworker" element={<UserAllPlumberworker/>} />
          <Route path="/Userelectri" element={<Userelectri/>} />
          <Route path="/AdminAllworker" element={<AdminAllworker />} />
          <Route path="*" element={<Home />} />
          
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

