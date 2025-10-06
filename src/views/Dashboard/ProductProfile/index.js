// Chakra imports
import { Flex } from "@chakra-ui/react";
import React from "react";
import ProductProfile from "./components/ProductProfile";

function ProductProfilePage() {
  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <ProductProfile />
    </Flex>
  );
}

export default ProductProfilePage;
