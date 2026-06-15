import OrderCreateCard from './OrderCreateCard'
import {
  Input,
  RadioGroup,
  ReadOnlyField,
  SearchableSelectInput,
  SelectInput,
} from './OrderCreateFields'

function OrderDetailsCard({
  customerOptions,
  selectedCustomerId,
  onCustomerChange,
  paymentStatus,
  onPaymentTypeChange,
  paymentAmount,
  onPaymentAmountChange,
  paymentMode,
  onPaymentModeChange,
  showPaymentAmount,
  showPaymentMode,
  showValidation,
  isCustomerMissing,
  isPaymentTypeMissing,
  isPaymentAmountMissing,
  isPaymentModeMissing,
}) {
  return (
    <OrderCreateCard title="Order Details">
      <div className="grid gap-4 md:grid-cols-2">
        <SearchableSelectInput
          label="Customer"
          value={selectedCustomerId}
          onChange={onCustomerChange}
          options={customerOptions.map((customer) => ({
            value: customer.id,
            label: customer.label,
          }))}
          placeholder="Select customer"
          error={showValidation && isCustomerMissing ? 'Customer is required.' : ''}
        />
        <div className="md:col-span-2">
          <RadioGroup
            label="Payment Type"
            value={paymentStatus}
            onChange={onPaymentTypeChange}
            options={[
              { value: 'Credit', label: 'Credit' },
              { value: 'Partial', label: 'Partial' },
              { value: 'Paid', label: 'Paid' },
            ]}
            error={showValidation && isPaymentTypeMissing ? 'Payment type is required.' : ''}
          />
        </div>
        {showPaymentAmount ? (
          <Input
            label="Payment Amount"
            placeholder="Enter paid amount"
            value={paymentAmount}
            onChange={onPaymentAmountChange}
            error={
              showValidation && isPaymentAmountMissing ? 'Payment amount is required.' : ''
            }
          />
        ) : (
          <ReadOnlyField label="Payment Amount" value="Will be paid later" />
        )}
        {showPaymentMode ? (
          <SelectInput
            label="Payment Mode"
            value={paymentMode}
            onChange={onPaymentModeChange}
            options={[
              { value: 'Cash', label: 'Cash' },
              { value: 'UPI', label: 'UPI' },
              { value: 'Bank Transfer', label: 'Bank Transfer' },
              { value: 'Cheque', label: 'Cheque' },
            ]}
            placeholder="Select payment mode"
            error={showValidation && isPaymentModeMissing ? 'Payment mode is required.' : ''}
          />
        ) : null}
      </div>
    </OrderCreateCard>
  )
}

export default OrderDetailsCard
