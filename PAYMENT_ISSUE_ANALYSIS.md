# Simple Payment API Documentation

## Overview

The payment system has been simplified. You can now record monthly fee payments manually without dealing with billing periods. Just send the customer ID, amount, payment date, and payment method - that's it!

---

## Submit Monthly Fee Payment

**Endpoint:** `POST /api/fee-submissions/submit`

**Description:** Record a monthly fee payment for a customer. Simple and straightforward - no billing periods needed.

### Request Body

```json
{
  "customer_id": 1,
  "amount": 3000.00,
  "payment_date": "2025-01-15",
  "payment_method": "cash",
  "notes": "January 2025 payment"
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `customer_id` | integer | The ID of the customer making the payment |
| `amount` | number | Payment amount (e.g., 3000.00 for $3000) |
| `payment_method` | string | Payment method: `cash`, `card`, `bank_transfer`, or `digital_wallet` |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `payment_date` | date (YYYY-MM-DD) | Payment date. Defaults to today if not provided |
| `notes` | string | Optional notes about the payment |

### Response (Success - 201)

```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "data": {
    "fee_submission": {
      "id": 123,
      "customer_id": 1,
      "invoice_id": 456,
      "fee_type": "monthly_fee",
      "amount": "3000.00",
      "payment_date": "2025-01-15",
      "payment_method": "cash",
      "notes": "January 2025 payment",
      "fee_type_display": "Monthly fee",
      "payment_method_display": "Cash"
    },
    "invoice": {
      "id": 456,
      "customer_id": 1,
      "invoice_number": "INV-2025-001234",
      "total_amount": "3000.00",
      "payment_status": "paid",
      "payment_method": "cash"
    },
    "customer": {
      "id": 1,
      "name": "John Doe",
      "subscription_status": "paid",
      "last_payment_date": "2025-01-15",
      "next_due_date": "2025-02-15"
    }
  }
}
```

### Response (Error - 422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "customer_id": ["The customer id field is required."],
    "amount": ["The amount must be at least 0.01."]
  }
}
```

---

## Frontend Implementation Example

### JavaScript/TypeScript Example

```javascript
/**
 * Submit a monthly fee payment
 */
async function submitMonthlyPayment(customerId, amount, paymentMethod, paymentDate = null, notes = null) {
  try {
    const response = await fetch('/api/fee-submissions/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        customer_id: customerId,
        amount: amount,
        payment_method: paymentMethod, // 'cash', 'card', 'bank_transfer', 'digital_wallet'
        payment_date: paymentDate || new Date().toISOString().split('T')[0], // YYYY-MM-DD
        notes: notes
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('Payment recorded:', data.data.fee_submission);
      console.log('Invoice created:', data.data.invoice);
      console.log('Customer updated:', data.data.customer);
      return data.data;
    } else {
      throw new Error(data.message || 'Payment submission failed');
    }
  } catch (error) {
    console.error('Error submitting payment:', error);
    throw error;
  }
}

// Usage example
submitMonthlyPayment(
  1,                    // customer ID
  3000.00,              // amount
  'cash',               // payment method
  '2025-01-15',         // payment date (optional)
  'January 2025 payment' // notes (optional)
).then(result => {
  // Payment successful - update UI
  alert('Payment recorded successfully!');
  // Refresh customer data
}).catch(error => {
  // Handle error
  alert('Error: ' + error.message);
});
```

### React Example

```jsx
import { useState } from 'react';

function PaymentForm({ customerId, onPaymentSuccess }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fee-submissions/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          customer_id: customerId,
          amount: parseFloat(amount),
          payment_method: paymentMethod,
          payment_date: paymentDate,
          notes: notes || null
        })
      });

      const data = await response.json();

      if (data.success) {
        // Payment successful
        onPaymentSuccess(data.data);
        // Reset form
        setAmount('');
        setNotes('');
        alert('Payment recorded successfully!');
      } else {
        setError(data.message || 'Payment submission failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          required
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="digital_wallet">Digital Wallet</option>
        </select>
      </div>

      <div>
        <label>Payment Date:</label>
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />
      </div>

      <div>
        <label>Notes (optional):</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Record Payment'}
      </button>
    </form>
  );
}
```

---

## Other Related Endpoints

### Get Customer Fee History

**Endpoint:** `GET /api/customers/{customerId}/fee-history`

**Description:** Get all payment history for a customer.

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": { ... },
    "fee_submissions": {
      "data": [
        {
          "id": 123,
          "amount": "3000.00",
          "payment_date": "2025-01-15",
          "payment_method": "cash",
          "fee_type": "monthly_fee",
          "invoice": { ... }
        }
      ]
    }
  }
}
```

### Get Customer Fee Status

**Endpoint:** `GET /api/customers/{customerId}/fee-status`

**Description:** Get customer's payment status and summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription_status": "paid",
    "last_payment_date": "2025-01-15",
    "next_due_date": "2025-02-15",
    "overdue_days": 0
  }
}
```

---

## Key Points

1. **Simple Payment Recording**: Just send customer_id, amount, and payment_method
2. **No Billing Periods**: The system automatically handles customer status updates
3. **Automatic Invoice Creation**: Each payment automatically generates an invoice
4. **Customer Status Update**: Customer's `last_payment_date` and `next_due_date` are automatically updated
5. **Next Due Date**: Automatically set to one month from the payment date

---

## Migration Notes

If you were using the old billing period system:

- ❌ **Remove**: `billing_period_ids` from payment requests
- ✅ **Use**: Simple `amount` field instead
- ✅ **Keep**: Customer fee status and history endpoints work the same way
- ✅ **Result**: Much simpler payment flow!

---

*Last updated: 2025-01-XX*

