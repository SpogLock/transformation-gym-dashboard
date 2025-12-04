import React from 'react';
import {
  HStack,
  Button,
  Text,
  Select,
  useColorModeValue,
  Box,
  IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  perPage = 100,
  total = 0,
  onPageChange,
  onPerPageChange,
  showPerPage = true,
}) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');

  const handlePageChange = (newPage) => {
    const safeTotalPages = Math.max(1, totalPages || 1);
    if (newPage >= 1 && newPage <= safeTotalPages && newPage !== currentPage && onPageChange) {
      onPageChange(newPage);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const safeTotalPages = Math.max(1, totalPages || 1);
    const safeCurrentPage = Math.max(1, Math.min(currentPage || 1, safeTotalPages));
    
    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (safeCurrentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(safeTotalPages);
      } else if (safeCurrentPage >= safeTotalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = safeTotalPages - 4; i <= safeTotalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = safeCurrentPage - 1; i <= safeCurrentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(safeTotalPages);
      }
    }
    
    return pages;
  };

  // Handle "all" per page option
  const isAllPerPage = perPage === 'all' || perPage === 0;
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safeCurrentPage = Math.max(1, Math.min(currentPage || 1, safeTotalPages));
  const from = total === 0 ? 0 : (isAllPerPage ? 1 : (safeCurrentPage - 1) * perPage + 1);
  const to = isAllPerPage ? total : Math.min(safeCurrentPage * perPage, total);

  // Don't show pagination if there's no data
  if (total === 0) {
    return null;
  }

  return (
    <Box
      py={4}
      px={4}
      borderTop="1px solid"
      borderColor={borderColor}
      bg={bgColor}
    >
      <HStack justify="space-between" flexWrap="wrap" gap={4}>
        <HStack spacing={2}>
          <Text fontSize="sm" color={textColor}>
            Showing {from} to {to} of {total} entries
          </Text>
        </HStack>

        <HStack spacing={2}>
          {showPerPage && (
            <HStack spacing={2}>
              <Text fontSize="sm" color={textColor}>
                Per page:
              </Text>
              <Select
                size="sm"
                value={perPage === 'all' || perPage === 0 ? 'all' : perPage}
                onChange={(e) => {
                  if (onPerPageChange) {
                    const value = e.target.value;
                    onPerPageChange(value === 'all' ? 'all' : Number(value));
                  }
                }}
                w="100px"
                bg={bgColor}
                borderColor={borderColor}
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
                <option value="all">All</option>
              </Select>
            </HStack>
          )}

          {/* Page Navigation - Always show navigation buttons */}
          <HStack spacing={1}>
            <Button
              leftIcon={<ChevronLeftIcon />}
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              isDisabled={safeCurrentPage === 1 || isAllPerPage}
              size="sm"
              variant="outline"
              colorScheme="brand"
            >
              Previous
            </Button>

            {!isAllPerPage && getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <Text key={`ellipsis-${index}`} px={2} color={textColor}>
                    ...
                  </Text>
                );
              }

              return (
                <Button
                  key={page}
                  size="sm"
                  variant={safeCurrentPage === page ? 'solid' : 'outline'}
                  colorScheme={safeCurrentPage === page ? 'brand' : 'gray'}
                  onClick={() => handlePageChange(page)}
                  minW="40px"
                >
                  {page}
                </Button>
              );
            })}

            <Button
              rightIcon={<ChevronRightIcon />}
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              isDisabled={safeCurrentPage === safeTotalPages || isAllPerPage}
              size="sm"
              variant="outline"
              colorScheme="brand"
            >
              Next
            </Button>
          </HStack>
        </HStack>
      </HStack>
    </Box>
  );
};

export default Pagination;

