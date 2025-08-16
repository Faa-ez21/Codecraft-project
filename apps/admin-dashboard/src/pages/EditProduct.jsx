import React from "react";
import { useParams } from "react-router-dom";
import AddProduct from "./AddProduct";

export default function EditProduct() {
  const { id } = useParams();

  return <AddProduct productId={id} />;
}
