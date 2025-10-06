import React from "react";
import { Box } from "@chakra-ui/react";
import InvoicesTable from "./components/InvoicesTable";

export default function Invoices() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <InvoicesTable />
    </Box>
  );
}
