// Chakra imports
import { Flex } from "@chakra-ui/react";
import React from "react";
import InventoryTable from "./components/InventoryTable";

function InventoryManagement() {
  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <InventoryTable
        title={"Inventory Management"}
      />
    </Flex>
  );
}

export default InventoryManagement;
