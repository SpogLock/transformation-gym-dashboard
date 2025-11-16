// Chakra imports
import { Flex, Grid, useColorModeValue, Box, Text } from "@chakra-ui/react";
import avatar4 from "assets/img/avatars/avatar4.png";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import React, { useState, useEffect } from "react";
import { FaUser, FaCreditCard, FaShoppingCart } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Header from "./components/Header";
import ProfileInformation from "./components/ProfileInformation";
import PaymentInfo from "./components/PaymentInfo";
import TransactionHistory from "./components/TransactionHistory";
import { useCustomers } from "contexts/CustomerContext";
import { useToast } from "@chakra-ui/react";
import { API_BASE_URL } from "services/api";
import EditCustomerModal from "components/Modals/EditCustomerModal";
import { useHistory } from "react-router-dom";
import AppLoader from "components/Loaders/AppLoader";

const parseCurrencyInput = (value) => {
  if (value === undefined || value === null) return null;
  const numericString = `${value}`.replace(/[^0-9.]/g, '');
  if (numericString.trim() === '') return null;
  const parsed = Number.parseFloat(numericString);
  return Number.isNaN(parsed) ? null : parsed;
};

function Profile() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );
  
  const location = useLocation();
  const { customerId } = useParams();
  const { getCustomerById, editCustomer: updateCustomerContext, removeCustomer } = useCustomers();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("GENERAL INFO");
  const [editCustomer, setEditCustomer] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();
  const history = useHistory();

  // Load customer data from context
  useEffect(() => {
    // Skip loading if we're in the process of deleting
    if (isDeleting) return;

    const loadCustomer = async () => {
      if (!customerId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const customerData = await getCustomerById(customerId);
        setCustomer(customerData);
      } catch (error) {
        console.error('Error loading customer:', error);
        toast({
          title: 'Error loading customer',
          description: error.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top-right'
        });
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [customerId, getCustomerById, toast, isDeleting]);

  // Edit customer handler
  const handleEditCustomer = () => {
    // Transform customer data to match EditCustomerModal expectations
    const editCustomerData = {
      id: customer.id,
      picture: normalizeImageUrl(customer.profile_picture_url),
      memberName: customer.name,
      mobileNo: customer.mobile_number,
      email: customer.email,
      address: customer.address,
      registrationDate: customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '',
      membershipStatus: customer.status_display || customer.status,
      memberType: customer.type_display || customer.type,
      trainerRequired: customer.has_trainer ? "Yes" : "No",
      customerPlan: customer.plan_display || customer.plan || '',
      planId: customer.plan_id || null,
      customerWeight: customer.weight ? `${customer.weight} kg` : '',
      customerAge: customer.age ? `${customer.age}` : '',
      monthlyFee: customer.monthly_fee ? `₨${customer.monthly_fee.toLocaleString()}` : '',
      registrationFee: customer.registration_fee ? `₨${customer.registration_fee.toLocaleString()}` : '',
      nextDueDate: customer.next_due_date || '',
      emergencyContact: customer.emergency_contact || '',
      bloodGroup: customer.blood_group || '',
      medicalConditions: customer.medical_conditions || '',
      fitnessGoals: customer.fitness_goals || '',
      trainerName: customer.trainer_name || ''
    };
    setEditCustomer(editCustomerData);
    setIsEditOpen(true);
  };

  // Save edit handler
  const handleSaveEdit = async (formData, selectedFile) => {
    if (!editCustomer) return;
    try {
      const monthlyFeeValue = parseCurrencyInput(formData.monthlyFee);
      const registrationFeeValue = parseCurrencyInput(formData.registrationFee);

      const updatePayload = {
        name: formData.memberName,
        trainer_name: formData.trainerRequired === 'Yes'
          ? (formData.trainerName || '').trim()
          : null,
        email: formData.email,
        mobile_number: formData.mobileNo,
        address: formData.address,
        type: (formData.memberType || '').toLowerCase(),
        status: (formData.membershipStatus || '').toLowerCase(),
        // 'plan' enum deprecated; rely on plan_id per updated API
        plan_id: formData.plan_id ? parseInt(formData.plan_id) : undefined,
        has_trainer: formData.trainerRequired === 'Yes',
        age: formData.customerAge ? parseInt((formData.customerAge + '').replace(/[^0-9]/g, '')) : undefined,
        weight: formData.customerWeight ? parseFloat((formData.customerWeight + '').replace(/[^0-9.]/g, '')) : undefined,
      };

      if (formData.monthlyFee === '') {
        updatePayload.monthly_fee = null;
      } else if (monthlyFeeValue !== null) {
        updatePayload.monthly_fee = monthlyFeeValue;
      }

      if (formData.registrationFee === '') {
        updatePayload.registration_fee = null;
      } else if (registrationFeeValue !== null) {
        updatePayload.registration_fee = registrationFeeValue;
      }
      const updatedCustomer = await updateCustomerContext(editCustomer.id, updatePayload, selectedFile);
      setIsEditOpen(false);
      setEditCustomer(null);
      toast({ title: 'Customer updated', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
      // Update local customer state with the updated data
      setCustomer(updatedCustomer);
    } catch (error) {
      toast({ title: 'Update failed', description: error.message, status: 'error', duration: 4000, isClosable: true, position: 'top-right' });
    }
  };

  // Delete customer handler
  const handleDeleteCustomer = async () => {
    if (!customer) return;
    if (window.confirm(`Are you sure you want to delete ${customer.name}? This action cannot be undone.`)) {
      try {
        setIsDeleting(true); // Prevent useEffect from trying to reload deleted customer
        await removeCustomer(customer.id);
        toast({ title: 'Customer deleted', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
        history.push('/admin/customer-management');
      } catch (error) {
        setIsDeleting(false);
        toast({ title: 'Delete failed', description: error.message, status: 'error', duration: 4000, isClosable: true, position: 'top-right' });
      }
    }
  };

  if (loading) {
    return <AppLoader message="Loading customer profile..." fullHeight />;
  }

  if (!customer) {
    return (
      <Flex direction='column' align='center' justify='center' minH='400px'>
        <Text color={textColor}>Customer not found</Text>
      </Flex>
    );
  }

  // Normalize image URL (same logic as customer management)
  const normalizeImageUrl = (url) => {
    if (url === null || url === undefined) return undefined;
    if (typeof url !== 'string') return undefined;
    const trimmed = url.trim();
    if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return undefined;
    
    if (/^https?:\/\//i.test(trimmed)) {
      // Replace localhost with API host for consistency if needed
      try {
        const apiRoot = API_BASE_URL.replace(/\/$/, '').replace(/\/api\/?$/, '');
        return trimmed.replace('http://localhost', apiRoot).replace('https://localhost', apiRoot);
      } catch (_) {
        return trimmed;
      }
    }
    // Relative path from backend (e.g., /storage/..)
    const apiRoot = API_BASE_URL.replace(/\/$/, '').replace(/\/api\/?$/, '');
    return `${apiRoot}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Transform API customer data to match component expectations
  const transformedCustomer = {
    id: customer.id,
    picture: normalizeImageUrl(customer.profile_picture_url),
    memberName: customer.name,
    memberType: customer.type_display || customer.type,
    mobileNo: customer.mobile_number,
    email: customer.email,
    address: customer.address,
    registrationDate: customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A',
    membershipStatus: customer.status_display || customer.status,
    trainerRequired: customer.has_trainer ? "Yes" : "No",
    customerPlan: customer.plan_display || customer.plan || 'N/A',
    customerWeight: customer.weight ? `${customer.weight} kg` : 'N/A',
    customerAge: customer.age ? `${customer.age}` : 'N/A',
    monthlyFee: customer.monthly_fee ? `₨${(Number(customer.monthly_fee) > 10000 ? Number(customer.monthly_fee) / 100 : Number(customer.monthly_fee)).toLocaleString()}` : 'N/A',
    registrationFee: customer.registration_fee ? `₨${Number(customer.registration_fee).toLocaleString()}` : 'N/A',
    nextDueDate: formatDate(customer.next_due_date) || 'N/A',
    lastPaymentDate: customer.last_payment_date ? formatDate(customer.last_payment_date) : 'N/A',
    emergencyContact: customer.emergency_contact || 'N/A',
    bloodGroup: customer.blood_group || 'N/A',
    medicalConditions: customer.medical_conditions || 'None',
    fitnessGoals: customer.fitness_goals || 'N/A',
    trainerName: customer.trainer_name || 'N/A',
    paymentHistory: customer.payment_history || [],
    healthRecords: customer.health_records || [],
    transactionHistory: customer.transaction_history || [],
    invoices: customer.invoices || [],
    planId: customer.plan_id || null,
    planName: customer.plan_display || customer.plan || 'N/A'
  };



  const tabs = [
    {
      name: "GENERAL INFO",
      icon: <FaUser w='100%' h='100%' />,
    },
    {
      name: "PAYMENT INFO",
      icon: <FaCreditCard w='100%' h='100%' />,
    },
    {
      name: "TRANSACTION HISTORY",
      icon: <FaShoppingCart w='100%' h='100%' />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "GENERAL INFO":
        return (
          <ProfileInformation
            title={"Profile Information"}
            description={`Hi, I'm ${transformedCustomer.memberName}, a ${transformedCustomer.customerPlan} member since ${transformedCustomer.registrationDate}. ${transformedCustomer.trainerRequired === "Yes" ? "I have a personal trainer assigned." : "I prefer self-guided workouts."}`}
            name={transformedCustomer.memberName}
            mobile={transformedCustomer.mobileNo}
            email={transformedCustomer.email}
            location={transformedCustomer.address}
            memberType={transformedCustomer.memberType}
            membershipStatus={transformedCustomer.membershipStatus}
            customerPlan={transformedCustomer.customerPlan}
            trainerRequired={transformedCustomer.trainerRequired}
            emergencyContact={transformedCustomer.emergencyContact}
            bloodGroup={transformedCustomer.bloodGroup}
            medicalConditions={transformedCustomer.medicalConditions}
            fitnessGoals={transformedCustomer.fitnessGoals}
            trainerName={transformedCustomer.trainerName}
            customerWeight={transformedCustomer.customerWeight}
            customerAge={transformedCustomer.customerAge}
          />
        );
      case "PAYMENT INFO":
        return <PaymentInfo customer={transformedCustomer} />;
      case "TRANSACTION HISTORY":
        return <TransactionHistory customer={transformedCustomer} />;
      default:
        return null;
    }
  };

  return (
    <Flex direction='column'>
      <Header
        backgroundHeader={ProfileBgImage}
        backgroundProfile={bgProfile}
        avatarImage={transformedCustomer.picture}
        name={transformedCustomer.memberName}
        email={transformedCustomer.email}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
      />
      {renderTabContent()}
      
      <EditCustomerModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditCustomer(null); }}
        customer={editCustomer}
        onSave={handleSaveEdit}
      />
    </Flex>
  );
}

export default Profile;
