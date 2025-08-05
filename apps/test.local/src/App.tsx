// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AbstractWalletProvider from "./providers/AbstractWalletProvider";

import MenuLayout from "./layouts/menu_layout";

import HomePage from "./views/home";
import LeaderboardPage from "./views/leaderboard";
import ProfilePage from "./views/profile";


function App() {
  return (
    <AbstractWalletProvider>
      <BrowserRouter>
        <Routes>
          {/* Layout commun à toutes les pages après login */}
          <Route element={<MenuLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AbstractWalletProvider>
  );
}

export default App;
