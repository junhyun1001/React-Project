import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import ChatPage from "./components/ChatPage/ChatPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/actions/user_action";

function App() {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      // 로그인 된 상태 => 채팅 페이지로 이동
      if (user) {
        navigate("/");
        dispatch(setUser(user)); // redux store에 유저 정보 저장

        const uid = user.uid;
      }
      // 로그인이 안된 상태 => 로그인 페이지로 이동
      else {
        navigate("/login");
        dispatch(clearUser()); // 로그아웃 후 redux에서 유저 정보 제거
      }
    });
  }, []);

  if (isLoading) {
    return <div>...loading</div>;
  } else {
    return (
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }
}

export default App;
