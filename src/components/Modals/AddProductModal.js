import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  VStack,
  HStack,
  Text,
  useToast,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useProducts } from '../../contexts/ProductContext';

export default function AddProductModal({ isOpen, onClose }) {
  const { addProduct } = useProducts();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    flavor: '',
    size: '',
    protein_per_serving: '',
    servings: '',
    type: '',
    image_url: '',
    stock: 0,
    cost_price: 0,
    selling_price: 0,
    supplier: '',
    supplier_contact: '',
    supplier_email: '',
    supplier_address: '',
    is_active: true,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateProfit = () => {
    const profit = formData.selling_price - formData.cost_price;
    const percentage = formData.cost_price > 0 
      ? ((profit / formData.cost_price) * 100).toFixed(2)
      : 0;
    return { profit, percentage };
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Product name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.category || !formData.category.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.supplier || !formData.supplier.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Supplier name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.cost_price < 0 || formData.selling_price < 0 || formData.stock < 0) {
      toast({
        title: 'Validation Error',
        description: 'Prices and stock cannot be negative',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      // Ensure numeric fields are properly formatted
      const productData = {
        ...formData,
        stock: parseInt(formData.stock) || 0,
        cost_price: parseFloat(formData.cost_price) || 0,
        selling_price: parseFloat(formData.selling_price) || 0,
      };
      
      await addProduct(productData);
      
      toast({
        title: 'Product Created',
        description: `${formData.name} has been added to inventory successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        brand: '',
        flavor: '',
        size: '',
        protein_per_serving: '',
        servings: '',
        type: '',
        image_url: '',
        stock: 0,
        cost_price: 0,
        selling_price: 0,
        supplier: '',
        supplier_contact: '',
        supplier_email: '',
        supplier_address: '',
        is_active: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const { profit, percentage } = calculateProfit();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Product</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Basic Information */}
            <Text fontWeight="bold" fontSize="lg" color="brand.600">Basic Information</Text>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Whey Protein Isolate"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Input
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    placeholder="e.g., Supplements"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Brand</FormLabel>
                  <Input
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    placeholder="e.g., Optimum Nutrition"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Input
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    placeholder="e.g., Protein Powder"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Flavor</FormLabel>
                  <Input
                    value={formData.flavor}
                    onChange={(e) => handleChange('flavor', e.target.value)}
                    placeholder="e.g., Chocolate"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Size</FormLabel>
                  <Input
                    value={formData.size}
                    onChange={(e) => handleChange('size', e.target.value)}
                    placeholder="e.g., 2kg"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Protein per Serving</FormLabel>
                  <Input
                    value={formData.protein_per_serving}
                    onChange={(e) => handleChange('protein_per_serving', e.target.value)}
                    placeholder="e.g., 25g"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Servings</FormLabel>
                  <Input
                    value={formData.servings}
                    onChange={(e) => handleChange('servings', e.target.value)}
                    placeholder="e.g., 60"
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Product description..."
                rows={3}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Image URL</FormLabel>
              <Input
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="https://example.com/product.jpg"
              />
            </FormControl>

            {/* Pricing & Stock */}
            <Text fontWeight="bold" fontSize="lg" color="brand.600" mt={4}>Pricing & Stock</Text>
            
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Stock Quantity</FormLabel>
                  <NumberInput
                    value={formData.stock}
                    onChange={(valueString) => handleChange('stock', parseInt(valueString) || 0)}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Cost Price (PKR)</FormLabel>
                  <NumberInput
                    value={formData.cost_price}
                    onChange={(valueString) => handleChange('cost_price', parseFloat(valueString) || 0)}
                    min={0}
                    precision={2}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Selling Price (PKR)</FormLabel>
                  <NumberInput
                    value={formData.selling_price}
                    onChange={(valueString) => handleChange('selling_price', parseFloat(valueString) || 0)}
                    min={0}
                    precision={2}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </GridItem>
            </Grid>

            {/* Profit Display */}
            <HStack
              p={3}
              bg={profit >= 0 ? 'green.50' : 'red.50'}
              borderRadius="md"
              justify="space-between"
            >
              <Text fontWeight="semibold">
                Profit: PKR {profit.toFixed(2)}
              </Text>
              <Text fontWeight="semibold">
                Margin: {percentage}%
              </Text>
            </HStack>

            {/* Supplier Information */}
            <Text fontWeight="bold" fontSize="lg" color="brand.600" mt={4}>Supplier Information</Text>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Supplier Name</FormLabel>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => handleChange('supplier', e.target.value)}
                    placeholder="e.g., Health Supplements Ltd"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Supplier Contact</FormLabel>
                  <Input
                    value={formData.supplier_contact}
                    onChange={(e) => handleChange('supplier_contact', e.target.value)}
                    placeholder="+92 321 1234567"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Supplier Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.supplier_email}
                    onChange={(e) => handleChange('supplier_email', e.target.value)}
                    placeholder="supplier@example.com"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Supplier Address</FormLabel>
                  <Input
                    value={formData.supplier_address}
                    onChange={(e) => handleChange('supplier_address', e.target.value)}
                    placeholder="Karachi, Pakistan"
                  />
                </FormControl>
              </GridItem>
            </Grid>

            {/* Status */}
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Active Product</FormLabel>
              <Switch
                isChecked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                colorScheme="brand"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button colorScheme="brand" onClick={handleSubmit} isLoading={loading}>
            Add Product
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

