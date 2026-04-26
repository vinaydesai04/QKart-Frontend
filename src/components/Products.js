import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
<<<<<<< ours
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [cartData, setCartData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // ---------------- Products APIs ----------------

  const performAPICall = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }

      return [];
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await performAPICall();

      const token = localStorage.getItem("token");
      if (token) {
        await fetchCart(token);
      }
    };
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performSearch = async (text) => {
    if (!text) {
      await performAPICall();
      return [];
    }

    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProducts(response.data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setProducts([]);
        return [];
      }

      enqueueSnackbar(
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
      return [];
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    setSearchText(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      performSearch(value);
    }, 500);

    setDebounceTimeout(newTimeout);
  };

  // ---------------- Cart APIs & handlers ----------------

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("Login to view cart", { variant: "warning" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const handleQuantity = async (productId, qty) => {
    const token = localStorage.getItem("token");
    if (!token) {
      enqueueSnackbar("Login to modify the cart", { variant: "warning" });
      return;
    }

    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCartData(response.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not update cart. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const isItemInCart = (items, productId) => {
    return items.some((item) => item.productId === productId);
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      enqueueSnackbar("Login to add an item to the cart", {
        variant: "warning",
      });
      return;
    }

    if (isItemInCart(cartData, product._id)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }

    await handleQuantity(product._id, 1);
  };

  // ---------------- Derived cart items for UI ----------------

  const cartItems = generateCartItemsFrom(cartData, products);

  // ---------------- JSX ----------------
=======


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {

  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
  };

  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
  };

  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
  };






>>>>>>> theirs

  return (
    <div>
      <Header>
<<<<<<< ours
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          value={searchText}
          onChange={(event) => debounceSearch(event, debounceTimeout)}
        />
      </Header>

      {/* Search view for mobiles */}
=======

      </Header>

>>>>>>> theirs
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
<<<<<<< ours
        value={searchText}
        onChange={(event) => debounceSearch(event, debounceTimeout)}
      />

      {/* Hero section – same as original */}
      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
      </Grid>

      {/* Products + Cart area */}
      {isLoading ? (
        <Box className="loading">
          <CircularProgress />
          <span>Loading Products</span>
        </Box>
      ) : products.length === 0 ? (
        <Box className="loading">
          <SentimentDissatisfied />
          <span>No products found</span>
        </Box>
      ) : (
        <Grid container spacing={2} className="product-grid">
          {/* Products section */}
          <Grid item xs={12} md={isLoggedIn ? 9 : 12}>
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard
                    product={product}
                    handleAddToCart={() => handleAddToCart(product)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Cart section - only when logged in */}
          {isLoggedIn && (
            <Grid item xs={12} md={3}>
              <Cart
                products={products}
                items={cartItems}
                handleQuantity={handleQuantity}
              />
            </Grid>
          )}
        </Grid>
      )}

=======
      />
>>>>>>> theirs
      <Footer />
    </div>
  );
};

<<<<<<< ours
export default Products;
=======
export default Products;
>>>>>>> theirs
