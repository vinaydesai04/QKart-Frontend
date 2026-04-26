import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        className="card-media"
      />
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="h6" gutterBottom>
          ${product.cost}
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddShoppingCartOutlined />}
          onClick={handleAddToCart}
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;