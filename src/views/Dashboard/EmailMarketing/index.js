import React from "react";
import { Box } from "@chakra-ui/react";
import EmailMarketingTable from "./components/EmailMarketingTable";

export default function EmailMarketing() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <EmailMarketingTable />
    </Box>
  );
}
