import React from "react";
import { Box } from "@chakra-ui/react";
import InvoiceDetail from "./components/InvoiceDetail";

export default function InvoiceDetailPage() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <InvoiceDetail />
    </Box>
  );
}
