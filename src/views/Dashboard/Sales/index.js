import React from "react";
import { Box } from "@chakra-ui/react";
import SalesTable from "./components/SalesTable";

export default function Sales() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SalesTable />
    </Box>
  );
}
