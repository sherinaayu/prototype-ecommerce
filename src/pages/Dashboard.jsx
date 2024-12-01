import React, { useCallback, useContext, useEffect, useState } from "react";
import AppNavbar from "../components/Navbar";
import User from "../context";
import ProductCard from "../components/ProductCard";
import { message } from "antd";
import { useSearchParams } from "react-router-dom";
import CardSpacer from "../components/CardSpacer";
import { collection, getDocs, auth, signOut } from "../db/index";
import { db } from "../db/index";
import dummyProducts from "../db/dummyData"; // Impor data dummy

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  let [searchParams, setSearchParams] = useSearchParams();

  // Fetching all products (menggunakan data dummy)
  const fetchData = useCallback(() => {
    // Set loading true
    setLoading(true);
    
    // Simulasikan pengambilan data
    setTimeout(() => {
      // Menggunakan data dummy
      setProducts(dummyProducts);
      setLoading(false);
    }, 1000); // Simulasi delay 1 detik
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetching products based on categories
  useEffect(() => {
    const category = searchParams.get("categories");
    setLoading(true);
    if (category && category !== "all") {
      const filteredProducts = dummyProducts.filter(product => product.category === category);
      setProducts(filteredProducts);
      setLoading(false);
    } else {
      fetchData();
    }
  }, [searchParams]);

  const user = useContext(User);

  // Logout function
  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User Logged out");
        message.success("User logged out successfully");
        user.setIsLogin(false);
      })
      .catch((error) => {
        console.log(error);
        message.error("An error occurred while logging out");
      });
  };

  return (
    <div>
      <AppNavbar status={user.login} logOut={logOut} />
      {loading ? <CardSpacer /> : <ProductCard list={products} />}
    </div>
  );
};

export default Dashboard;