import { useState, useEffect } from "react";
import Categories from "../compound/categories";
import Products from "../compound/Products";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import {SkeletonCard} from "../styling/skelton";
import { apiUrl } from "../utils/api";

function Home() {
    const [products, setProducts] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const {cartItems}=useCart()


    const lenOfCart=Object.keys(cartItems).length;
    



    useEffect(() => {
        const getdata = async () => {
            setLoading(true);
            try{
                const reponse = await fetch(apiUrl("/getProducts"));
                if (!reponse.ok) {
                    throw new Error(`Request failed with status ${reponse.status}`);
                }
                const data = await reponse.json();

                const categoryList = Array.isArray(data)
                    ? (data[0]?.categories || [])
                    : (data?.categories || []);

                setProducts(categoryList);
                setFilteredProducts(categoryList);
                setLoading(false);
            }                                                    
            catch(error) {
                console.error("Error fetching data:", error);
                setFilteredProducts([])
                setProducts([])
                setLoading(false);
            }
        };
        getdata();
    }, []);


    const callBack = (category) => {
        if(category === "All"){
            setFilteredProducts(products);
        }
        else{
            const filtered = products.filter(each => each.name === category);
            setFilteredProducts(filtered);
        }
    }
    
   return (
    <div className="m-0">

        {/* Hero Section */}
        <section className="bg-green-700 text-white py-16 px-6 text-center">
            <h1 className="text-5xl font-bold mb-4">
                Sri Lakshmi Super Mart
            </h1>

            <p className="text-xl max-w-3xl mx-auto">
                Fresh groceries, quality products and trusted service for every family.
            </p>

            <button className="mt-6 bg-white text-green-700 px-6 py-3 rounded-lg font-bold">
                Shop Now
            </button>
        </section>

        {/* About Us */}
<section id="about" className="py-12 px-6 bg-white text-center">            <h2 className="text-3xl font-bold mb-4">
                About Us
            </h2>

            <p className="max-w-4xl mx-auto text-gray-700">
                Sri Lakshmi Super Mart is a trusted neighborhood grocery store
                providing fresh fruits, vegetables, daily essentials and household
                products at affordable prices.
            </p>
        </section>

        {/* Why Choose Us */}
<section id="contact" className="py-12 bg-white text-center">            <h2 className="text-3xl font-bold text-center mb-8">
                Why Choose Us
            </h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-xl mb-2">
                        Fresh Products
                    </h3>
                    <p>Quality products sourced daily.</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-xl mb-2">
                        Affordable Prices
                    </h3>
                    <p>Best prices for every family.</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-xl mb-2">
                        Trusted Service
                    </h3>
                    <p>Serving local customers with care.</p>
                </div>

            </div>
        </section>

        <h2 className="text-3xl font-bold text-center mt-10 mb-6">
            Featured Products
        </h2>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-3 sm:p-5 lg:flex-row lg:gap-6">
                   <div className="mb-2 md:mb-0">
                        <Categories props={products} callBack={callBack}/>
                    </div>
            
               <div className="flex-1 flex flex-col gap-5 sm:gap-8">
                    {isLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, index) => (
                                <SkeletonCard key={index} />
                                ))}
                            </div>
                    ) : filteredProducts.length > 0 ? (filteredProducts.map(each => <Products pros={each} key={each.name} />)
                    ) : (
                        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
Fresh Fruits
Vegetables
Dairy Products
Household Essentials
Daily Grocery Needs                        </div>
                    )}
                </div>
            </div>
      {/* Testimonials */}
<section className="py-12 bg-gray-100">
  <h2 className="text-3xl font-bold text-center mb-8">
    Customer Reviews
  </h2>

  <div className="grid md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto">
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-2xl">⭐⭐⭐⭐⭐</p>
      <p className="mt-3">Fresh products and great service.</p>
      <h4 className="font-bold mt-3">Ravi Kumar</h4>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-2xl">⭐⭐⭐⭐⭐</p>
      <p className="mt-3">Best grocery store in our area.</p>
      <h4 className="font-bold mt-3">Priya Sharma</h4>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-2xl">⭐⭐⭐⭐⭐</p>
      <p className="mt-3">Affordable prices and quality products.</p>
      <h4 className="font-bold mt-3">Suresh Reddy</h4>
    </div>
  </div>
</section>

{/* Business Hours */}
<section className="py-12 text-center bg-white">
  <h2 className="text-3xl font-bold mb-6">
    Business Hours
  </h2>

  <p className="text-lg">Monday - Saturday : 8:00 AM - 9:00 PM</p>
  <p className="text-lg">Sunday : 9:00 AM - 7:00 PM</p>
</section>

{/* Contact Us */}
<section className="py-12 bg-gray-100 text-center">
  <h2 className="text-3xl font-bold mb-6">
    Contact Us
  </h2>

  <p className="text-lg">📞 +91 98765 43210</p>
  <p className="text-lg">📧 contact@srilakshmimart.com</p>
<section className="py-12 bg-white">
  <h2 className="text-3xl font-bold text-center mb-6">
    Find Us
  </h2>

  <div className="max-w-5xl mx-auto px-4">
    <iframe
      title="map"
      className="w-full h-80 rounded-lg"
      src="https://maps.google.com/maps?q=Vijayawada&t=&z=13&ie=UTF8&iwloc=&output=embed"
    />
  </div>
</section>
<footer className="bg-green-700 text-white text-center py-6">
  <h3 className="font-bold text-xl">
    Sri Lakshmi Super Mart
  </h3>

  <p>Fresh Products • Affordable Prices • Trusted Service</p>

  <p className="mt-2">
    © 2026 Sri Lakshmi Super Mart. All Rights Reserved.
  </p>
</footer>
  <p className="mt-3 text-lg">
    MG Road, Vijayawada, Andhra Pradesh
  </p>
</section>

            {lenOfCart > 0 ? (
                <Link
                    to="/cart"
                    className="flex items-center justify-around gap-2 sm:gap-4 fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 bg-green-500 px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-xl hover:bg-green-600 transition duration-300 z-50 w-[92vw] max-w-md">
                    <img className="h-8 w-8 sm:h-10 sm:w-10"  alt="cart" src="https://pngimg.com/d/shopping_cart_PNG10.png"/>
                    <div>
                        <p className="font-bold text-sm sm:text-md"> View Cart  </p>
                        <p className="text-xs sm:text-base"> {lenOfCart} items</p>
                    </div>
                    <p className="font-bold text-2xl sm:text-3xl"> &gt;</p>  
                </Link>):null
            }
        </div>
    );
}

export default Home;

