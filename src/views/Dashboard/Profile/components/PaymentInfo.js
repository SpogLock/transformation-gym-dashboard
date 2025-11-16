// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
  Badge,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  useToast,
} from "@chakra-ui/react";
import { 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaWallet,
  FaClock
} from "react-icons/fa";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React, { useEffect, useMemo, useState } from "react";
import AppLoader from "components/Loaders/AppLoader";
import { getCustomerFeeStatus, getCustomerFeeHistory, submitFee, printInvoice, downloadInvoice } from "services/feeService";
import { forceMarkOverdueFees, getCustomerMonthlyTracking, getCustomerBillingPeriods } from "services/overdueService";
import { sendPaymentReminder, getCustomer as fetchCustomerDetail, createPriceOverride } from "services/customerService";

const PaymentInfo = ({ customer }) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("white", "gray.800");
  const toast = useToast();

  // Check if payment is overdue
  const isPaymentOverdue = (nextDueDate) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    return dueDate < today;
  };

  // Get days until due or days overdue
  const getPaymentStatus = (nextDueDate) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', days: Math.abs(diffDays), color: 'red' };
    } else if (diffDays === 0) {
      return { status: 'due_today', days: 0, color: 'orange' };
    } else if (diffDays <= 7) {
      return { status: 'due_soon', days: diffDays, color: 'yellow' };
    } else {
      return { status: 'paid', days: diffDays, color: 'green' };
    }
  };

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feeStatus, setFeeStatus] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [monthlyTracking, setMonthlyTracking] = useState([]); // legacy view
  const [billingPeriods, setBillingPeriods] = useState([]);   // canonical periods for payments
  const [selectedPeriodIds, setSelectedPeriodIds] = useState([]);
  const [overrideSubmitting, setOverrideSubmitting] = useState(false);
  const [overrideForm, setOverrideForm] = useState({
    amount: "",
    reason: "",
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [status, history, tracking, periods] = await Promise.all([
          getCustomerFeeStatus(customer.id),
          getCustomerFeeHistory(customer.id),
          getCustomerMonthlyTracking(customer.id),
          getCustomerBillingPeriods(customer.id),
        ]);
        if (!mounted) return;
        setFeeStatus(status);
        setHistoryItems(history.items);
        setMonthlyTracking(Array.isArray(tracking?.monthly_tracking) ? tracking.monthly_tracking : []);
        setBillingPeriods(Array.isArray(periods?.billing_periods) ? periods.billing_periods : []);
      } catch (_) {
        if (!mounted) return;
        setFeeStatus(null);
        setHistoryItems([]);
        setMonthlyTracking([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (customer?.id) load();
    return () => { mounted = false; };
  }, [customer?.id]);

  const paymentStatus = useMemo(() => {
    const nextDue = feeStatus?.next_due_date || customer.nextDueDate;
    return getPaymentStatus(nextDue);
  }, [feeStatus, customer.nextDueDate]);

  const monthlyFeeDisplay = feeStatus?.monthly_fee ?? customer.monthlyFee;
  const registrationFeeDisplay = feeStatus?.registration_fee ?? customer.registrationFee;
  const lastPaymentDateDisplay = feeStatus?.last_payment_date || customer.lastPaymentDate;
  const nextDueDateDisplay = feeStatus?.next_due_date || customer.nextDueDate;

  // Pretty date formatter: 20th August 2025
  const formatPrettyDate = (value) => {
    if (!value) return '';
    const coerce = (v) => {
      if (!v) return null;
      const d = new Date(v);
      if (!isNaN(d.getTime())) return d;
      // try stripping Z precision tail
      const s = String(v).replace('T00:00:00.000000Z', '').replace(' 00:00:00', '');
      const d2 = new Date(s);
      return !isNaN(d2.getTime()) ? d2 : null;
    };
    const date = coerce(value);
    if (!date) return String(value);
    const day = date.getDate();
    const j = day % 10, k = day % 100;
    const suffix = (j === 1 && k !== 11) ? 'st' : (j === 2 && k !== 12) ? 'nd' : (j === 3 && k !== 13) ? 'rd' : 'th';
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
  };

  const handleMarkAsPaid = async () => {
    if (!customer?.id) return;

    // Determine which billing periods to pay (from canonical billing periods):
    // - Prefer user's explicit selection.
    // - Otherwise, default to earliest pending/overdue period.
    const selectable = Array.isArray(billingPeriods)
      ? billingPeriods.filter((rec) =>
          ["pending", "overdue"].includes(String(rec.status || "").toLowerCase())
        )
      : [];

    let billingPeriodIds = selectedPeriodIds;
    if (!billingPeriodIds.length && selectable.length) {
      const earliest = [...selectable].sort(
        (a, b) => new Date(a.due_date) - new Date(b.due_date)
      )[0];
      if (earliest?.id) {
        billingPeriodIds = [earliest.id];
      }
    }

    if (!billingPeriodIds.length) {
      toast({
        title: "No months selected",
        description: "Select at least one billing period to record a payment.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setSubmitting(true);
    try {
      const todayIso = new Date().toISOString().slice(0, 10);
      const idempotencyKey = `fee_${customer.id}_${Date.now()}`;

      const result = await submitFee({
        customer_id: customer.id,
        payment_date: todayIso,
        payment_method: "cash",
        billing_period_ids: billingPeriodIds,
        idempotency_key: idempotencyKey,
        notes: "Monthly fee payment from profile",
      });

      const [status, history, periods] = await Promise.all([
        getCustomerFeeStatus(customer.id),
        getCustomerFeeHistory(customer.id),
        getCustomerBillingPeriods(customer.id),
      ]);
      setFeeStatus(status);
      setHistoryItems(history.items);
      setBillingPeriods(
        Array.isArray(periods?.billing_periods)
          ? periods.billing_periods
          : []
      );
      setSelectedPeriodIds([]);

      const primaryInvoice =
        Array.isArray(result?.invoices) && result.invoices.length
          ? result.invoices[0]
          : result?.invoice;

      toast({
        title: "Payment processed",
        description:
          (result && result.message) ||
          "Monthly fee recorded successfully for the selected period(s).",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top-right",
      });

      if (primaryInvoice?.id) {
        try {
          await printInvoice(primaryInvoice.id);
        } catch (_) {}
      }
    } catch (e) {
      const message =
        e && e.message
          ? e.message
          : "Payment could not be processed. Please try again.";
      toast({
        title: "Payment not processed",
        description: message,
        status: "info",
        duration: 3500,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReminder = async () => {
    if (!customer?.id) return;
    try {
      await sendPaymentReminder(customer.id);
      const status = await getCustomerFeeStatus(customer.id);
      setFeeStatus(status);
    } catch (_) {
      // no-op
    }
  };

  const handlePrintInvoice = async (invoiceId) => {
    if (!invoiceId) return;
    try { await printInvoice(invoiceId); } catch (_) {}
  };

  const getInvoiceId = (payment) => {
    if (!payment || typeof payment !== 'object') return undefined;
    return payment.invoice_id || payment.invoiceId || (payment.invoice && payment.invoice.id) || undefined;
  };

  const getInvoiceNumber = (payment) => {
    if (!payment || typeof payment !== 'object') return undefined;
    return payment.invoice_number || payment.invoiceNumber || (payment.invoice && payment.invoice.invoice_number) || undefined;
  };

  const hasInvoice = (payment) => {
    return !!(getInvoiceId(payment) || getInvoiceNumber(payment) || payment.invoice);
  };

  const embeddedInvoicesProp = Array.isArray(customer?.invoices) ? customer.invoices : [];
  const [embeddedInvoices, setEmbeddedInvoices] = useState(embeddedInvoicesProp);

  const invoiceRows = useMemo(() => {
    const rows = [];
    // Deduplicate by invoice id and invoice number across sources
    const seenIds = new Set();
    const seenNumbers = new Set();

    const pushRow = (row) => {
      const id = row.invoiceId;
      const num = row.invoiceNumber;
      if ((id && seenIds.has(String(id))) || (num && seenNumbers.has(String(num)))) return;
      if (id) seenIds.add(String(id));
      if (num) seenNumbers.add(String(num));
      rows.push(row);
    };

    // From embedded invoices (preferred, includes total_amount)
    for (const inv of embeddedInvoices) {
      if (!inv) continue;
      const id = inv.id;
      const num = inv.invoice_number;
      pushRow({
        key: id ? `inv-${id}` : (num ? `invnum-${num}` : Math.random().toString(36).slice(2)),
        date: (inv.created_at || '').split('T')[0] || '',
        amount: inv.total_amount,
        type: inv.payment_status || 'paid',
        invoiceId: id,
        invoiceNumber: num,
      });
    }

    // From fee submissions (fallback)
    for (const p of historyItems) {
      if (!hasInvoice(p)) continue;
      const id = getInvoiceId(p);
      const num = getInvoiceNumber(p);
      pushRow({
        key: id ? `fee-${id}` : (num ? `fee-num-${num}` : `fee-row-${p.id}`),
        date: p.payment_date,
        amount: p.amount,
        type: p.fee_type_display || p.fee_type,
        invoiceId: id,
        invoiceNumber: num,
      });
    }

    return rows;
  }, [embeddedInvoices, historyItems]);

  const handleRefreshOverdue = async () => {
    try {
      const res = await forceMarkOverdueFees();
      toast({ title: 'Overdue refreshed', description: res.message || 'Statuses updated', status: 'success', duration: 2500, isClosable: true, position: 'top-right' });
      const [status, tracking] = await Promise.all([
        getCustomerFeeStatus(customer.id),
        getCustomerMonthlyTracking(customer.id)
      ]);
      setFeeStatus(status);
      setMonthlyTracking(Array.isArray(tracking?.monthly_tracking) ? tracking.monthly_tracking : []);
    } catch (e) {
      const message = (e && e.message) ? e.message : 'Failed updating overdue';
      toast({ title: 'Overdue update failed', description: message, status: 'error', duration: 3000, isClosable: true, position: 'top-right' });
    }
  };

  // Try to fetch latest customer detail to pick up embedded invoices (backend now embeds recent invoices)
  useEffect(() => {
    let mounted = true;
    const loadInvoicesFromDetail = async () => {
      try {
        const detail = await fetchCustomerDetail(customer.id);
        if (!mounted) return;
        const inv = Array.isArray(detail?.invoices) ? detail.invoices : [];
        if (inv.length) setEmbeddedInvoices(inv);
        // Load monthly tracking
        try {
          const tracking = await getCustomerMonthlyTracking(customer.id);
          if (mounted) setMonthlyTracking(Array.isArray(tracking?.monthly_tracking) ? tracking.monthly_tracking : []);
        } catch (_) {}
      } catch (_) {}
    };
    if (customer?.id) loadInvoicesFromDetail();
    return () => { mounted = false; };
  }, [customer?.id]);

  const selectablePeriods = useMemo(() => {
    if (!Array.isArray(billingPeriods)) return [];
    return billingPeriods.filter((rec) =>
      ["pending", "overdue"].includes(String(rec.status || "").toLowerCase())
    );
  }, [billingPeriods]);

  const handleTogglePeriod = (periodId) => {
    setSelectedPeriodIds((prev) =>
      prev.includes(periodId)
        ? prev.filter((id) => id !== periodId)
        : [...prev, periodId]
    );
  };

  const handleSelectAllPeriods = () => {
    if (!selectablePeriods.length) return;
    const allIds = selectablePeriods.map((p) => p.id);
    const allSelected =
      allIds.length &&
      allIds.every((id) => selectedPeriodIds.includes(id));
    setSelectedPeriodIds(allSelected ? [] : allIds);
  };

  const handleOverrideSubmit = async () => {
    if (!customer?.id) return;
    const numericAmount = Number(overrideForm.amount);
    if (!numericAmount || numericAmount <= 0) {
      toast({
        title: "Enter a valid amount",
        description: "Please enter a positive monthly fee amount.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const overridden_price_cents = Math.round(numericAmount * 100);
    const todayIso = new Date().toISOString().slice(0, 10);

    setOverrideSubmitting(true);
    try {
      await createPriceOverride(customer.id, {
        plan_id: null,
        overridden_price_cents,
        effective_from: todayIso,
        effective_to: null,
        reason: overrideForm.reason || "Custom monthly price",
      });

      toast({
        title: "Price override saved",
        description:
          "Future billing periods will use this custom monthly price.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setOverrideForm({ amount: "", reason: "" });
    } catch (e) {
      const message =
        e && e.message
          ? e.message
          : "Could not save price override. Please try again.";
      toast({
        title: "Price override failed",
        description: message,
        status: "error",
        duration: 3500,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setOverrideSubmitting(false);
    }
  };

  if (loading) {
    return <AppLoader message="Loading payment info..." />;
  }

  return (
    <Box p={{ base: 3, sm: 4, md: 6 }}>
      {/* Payment Overview Cards */}
      <Grid templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={{ base: 2, sm: 3, md: 3 }} mb={6}>
        <Box bg={cardBg} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaWallet} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Monthly Fee
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {monthlyFeeDisplay}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg={cardBg} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaClock} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Status
              </Text>
              <Badge
                colorScheme={paymentStatus.color}
                variant="subtle"
                px={2}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="semibold"
              >
                {paymentStatus.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </VStack>
          </HStack>
        </Box>

        <Box bg={cardBg} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaCalendarAlt} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Last Payment
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {formatPrettyDate(lastPaymentDateDisplay)}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg={cardBg} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaMoneyBillWave} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Registration Fee
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {registrationFeeDisplay}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg={cardBg} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaCalendarAlt} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Next Due
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {formatPrettyDate(nextDueDateDisplay)}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Grid>

      {/* Payment Actions */}
      <Box bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" mb={4}>
        <VStack spacing={3} align="stretch">
          <HStack spacing={3} align="center" mb={1}>
            <Box color="brand.500">
              <Icon as={FaCheckCircle} boxSize={4} />
            </Box>
            <Text fontSize="md" color={textColor} fontWeight="bold">
              Payment Actions
            </Text>
          </HStack>
          
          <VStack spacing={3} align="stretch" display={{ base: "flex", md: "none" }}>
            <Button
              leftIcon={<FaCheckCircle />}
              size="md"
              isDisabled={!isPaymentOverdue(nextDueDateDisplay) || submitting}
              isLoading={submitting}
              bg="linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)"
              backgroundImage="linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)"
              color="white"
              _hover={{ bg: "linear-gradient(90deg, #9F7A1A 0%, #775C08 100%)" }}
              _active={{ bg: "#8A6A0A" }}
              _disabled={{ opacity: 0.8, bg: "linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)", color: "white" }}
              onClick={handleMarkAsPaid}
            >
              Mark as Paid
            </Button>
            <Button
              leftIcon={<FaCreditCard />}
              size="md"
              bg="linear-gradient(90deg, #2FB3A3 0%, #2C7A7B 100%)"
              backgroundImage="linear-gradient(90deg, #2FB3A3 0%, #2C7A7B 100%)"
              color="white"
              _hover={{ bg: "linear-gradient(90deg, #2AA396 0%, #276B6C 100%)" }}
              _active={{ bg: "#2C7A7B" }}
              onClick={handleMarkAsPaid}
            >
              Process Payment
            </Button>
            <Button
              leftIcon={<FaExclamationTriangle />}
              size="md"
              variant="outline"
              borderColor="#DD6B20"
              color="#DD6B20"
              _hover={{ bg: "rgba(221,107,32,0.08)", borderColor: "#DD6B20" }}
              onClick={handleSendReminder}
            >
              Send Reminder
            </Button>
          </VStack>
          
          <HStack spacing={3} w="100%" display={{ base: "none", md: "flex" }}>
            <Button
              leftIcon={<FaCheckCircle />}
              size="md"
              flex={1}
              minW={0}
              isDisabled={!isPaymentOverdue(nextDueDateDisplay) || submitting}
              isLoading={submitting}
              bg="linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)"
              backgroundImage="linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)"
              color="white"
              _hover={{ bg: "linear-gradient(90deg, #9F7A1A 0%, #775C08 100%)" }}
              _active={{ bg: "#8A6A0A" }}
              _focus={{ boxShadow: "0 0 0 2px rgba(184, 138, 30, 0.4)" }}
              _disabled={{
                opacity: 0.7,
                cursor: "not-allowed",
                bg: "linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)",
                backgroundImage: "linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)",
                color: "white"
              }}
              onClick={handleMarkAsPaid}
            >
              Mark as Paid
            </Button>
            <Button
              leftIcon={<FaCreditCard />}
              size="md"
              flex={1}
              minW={0}
              bg="linear-gradient(90deg, #2FB3A3 0%, #2C7A7B 100%)"
              color="white"
              _hover={{ bg: "linear-gradient(90deg, #2AA396 0%, #276B6C 100%)" }}
              onClick={handleMarkAsPaid}
            >
              Process Payment
            </Button>
            <Button
              leftIcon={<FaExclamationTriangle />}
              size="md"
              variant="outline"
              flex={1}
              minW={0}
              borderColor="#DD6B20"
              color="#DD6B20"
              _hover={{ bg: useColorModeValue("rgba(221,107,32,0.08)", "rgba(221,107,32,0.16)"), borderColor: "#DD6B20" }}
              onClick={handleSendReminder}
            >
              Send Reminder
            </Button>
          </HStack>
        </VStack>

        {/* Billing Period Selection */}
        <Box mt={4}>
          <Text fontSize="sm" color={textColor} fontWeight="semibold" mb={2}>
            Select billing months to pay
          </Text>
          {selectablePeriods.length === 0 ? (
            <Box
              p={3}
              bg={useColorModeValue("gray.50", "gray.700")}
              borderRadius="md"
              border="1px solid"
              borderColor={borderColor}
            >
              <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
                There are no pending or overdue billing periods. You&rsquo;re all caught up!
              </Text>
            </Box>
          ) : (
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                  Tap to select one or multiple months (for catch-up or prepayment).
                </Text>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handleSelectAllPeriods}
                >
                  {selectablePeriods.every((p) =>
                    selectedPeriodIds.includes(p.id)
                  )
                    ? "Clear selection"
                    : "Select all"}
                </Button>
              </HStack>

              {selectablePeriods.map((rec) => {
                const isSelected = selectedPeriodIds.includes(rec.id);
                const statusLower = String(rec.status || "").toLowerCase();
                const isOverdue = statusLower === "overdue";
                const badgeColor = isOverdue ? "red" : "yellow";

                return (
                  <Box
                    key={rec.id}
                    p={3}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={isSelected ? "brand.500" : borderColor}
                    bg={
                      isSelected
                        ? useColorModeValue("brand.50", "gray.700")
                        : useColorModeValue("gray.50", "gray.700")
                    }
                    cursor="pointer"
                    onClick={() => handleTogglePeriod(rec.id)}
                  >
                    <HStack justify="space-between" align="flex-start">
                      <VStack align="start" spacing={0}>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color={textColor}
                        >
                          {formatPrettyDate(rec.due_date)}
                        </Text>
                        <Text
                          fontSize="xs"
                          color={useColorModeValue("gray.500", "gray.400")}
                        >
                          Amount: ₨
                          {Number(
                            rec.amount_cents != null
                              ? rec.amount_cents / 100
                              : rec.amount
                          ).toLocaleString()}
                        </Text>
                      </VStack>
                      <VStack align="end" spacing={1}>
                        <Badge
                          colorScheme={badgeColor}
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                          py={1}
                          fontSize="xs"
                        >
                          {isOverdue
                            ? `Overdue${rec.days_overdue ? ` (${rec.days_overdue} days)` : ""}`
                            : "Pending"}
                        </Badge>
                        {isSelected && (
                          <Badge
                            colorScheme="green"
                            variant="solid"
                            borderRadius="full"
                            px={2}
                            py={1}
                            fontSize="xs"
                          >
                            Selected
                          </Badge>
                        )}
                      </VStack>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          )}
        </Box>
      </Box>

      {/* Monthly Tracking */}
      <Box bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" mt={4}>
        <VStack spacing={3} align="stretch">
          <HStack spacing={3} align="center" mb={1}>
            <Box color="brand.500">
              <Icon as={FaCalendarAlt} boxSize={4} />
            </Box>
            <Text fontSize="md" color={textColor} fontWeight="bold">
              Monthly Tracking
            </Text>
          </HStack>

          <VStack spacing={3} align="stretch">
            {monthlyTracking.length === 0 ? (
              <Box p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md" border="1px solid" borderColor={borderColor}>
                <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>No monthly tracking yet.</Text>
              </Box>
            ) : (
              monthlyTracking.map((rec) => (
                <Box key={rec.id} p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md" border="1px solid" borderColor={borderColor}>
                  <Grid templateColumns="1fr 1fr 1fr" gap={4} minH="40px" alignItems="center">
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">Due Date</Text>
                      <Text fontSize="sm" color={textColor} fontWeight="semibold">{formatPrettyDate(rec.due_date)}</Text>
                    </VStack>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">Amount</Text>
                      <Text fontSize="sm" color={textColor} fontWeight="semibold">₨{Number(rec.amount).toLocaleString()}</Text>
                    </VStack>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">Status</Text>
                        <Text fontSize="sm" color={textColor} fontWeight="semibold">{rec.status}</Text>
                    </VStack>
                  </Grid>
                </Box>
              ))
            )}
          </VStack>
        </VStack>
      </Box>

      {/* Payment History */}
      <Box bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <VStack spacing={3} align="stretch">
          <HStack spacing={3} align="center" mb={1}>
            <Box color="brand.500">
              <Icon as={FaCreditCard} boxSize={4} />
            </Box>
            <Text fontSize="md" color={textColor} fontWeight="bold">
              Payment History
            </Text>
          </HStack>
          
          <VStack spacing={3} align="stretch">
            {historyItems.map((payment) => (
              <Box key={payment.id} p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md" border="1px solid" borderColor={borderColor}>
                {/* Desktop Layout */}
                <Grid templateColumns="1fr 1fr 1fr auto" gap={4} minH="40px" alignItems="center" display={{ base: "none", md: "grid" }}>
                  <HStack spacing={3} align="center">
                    <Box color="brand.500" flexShrink={0}>
                      <Icon as={FaCalendarAlt} boxSize={3} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                        Date
                      </Text>
                        <Text fontSize="sm" color={textColor} fontWeight="semibold">
                          {formatPrettyDate(payment.payment_date)}
                        </Text>
                    </VStack>
                  </HStack>
                  
                  <HStack spacing={3} align="center">
                    <Box color="brand.500" flexShrink={0}>
                      <Icon as={FaMoneyBillWave} boxSize={3} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                        Amount
                      </Text>
                      <Text fontSize="sm" color={textColor} fontWeight="semibold">
                        ₨{Number(payment.amount).toLocaleString()}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                      Method
                    </Text>
                    <Text fontSize="sm" color={textColor} fontWeight="semibold" noOfLines={1}>
                      {payment.payment_method_display || payment.payment_method}
                    </Text>
                  </VStack>
                  
                  <Badge
                    colorScheme={"green"}
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="semibold"
                    flexShrink={0}
                  >
                    {payment.fee_type_display || payment.fee_type}
                  </Badge>
                </Grid>

                {/* Mobile Layout - Compact Stack */}
                <VStack spacing={2} align="stretch" display={{ base: "flex", md: "none" }}>
                  {/* Top Row - Date and Amount */}
                  <HStack justify="space-between" align="center">
                    <HStack spacing={2} align="center" flex={1} minW={0}>
                      <Box color="brand.500" flexShrink={0}>
                        <Icon as={FaCalendarAlt} boxSize={3} />
                      </Box>
                      <VStack align="start" spacing={0} minW={0} flex={1}>
                        <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                          Date
                        </Text>
                        <Text fontSize="xs" color={textColor} fontWeight="semibold" noOfLines={1}>
                          {payment.payment_date}
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={2} align="center" flex={1} minW={0} justify="flex-end">
                      <Box color="brand.500" flexShrink={0}>
                        <Icon as={FaMoneyBillWave} boxSize={3} />
                      </Box>
                      <VStack align="end" spacing={0} minW={0} flex={1}>
                        <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                          Amount
                        </Text>
                        <Text fontSize="xs" color={textColor} fontWeight="semibold" noOfLines={1}>
                          ₨{Number(payment.amount).toLocaleString()}
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>

                  {/* Bottom Row - Method and Status */}
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={0} flex={1} minW={0}>
                      <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                        Method
                      </Text>
                      <Text fontSize="xs" color={textColor} fontWeight="semibold" noOfLines={1}>
                        {payment.payment_method_display || payment.payment_method}
                      </Text>
                    </VStack>
                    
                    <Badge
                      colorScheme={"green"}
                      variant="subtle"
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="semibold"
                      flexShrink={0}
                      ml={2}
                    >
                      {payment.fee_type_display || payment.fee_type}
                    </Badge>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* Purchase History (Invoices) */}
      <Box bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" mt={4}>
        <VStack spacing={3} align="stretch">
          <HStack spacing={3} align="center" mb={1}>
            <Box color="brand.500">
              <Icon as={FaCreditCard} boxSize={4} />
            </Box>
            <Text fontSize="md" color={textColor} fontWeight="bold">
              Invoices
            </Text>
            <Button size="xs" variant="outline" ml="auto" onClick={() => handleRefreshOverdue?.()}>Refresh Overdue</Button>
          </HStack>

          {/* Price Override (Custom Monthly Price) */}
          <Box mt={4} p={3} borderRadius="md" border="1px dashed" borderColor={borderColor}>
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" color={textColor} fontWeight="semibold">
                Custom monthly price / discount
              </Text>
              <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                Use this when you want to lock in a special price for this customer.
                The backend will apply it automatically to future billing periods.
              </Text>
              <Grid
                templateColumns={{ base: "1fr", md: "200px 1fr auto" }}
                gap={3}
                alignItems="center"
              >
                <Box>
                  <Text fontSize="xs" mb={1} color={useColorModeValue("gray.600", "gray.300")}>
                    Monthly amount (PKR)
                  </Text>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      border: `1px solid ${borderColor}`,
                      background: "transparent",
                      color: "inherit",
                    }}
                    value={overrideForm.amount}
                    onChange={(e) =>
                      setOverrideForm((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" mb={1} color={useColorModeValue("gray.600", "gray.300")}>
                    Reason (optional)
                  </Text>
                  <input
                    type="text"
                    placeholder="e.g. Loyalty discount"
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      border: `1px solid ${borderColor}`,
                      background: "transparent",
                      color: "inherit",
                    }}
                    value={overrideForm.reason}
                    onChange={(e) =>
                      setOverrideForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                  />
                </Box>

                <Box textAlign={{ base: "right", md: "left" }} mt={{ base: 2, md: 0 }}>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    isLoading={overrideSubmitting}
                    onClick={handleOverrideSubmit}
                  >
                    Save override
                  </Button>
                </Box>
              </Grid>
            </VStack>
          </Box>

          <VStack spacing={3} align="stretch">
            {invoiceRows.length === 0 ? (
              <Box p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md" border="1px solid" borderColor={borderColor}>
                <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>No invoices yet.</Text>
              </Box>
            ) : (
              invoiceRows.map((row) => (
                <Box key={row.key} p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md" border="1px solid" borderColor={borderColor}>
                  {/* Desktop Layout */}
                  <Grid templateColumns="1fr 1fr 1fr auto" gap={4} minH="40px" alignItems="center" display={{ base: "none", md: "grid" }}>
                    <HStack spacing={3} align="center">
                      <Box color="brand.500" flexShrink={0}>
                        <Icon as={FaCalendarAlt} boxSize={3} />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">Date</Text>
                        <Text fontSize="sm" color={textColor} fontWeight="semibold">{formatPrettyDate(row.date)}</Text>
                      </VStack>
                    </HStack>

                    <HStack spacing={3} align="center">
                      <Box color="brand.500" flexShrink={0}>
                        <Icon as={FaMoneyBillWave} boxSize={3} />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">Amount</Text>
                        <Text fontSize="sm" color={textColor} fontWeight="semibold">₨{Number(row.amount).toLocaleString()}</Text>
                      </VStack>
                    </HStack>

                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">Status</Text>
                      <Text fontSize="sm" color={textColor} fontWeight="semibold">{row.type}</Text>
                    </VStack>

                    <HStack justify="flex-end">
                      {row.invoiceId ? (
                        <HStack>
                          <Button size="sm" variant="outline" onClick={() => handlePrintInvoice(row.invoiceId)}>
                            Print
                          </Button>
                          <Button size="sm" variant="solid" onClick={() => downloadInvoice(row.invoiceId, row.invoiceNumber || `invoice-${row.invoiceId}`)}>
                            Download
                          </Button>
                        </HStack>
                      ) : (
                        <Badge colorScheme="gray" variant="subtle">
                          {row.invoiceNumber ? `#${row.invoiceNumber}` : 'Pending'}
                        </Badge>
                      )}
                    </HStack>
                  </Grid>

                  {/* Mobile Layout */}
                  <VStack spacing={2} align="stretch" display={{ base: "flex", md: "none" }}>
                    <HStack justify="space-between" align="center">
                      <HStack spacing={2} align="center" flex={1} minW={0}>
                        <Box color="brand.500" flexShrink={0}>
                          <Icon as={FaCalendarAlt} boxSize={3} />
                        </Box>
                        <VStack align="start" spacing={0} minW={0} flex={1}>
                          <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">Date</Text>
                          <Text fontSize="xs" color={textColor} fontWeight="semibold" noOfLines={1}>{formatPrettyDate(row.date)}</Text>
                        </VStack>
                      </HStack>
                      {row.invoiceId ? (
                        <HStack>
                          <Button size="xs" variant="outline" onClick={() => handlePrintInvoice(row.invoiceId)}>
                            Print
                          </Button>
                          <Button size="xs" variant="solid" onClick={() => downloadInvoice(row.invoiceId, row.invoiceNumber || `invoice-${row.invoiceId}`)}>
                            Download
                          </Button>
                        </HStack>
                      ) : (
                        <Badge colorScheme="gray" variant="subtle">
                          {row.invoiceNumber ? `#${row.invoiceNumber}` : 'Pending'}
                        </Badge>
                      )}
                    </HStack>
                    <HStack justify="space-between" align="center">
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">Amount</Text>
                        <Text fontSize="xs" color={textColor} fontWeight="semibold">₨{Number(row.amount).toLocaleString()}</Text>
                      </VStack>
                      <VStack align="end" spacing={0}>
                        <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">Status</Text>
                        <Text fontSize="xs" color={textColor} fontWeight="semibold">{row.type}</Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </Box>
              ))
            )}
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default PaymentInfo;
