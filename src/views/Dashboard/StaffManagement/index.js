import React from "react";
import { Flex } from "@chakra-ui/react";
import StaffTable from "./components/StaffTable";

function StaffManagement() {
  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <StaffTable />
    </Flex>
  );
}

export default StaffManagement;


