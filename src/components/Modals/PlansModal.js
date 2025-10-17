import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Button, Flex, Input, FormControl, FormLabel, Switch, useToast, Table, Thead, Tr, Th, Tbody, Td,
  HStack, Text, useColorModeValue, Badge, Box
} from '@chakra-ui/react';
import { getPlans, createPlan, updatePlan, deletePlan } from 'services/planService';

const emptyForm = { name: '', description: '', monthly_fee: '', registration_fee: '', is_active: true };

export default function PlansModal({ isOpen, onClose }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const toast = useToast();
  const textColor = useColorModeValue('gray.700', 'white');
  const subtleText = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const loadPlans = async () => {
    setLoading(true);
    try {
      const paginator = await getPlans({ per_page: 100 });
      setPlans(paginator?.data || []);
    } catch (e) {
      toast({ title: 'Failed to load plans', description: e.message, status: 'error', duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isOpen) loadPlans(); }, [isOpen]);

  const resetForm = () => { setEditing(null); setForm(emptyForm); };

  const handleSave = async () => {
    const trimmedName = (form.name || '').trim();
    const monthly = String(form.monthly_fee || '').trim();
    const registration = String(form.registration_fee || '').trim();

    if (!trimmedName || !monthly || !registration) {
      toast({
        title: 'Missing required fields',
        description: 'Please provide Name, Monthly Fee and Registration Fee.',
        status: 'warning', duration: 2500, isClosable: true
      });
      return;
    }

    const payload = {
      name: trimmedName,
      description: (form.description || '').trim(),
      // Send alternative keys too; backend normalizes both
      monthly_fee: Number(monthly.replace(/[^0-9.]/g, '')),
      registration_fee: Number(registration.replace(/[^0-9.]/g, '')),
      monthlyFee: Number(monthly.replace(/[^0-9.]/g, '')),
      registrationFee: Number(registration.replace(/[^0-9.]/g, '')),
      isActive: !!form.is_active,
      is_active: !!form.is_active,
    };

    setSaving(true);
    try {
      if (editing) {
        const updated = await updatePlan(editing.id, payload);
        setPlans(prev => prev.map(p => p.id === editing.id ? updated : p));
        toast({ title: 'Plan updated', status: 'success', duration: 2000, isClosable: true });
      } else {
        const created = await createPlan(payload);
        setPlans(prev => [created, ...prev]);
        toast({ title: 'Plan created', status: 'success', duration: 2000, isClosable: true });
      }
      resetForm();
    } catch (e) {
      const message = typeof e === 'object' && e != null && e.message ? e.message : 'Save failed';
      toast({ title: 'Save failed', description: message, status: 'error', duration: 4000, isClosable: true });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (plan) => {
    setEditing(plan);
    setForm({
      name: plan.name || '',
      description: plan.description || '',
      monthly_fee: plan.monthly_fee || '',
      registration_fee: plan.registration_fee || '',
      is_active: !!plan.is_active,
    });
  };

  const handleDelete = async (plan) => {
    if (!window.confirm(`Delete plan "${plan.name}"?`)) return;
    try {
      await deletePlan(plan.id);
      setPlans(prev => prev.filter(p => p.id !== plan.id));
      toast({ title: 'Plan deleted', status: 'success', duration: 2000, isClosable: true });
    } catch (e) {
      toast({ title: 'Delete failed', description: e.message, status: 'error', duration: 3500, isClosable: true });
    }
  };

  const filteredPlans = useMemo(() => {
    if (!search) return plans;
    const q = search.toLowerCase();
    return plans.filter(p => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
  }, [plans, search]);

  const isValid = (form.name || '').trim() && String(form.monthly_fee || '').trim() && String(form.registration_fee || '').trim();

  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} size='6xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={textColor}>Manage Plans</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={{ base: 'column', xl: 'row' }} gap={8}>
            {/* Left: Plans list */}
            <Flex direction='column' flex='3' minW={0}>
              <HStack mb={3} justify='space-between'>
                <Text fontWeight='semibold' color={textColor}>Plans</Text>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search plans...' size='sm' maxW='260px' />
              </HStack>
              <Box border='1px solid' borderColor={borderColor} borderRadius='8px' overflow='hidden'>
                <Box maxH='300px' overflowY='auto'>
                  <Table size='sm'>
                    <Thead position='sticky' top={0} bg='rgba(0,0,0,0.02)'>
                      <Tr>
                        <Th>Name</Th>
                        <Th isNumeric>Monthly</Th>
                        <Th isNumeric>Registration</Th>
                        <Th>Active</Th>
                        <Th width='120px'></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredPlans.map(plan => (
                        <Tr key={plan.id} _hover={{ bg: 'blackAlpha.50' }}>
                          <Td>
                            <HStack spacing={2}>
                              <Text>{plan.name}</Text>
                              {editing && editing.id === plan.id && <Badge colorScheme='purple'>Editing</Badge>}
                            </HStack>
                          </Td>
                          <Td isNumeric>₨{Number(plan.monthly_fee).toLocaleString()}</Td>
                          <Td isNumeric>₨{Number(plan.registration_fee).toLocaleString()}</Td>
                          <Td>
                            <Badge colorScheme={plan.is_active ? 'green' : 'gray'}>{plan.is_active ? 'Active' : 'Inactive'}</Badge>
                          </Td>
                          <Td>
                            <HStack justify='end'>
                              <Button size='xs' variant='outline' onClick={() => handleEdit(plan)}>Edit</Button>
                              <Button size='xs' colorScheme='red' onClick={() => handleDelete(plan)}>Delete</Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
                {filteredPlans.length === 0 && <Text p={4} fontSize='sm' color={subtleText}>No plans found.</Text>}
              </Box>
            </Flex>

            {/* Right: Create / Edit form */}
            <Flex direction='column' flex='2' minW={{ base: '100%', xl: '360px' }} gap={3}>
              <Text fontWeight='semibold' color={textColor}>{editing ? 'Edit Plan' : 'Create Plan'}</Text>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder='Plan name' />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder='Short description' />
              </FormControl>
              <HStack>
                <FormControl>
                  <FormLabel>Monthly Fee</FormLabel>
                  <Input value={form.monthly_fee} onChange={e => setForm(f => ({ ...f, monthly_fee: e.target.value }))} placeholder='e.g. 3000' />
                </FormControl>
                <FormControl>
                  <FormLabel>Registration Fee</FormLabel>
                  <Input value={form.registration_fee} onChange={e => setForm(f => ({ ...f, registration_fee: e.target.value }))} placeholder='e.g. 1500' />
                </FormControl>
              </HStack>
              <FormControl display='flex' alignItems='center'>
                <FormLabel mb='0'>Active</FormLabel>
                <Switch colorScheme='brand' isChecked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
              </FormControl>
              <HStack>
                <Button colorScheme='brand' onClick={handleSave} isDisabled={!isValid} isLoading={saving}>{editing ? 'Update Plan' : 'Create Plan'}</Button>
                {editing && <Button onClick={resetForm} variant='ghost'>Cancel</Button>}
              </HStack>
              <Text fontSize='xs' color={subtleText}>Values are saved immediately to the server.</Text>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => { resetForm(); onClose(); }}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


