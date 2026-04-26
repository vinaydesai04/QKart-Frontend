import { CreditCard, Delete } from "@mui/icons-material";
import {
  Alert,
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

const AddNewAddressView = ({
  token,
  newAddress,
  handleNewAddress,
  addAddress,
}) => {
  return (
    <Box display="flex" flexDirection="column" my="1rem">
      <TextField
        multiline
        minRows={4}
        placeholder="Enter your complete address"
        value={newAddress.value}
        onChange={(e) =>
          handleNewAddress((prev) => ({
            ...prev,
            value: e.target.value,
          }))
        }
      />
      <Stack direction="row" my="1rem" spacing={2}>
        <Button
          variant="contained"
          onClick={async () => {
            await addAddress(token, newAddress);
          }}
        >
          Add
        </Button>
        <Button
          variant="text"
          onClick={() =>
            handleNewAddress({
              isAddingNewAddress: false,
              value: "",
            })
          }
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

const Checkout = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });

  const token = localStorage.getItem("token");

  const getProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const fetchCart = async (token) => {
    if (!token) {
      enqueueSnackbar("You must be logged in to access checkout page", {
        variant: "info",
      });
      history.push("/login");
      return null;
    }

    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
      return null;
    }
  };

  const getAddresses = async (token) => {
    if (!token) return null;

    try {
      const response = await axios.get(`${config.endpoint}/user/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const list = response.data;
      setAddresses((prev) => ({
        ...prev,
        all: list,
      }));
      return list;
    } catch {
      enqueueSnackbar(
        "Could not fetch addresses. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
      return null;
    }
  };

  const addAddress = async (token, newAddress) => {
    if (!newAddress.value.trim()) {
      enqueueSnackbar("Please enter a valid address to add", {
        variant: "warning",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${config.endpoint}/user/addresses`,
        { address: newAddress.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedList = response.data;
      setAddresses((prev) => ({
        ...prev,
        all: updatedList,
      }));

      setNewAddress({
        isAddingNewAddress: false,
        value: "",
      });

      enqueueSnackbar("Address added successfully", { variant: "success" });

      return updatedList;
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not add this address. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
      return null;
    }
  };

  const deleteAddress = async (token, addressId) => {
    try {
      const response = await axios.delete(
        `${config.endpoint}/user/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedList = response.data;

      setAddresses((prev) => {
        let newSelected = prev.selected;
        if (prev.selected === addressId) {
          newSelected = "";
        }
        return {
          ...prev,
          all: updatedList,
          selected: newSelected,
        };
      });

      enqueueSnackbar("Address deleted successfully", { variant: "success" });

      return updatedList;
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
      return null;
    }
  };

  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await getProducts();
      const cartData = await fetchCart(token);
      await getAddresses(token);

      if (productsData && cartData) {
        const cartDetails = generateCartItemsFrom(cartData, productsData);
        setItems(cartDetails);
      }
    };

    onLoadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const walletBalance = Number(localStorage.getItem("balance")) || 0;
  const total = getTotalCartValue(items);

 // ---------- M5: validateRequest ----------
 const validateRequest = (items, addresses) => {
  // 1. Check if they have any addresses at all
  if (!addresses.all.length) {
    enqueueSnackbar("Please add a new address before proceeding.", {
      variant: "warning",
    });
    return false;
  }

  // 2. Check if they have actually selected one
  if (!addresses.selected) {
    enqueueSnackbar("Please select one shipping address to proceed.", {
      variant: "warning",
    });
    return false;
  }

  // 3. Finally, check if they can afford it
  if (total > walletBalance) {
    enqueueSnackbar(
      "You do not have enough balance in your wallet for this purchase",
      { variant: "warning" }
    );
    return false;
  }

  return true;
};

  const performCheckout = async (token, items, addresses) => {
    try {
      const response = await axios.post(
        `${config.endpoint}/cart/checkout`,
        { addressId: addresses.selected },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        const newBalance = walletBalance - total;
        localStorage.setItem("balance", newBalance);

        enqueueSnackbar("Order placed successfully", { variant: "success" });

        history.push("/thanks");
        return true;
      } else {
        enqueueSnackbar(
          (response.data && response.data.message) ||
            "Could not place order. Please try again.",
          { variant: "error" }
        );
        return false;
      }
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not place order. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    if (!items.length) {
      enqueueSnackbar("Add items to cart to place an order", {
        variant: "warning",
      });
      return;
    }

    const isValid = validateRequest(items, addresses);
    if (!isValid) return;

    await performCheckout(token, items, addresses);
  };

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

            <Box my="1rem">
              {addresses.all.length === 0 ? (
                <Typography my="1rem">
                  No addresses found for this account. Please add one to proceed
                </Typography>
              ) : (
                <Box>
                  {addresses.all.map((addr) => {
                    const isSelected = addresses.selected === addr._id;
                    return (
                      <Box
                        key={addr._id}
                        className={`address-item ${
                          isSelected ? "selected" : "not-selected"
                        }`}
                        onClick={() =>
                          setAddresses((prev) => ({
                            ...prev,
                            selected: addr._id,
                          }))
                        }
                      >
                        <Box>{addr.address}</Box>
                        <Button
                          variant="text"
                          color="error"
                          startIcon={<Delete />}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAddress(token, addr._id);
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>

            {newAddress.isAddingNewAddress ? (
              <AddNewAddressView
                token={token}
                newAddress={newAddress}
                handleNewAddress={setNewAddress}
                addAddress={addAddress}
              />
            ) : (
              <Button
                color="primary"
                variant="contained"
                id="add-new-btn"
                size="large"
                onClick={() =>
                  setNewAddress({
                    isAddingNewAddress: true,
                    value: "",
                  })
                }
              >
                Add new address
              </Button>
            )}

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