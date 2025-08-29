"use client";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SearchResults from "../components/SearchResults";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SearchResults />
      <Footer/>
    </div>
  );
}
