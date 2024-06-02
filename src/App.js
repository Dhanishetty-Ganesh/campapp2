import './App.css';
import CampLogin from './components/CampLogin'
import CampHome from './components/CampHome'
import {Routes,Route,BrowserRouter, useNavigate} from 'react-router-dom'
import D2D from './components/D2D';
// import Footer from './components/Footer';
import Cookies from 'js-cookie'
import "./index.css"
import YC from './components/TopTabs/YC';
import SI from './components/TopTabs/SI';
import SS from './components/TopTabs/SS';
import Photos from './components/TopTabs/Photos';
import Youtuber from './components/TopTabs/Youtuber';
import Report from './components/BottomTabs/Report';
import Trainings from './components/BottomTabs/Trainings';
import Task from './components/BottomTabs/Task';
import Team from './components/BottomTabs/Team';
import Profile from './components/BottomTabs/Profile';
import Maps from "./components/TopTabs/Maps"
import Whatsapp from './components/TopTabs/Whatsapp';
import CampRegister from './components/CampRegister'
import RegistrationPending from './components/RegistrationPending';
import SelectCamp from './components/SelectCamp';
import AdminReport from './components/AdminReport'
import CampRegistrations from './components/CampRegistrations'
import SubAdmin from './components/SubAdmin'
import AdminTeam from './components/AdminTeam';
import Attendance from './components/Attendance';

const App = () => {
  const userexists = Cookies.get("campuseremail");
  const isadmin = Cookies.get("isAdmin");
  const issubadmin = Cookies.get("isSubAdmin");
  return (
  <BrowserRouter>
  <Routes>
    {userexists===undefined && <Route exact path="/" element={<CampLogin/>}/>}
    {(userexists && (isadmin!=="true" && issubadmin!=="true")) && <Route exact path="/" element={<Report/>}/>}
    {(userexists && (isadmin==="true" || issubadmin==="true")) && <Route exact path="/" element={<AdminReport/>}/>}
    <Route exact path="/adminreport" element={<AdminReport/>}/>
    <Route exact path="/campregistrations" element={<CampRegistrations/>}/>
    <Route exact path="/camphome" element={<CampHome/>}/>
    <Route exact path="/campregister" element={<CampRegister/>}/>
    <Route exact path="/subadmin" element={<SubAdmin/>}/>
    <Route exact path="/adminteam" element={<AdminTeam/>}/>
    <Route exact path="/adminattendance" element={<Attendance/>}/>
    <Route exact path="/regpending" element={<RegistrationPending/>}/>
    <Route exact path="/selectcamp" element={<SelectCamp/>}/>
    <Route path="/d2d" element={<D2D />} />
    <Route path="/yc" element={<YC />} />
    <Route path="/si" element={<SI />} />
    <Route path="/ss" element={<SS />} />
    <Route path="/youtuber" element={<Youtuber />} />
    <Route path="/photos" element={<Photos />} />
   <Route path="/report" element={<Report />} />
    <Route path="/trainings" element={<Trainings />} />
    <Route path="/task" element={<Task />} />
    <Route path="/team" element={<Team />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/maps" element={<Maps />} />
    <Route path="/whatsapp" element={<Whatsapp />} />
  </Routes>
  </BrowserRouter>
  )
}

export default App;
