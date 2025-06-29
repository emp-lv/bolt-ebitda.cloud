import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Featured from './pages/featured';
import Pricing from './pages/pricing';
import Privacy from './pages/privacy';
import Terms from './pages/terms';
import FAQ from './pages/faq';
import About from './pages/about';
import Integrations from './pages/integrations';
import Features from './pages/features';
import Team from './pages/team';
import Stream from './pages/stream';
import EditProfile from './pages/editProfile';
import UserSettings from './pages/userSettings';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import ResetPassword from './pages/resetPassword';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/featured" element={<Featured />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/features" element={<Features />} />
        <Route path="/team" element={<Team />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile/:profileId/edit" element={<EditProfile />} />
        <Route path="/profile/:profileId" element={<Stream />} />
      </Routes>
    </Router>
  );
}

export default App;