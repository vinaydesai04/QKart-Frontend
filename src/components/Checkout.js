import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

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

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [address, setAddress] = useState("");
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  // ---------- Fetch products & cart ----------

  const performAPICall = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
      return [];
    }
  };

  const fetchCart = async () => {
    if (!token) {
      enqueueSnackbar("You must be logged in to access checkout", {
        variant: "warning",
      });
      history.push("/login");
      return;
    }

    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartData(response.data);
    } catch (error) {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await performAPICall();
      await fetchCart();
    };
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Derived items & totals ----------

  const items = generateCartItemsFrom(cartData, products);
  const total = getTotalCartValue(items);

  const walletBalance = Number(localStorage.getItem("balance")) || 0;

  // ---------- Place order ----------

  const handlePlaceOrder = async () => {
    if (!items.length) {
      enqueueSnackbar("Add items to cart to place an order", {
        variant: "warning",
      });
      return;
    }

    if (!selectedAddressId) {
      enqueueSnackbar("Select an address to place the order", {
        variant: "warning",
      });
      return;
    }

    if (total > walletBalance) {
      enqueueSnackbar("You do not have enough balance in wallet", {
        variant: "warning",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${config.endpoint}/cart/checkout`,
        {
          addressId: selectedAddressId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // success; redirect to thanks page or products
      enqueueSnackbar("Order placed successfully", { variant: "success" });
      history.push("/thanks");
    } catch (error) {
      enqueueSnackbar(
        "Could not place order. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
    }
  };

  // NOTE: For Milestone‑5 they mostly care that:
  // - Checkout shows the cart summary using <Cart isReadOnly ...>
  // - Wallet text shows getTotalCartValue(items) and balance

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
              {/* You will add address UI / selection here in later checkout milestones */}
            </Box>

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${total} of available ${walletBalance}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={handlePlaceOrder}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly products={products} items={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;