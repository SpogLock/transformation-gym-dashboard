// Chakra imports
import { Flex, Grid, useColorModeValue } from "@chakra-ui/react";
import avatar4 from "assets/img/avatars/avatar4.png";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import React, { useState, useEffect } from "react";
import { FaUser, FaCreditCard, FaShoppingCart } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import ProfileInformation from "./components/ProfileInformation";
import PaymentInfo from "./components/PaymentInfo";
import TransactionHistory from "./components/TransactionHistory";

function Profile() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );
  
  const location = useLocation();
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("GENERAL INFO");

  // Sample customer data - in real app, this would come from API
  const sampleCustomers = [
    {
      id: 1,
      picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      memberName: "Asim Khan",
      memberType: "New",
      mobileNo: "+92 321 2345678",
      email: "asim@gmail.com",
      address: "House no. 123, Street no. 123, Lahore",
      registrationDate: "2024-01-15",
      membershipStatus: "Active",
      trainerRequired: "Yes",
      customerPlan: "Premium",
      customerWeight: "75 kg",
      customerAge: "28",
      monthlyFee: "₨4,500",
      feePaidDate: "2024-01-15",
      nextDueDate: "2024-02-15",
      emergencyContact: "+92 300 1234567",
      bloodGroup: "O+",
      medicalConditions: "None",
      fitnessGoals: "Weight Loss",
      trainerName: "Ahmed Ali",
      paymentHistory: [
        { date: "2024-01-15", amount: "₨4,500", status: "Paid", method: "Cash" },
        { date: "2023-12-15", amount: "₨4,500", status: "Paid", method: "Bank Transfer" },
        { date: "2023-11-15", amount: "₨4,500", status: "Paid", method: "Cash" }
      ],
      healthRecords: [
        { date: "2024-01-15", weight: "75 kg", bmi: "24.2", notes: "Initial assessment" },
        { date: "2024-01-22", weight: "74.5 kg", bmi: "24.0", notes: "Good progress" },
        { date: "2024-01-29", weight: "74 kg", bmi: "23.8", notes: "Excellent progress" }
      ],
      transactionHistory: [
        {
          id: "TXN-001",
          date: "2024-02-15",
          type: "Purchase",
          status: "Completed",
          totalAmount: "₨2,500",
          paymentMethod: "Cash",
          items: [
            { name: "Whey Protein (2kg)", quantity: 1, price: "₨1,800" },
            { name: "Creatine Monohydrate", quantity: 1, price: "₨700" }
          ]
        },
        {
          id: "TXN-002", 
          date: "2024-01-28",
          type: "Purchase",
          status: "Completed",
          totalAmount: "₨1,200",
          paymentMethod: "Card",
          items: [
            { name: "BCAA Powder", quantity: 2, price: "₨1,200" }
          ]
        },
        {
          id: "TXN-003",
          date: "2024-01-15",
          type: "Purchase", 
          status: "Completed",
          totalAmount: "₨3,000",
          paymentMethod: "Bank Transfer",
          items: [
            { name: "Mass Gainer (5kg)", quantity: 1, price: "₨2,200" },
            { name: "Multivitamin", quantity: 1, price: "₨800" }
          ]
        },
        {
          id: "TXN-004",
          date: "2023-12-20",
          type: "Purchase",
          status: "Completed", 
          totalAmount: "₨950",
          paymentMethod: "Cash",
          items: [
            { name: "Pre-Workout", quantity: 1, price: "₨950" }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    // Get customer ID from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const customerId = urlParams.get('customerId');
    
    if (customerId) {
      const foundCustomer = sampleCustomers.find(c => c.id === parseInt(customerId));
      setCustomer(foundCustomer || sampleCustomers[0]);
    } else {
      setCustomer(sampleCustomers[0]);
    }
  }, [location]);

  if (!customer) {
    return <div>Loading...</div>;
  }

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
            description={`Hi, I'm ${customer.memberName}, a ${customer.customerPlan} member since ${customer.registrationDate}. ${customer.trainerRequired === "Yes" ? "I have a personal trainer assigned." : "I prefer self-guided workouts."}`}
            name={customer.memberName}
            mobile={customer.mobileNo}
            email={customer.email}
            location={customer.address}
            memberType={customer.memberType}
            membershipStatus={customer.membershipStatus}
            customerPlan={customer.customerPlan}
            trainerRequired={customer.trainerRequired}
            emergencyContact={customer.emergencyContact}
            bloodGroup={customer.bloodGroup}
            medicalConditions={customer.medicalConditions}
            fitnessGoals={customer.fitnessGoals}
            trainerName={customer.trainerName}
            customerWeight={customer.customerWeight}
            customerAge={customer.customerAge}
          />
        );
      case "PAYMENT INFO":
        return <PaymentInfo customer={customer} />;
      case "TRANSACTION HISTORY":
        return <TransactionHistory customer={customer} />;
      default:
        return null;
    }
  };

  return (
    <Flex direction='column'>
      <Header
        backgroundHeader={ProfileBgImage}
        backgroundProfile={bgProfile}
        avatarImage={customer.picture}
        name={customer.memberName}
        email={customer.email}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {renderTabContent()}
    </Flex>
  );
}

export default Profile;
