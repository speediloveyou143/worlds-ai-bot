import { Routes, Route } from "react-router-dom";
import Home from "./pages/student/Home";
import Courses from "./pages/student/Courses";
import Contact from "./pages/student/Contact";
import Signin from "./pages/authentication/Signin";
import Signup from "./pages/authentication/Signup";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/student/Profile";
import { BrowserRouter } from "react-router-dom";
import { Provider} from "react-redux";
import appStore from "./redux/appStore";
import Body from "./components/Body";
import Lectures from "./pages/student/Lectures";
import Resume from "./pages/student/Resume";
import Interview from "./pages/student/Interview";
import Editor from "./pages/student/Editor";
import Awards from "./pages/student/Awards";
import Invoice from "./pages/student/Invoice";
import AllCourses from "./pages/admin/AllCourses";
import AllUsers from "./pages/admin/AllUsers";
import CreateCourse from "./pages/admin/CreateCourse";
import CreateRoadmap from "./pages/admin/CreateRoadmap";
import UpdateCourse from "./pages/admin/UpdateCourse";
import AllRoadMaps from "./pages/admin/AllRoadMaps";
import UpdateRoadMap from "./pages/admin/UpdateRoadMap";
import CreateRecordings from "./pages/admin/CreateRecordings";
import AllRecordings from "./pages/admin/AllRecordings";
import UpdateRecordings from "./pages/admin/UpdateRecordings";
import UpdateUser from "./pages/admin/UpdateUser";
import UpdatePc from "./pages/admin/UpdatePc";
import UpdateIc from "./pages/admin/UpdateIc";
import BuyNow from "./pages/student/BuyNow";
import Recordings from "./pages/student/Recordings";
import UpdateCc from "./pages/admin/UpdateCc";
import UpdateInvoice from "./pages/admin/UpdateInvoice";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/courses" element={<Courses />}></Route>
              <Route path="/contact" element={<Contact />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/signin" element={<Signin />}></Route>
              <Route path="/buy-now/:id/:courseId" element={<BuyNow />}></Route>
              <Route path="/student-dashboard/profile" element={<StudentDashboard/>}>
                  <Route path="/student-dashboard/profile" element={<Profile/>}></Route>
                  <Route path="/student-dashboard/profile/lectures" element={<Lectures/>}></Route>
                  <Route path="/student-dashboard/profile/awards" element={<Awards/>}></Route>
                  <Route path="/student-dashboard/profile/resume-templates" element={<Resume/>}></Route>
                  <Route path="/student-dashboard/profile/interview-preparation" element={<Interview/>}></Route>
                  <Route path="/student-dashboard/profile/editor" element={<Editor/>}></Route>
                  <Route path="/student-dashboard/profile/invoice" element={<Invoice/>}></Route>
                  <Route path="/student-dashboard/profile/recordings/:id" element={<Recordings/>}></Route>
              </Route>
              <Route path="/admin-dashboard" element={<AdminDashboard/>}>
                  <Route path="/admin-dashboard" element={<Profile/>}></Route>
                  <Route path="/admin-dashboard/profile/all-users" element={<AllUsers/>}></Route>
                  <Route path="/admin-dashboard/profile/update-user/:id" element={<UpdateUser/>}></Route>
                  <Route path="/admin-dashboard/profile/update-pc/:id" element={<UpdatePc/>}></Route>
                  <Route path="/admin-dashboard/profile/update-ic/:id" element={<UpdateIc/>}></Route>
                  <Route path="/admin-dashboard/profile/update-cc/:id" element={<UpdateCc/>}></Route>
                  <Route path="/admin-dashboard/profile/update-invoice/:id" element={<UpdateInvoice/>}></Route>
                  <Route path="/admin-dashboard/profile/all-courses" element={<AllCourses/>}></Route>
                  <Route path="/admin-dashboard/profile/all-courses/:id" element={<UpdateCourse/>}></Route>
                  <Route path="/admin-dashboard/profile/all-roadmaps" element={<AllRoadMaps/>}></Route>
                  <Route path="/admin-dashboard/profile/create-course" element={<CreateCourse/>}></Route>
                  <Route path="/admin-dashboard/profile/create-road-map" element={<CreateRoadmap/>}></Route>
                  <Route path="/admin-dashboard/profile/update-road-map/:id" element={<UpdateRoadMap/>}></Route>
                  <Route path="/admin-dashboard/profile/create-recordings" element={<CreateRecordings/>}></Route>
                  <Route path="/admin-dashboard/profile/all-recordings" element={<AllRecordings/>}></Route>
                  <Route path="/admin-dashboard/profile/update-recordings/:id" element={<UpdateRecordings/>}></Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
