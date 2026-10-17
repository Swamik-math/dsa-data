import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import ImageGalleryTest from "./components/ImageGalleryTest";

// Simple Job Detail Page
const JobDetailPage: React.FC = () => (
  <div className="min-h-[calc(100vh-200px)] px-5 py-20">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-5xl font-bold mb-8">Job Details</h1>
      <p className="text-lg leading-relaxed text-gray-700">
        Detailed job description would appear here. This could include responsibilities,
        requirements, benefits, and application instructions.
      </p>
    </div>
  </div>
);

// Join Page Component
const JoinPage: React.FC = () => (
  <div className="min-h-[calc(100vh-200px)] px-5 py-20">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-5xl font-bold mb-8">Join Our Community</h1>
      <p className="text-lg leading-relaxed text-gray-700">
        Join our community to get updates on new properties, virtual tours, and real estate insights.
      </p>
    </div>
  </div>
);

function App(): React.ReactElement {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:jobId" element={<JobDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/test-images" element={<ImageGalleryTest />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
