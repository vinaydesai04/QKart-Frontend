import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData || !productsData) return [];

  return cartData
    .map((cartItem) => {
      const product = productsData.find(
        (p) => p._id === cartItem.productId
      );
      if (!product) return null;

      return {
        ...product,
        productId: cartItem.productId,
        qty: cartItem.qty,
      };
    })
    .filter(Boolean);
};

export const getTotalCartValue = (items = []) => {
  if (!items.length) return 0;
  return items.reduce((total, item) => total + item.cost * item.qty, 0);
};

export const getTotalItems = (items = []) => {
  if (!items.length) return 0;
  return items.reduce((sum, item) => sum + item.qty, 0);
};

const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly = false,
}) => {
  if (isReadOnly) {
    return (
      <Box padding="0.5rem" data-testid="item-qty">
        Qty: {value}
      </Box>
    );
  }

  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly = false,
}) => {
  const history = useHistory();

  const handleCheckout = () => {
    history.push("/checkout");
  };

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {items.map((item) => (
          <Box
            key={item.productId}
            display="flex"
            alignItems="flex-start"
            padding="1rem"
          >
            <Box className="image-container">
              <img
                src={item.image}
                alt={item.name}
                width="100%"
                height="100%"
              />
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
              flexGrow={1}
            >
              <Box>{item.name}</Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ItemQuantity
                  value={item.qty}
                  handleAdd={() =>
                    handleQuantity &&
                    handleQuantity(item.productId, item.qty + 1)
                  }
                  handleDelete={() =>
                    handleQuantity &&
                    handleQuantity(item.productId, item.qty - 1)
                  }
                  isReadOnly={isReadOnly}
                />

                {/* Fix: Guaranteed exact string match for tests */}
                <Box padding="0.5rem" fontWeight="700">
                  {"$" + item.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            {"$" + getTotalCartValue(items)}
          </Box>
        </Box>

        {isReadOnly && (
          <Box padding="1rem" className="cart-footer">
            <Box color="#3C3C3C" fontWeight="700" marginBottom="0.5rem">
              Order Details
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              marginBottom="0.25rem"
            >
              <Box>Products</Box>
              <Box>{getTotalItems(items)}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box>Subtotal</Box>
              <Box>{"$" + getTotalCartValue(items)}</Box>
            </Box>
          </Box>
        )}

        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Cart;