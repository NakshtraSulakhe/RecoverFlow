import { useState } from 'react'
import { CreditCard } from 'lucide-react'
import { DataPageLayout } from '../../components/common/DataPageLayout'
import { AddDialog } from '../../components/common/AddDialog'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '../../components/ui/input'

interface PaymentFormData {
  paymentId: string
  caseNumber: string
  customerName: string
  amount: number
  method: string
  date: string
  status: string
  notes: string
}

const columns = [
  { id: 'paymentId', label: 'Payment ID' },
  { id: 'case', label: 'Case' },
  { id: 'customer', label: 'Customer' },
  { id: 'amount', label: 'Amount' },
  { id: 'method', label: 'Method' },
  { id: 'date', label: 'Date' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions', align: 'right' as const },
]

export default function Payments() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit, reset } = useForm<PaymentFormData>({
    defaultValues: {
      paymentId: '',
      caseNumber: '',
      customerName: '',
      amount: 0,
      method: 'cash',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      notes: '',
    },
  })

  const onSubmit = (data: PaymentFormData) => {
    setIsSubmitting(true)
    setTimeout(() => {
      console.log('Payment recorded:', data)
      setIsSubmitting(false)
      setOpen(false)
      reset()
    }, 1000)
  }

  const handleClose = () => {
    setOpen(false)
    reset()
  }

  return (
    <>
      <DataPageLayout
        title="Payments"
        subtitle="Record, reconcile, and audit customer payments and settlements."
        columns={columns}
        primaryAction={{ label: 'Record Payment', onClick: () => setOpen(true) }}
        emptyState={{
          icon: <CreditCard className="h-10 w-10 text-muted-foreground" />,
          title: 'No payments recorded',
          description: 'Payments linked to cases will appear here for tracking and reporting.',
          actionLabel: 'Record Payment',
          onAction: () => setOpen(true),
        }}
      />
      <AddDialog
        open={open}
        onClose={handleClose}
        title="Record Payment"
        description="Record a new payment received from a customer."
        onSubmit={handleSubmit(onSubmit)}
        submitButtonText="Record Payment"
        isSubmitting={isSubmitting}
      >
        <div className="flex flex-col gap-4 text-left">
          {/* Payment ID */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">Payment ID</label>
            <Controller
              name="paymentId"
              control={control}
              rules={{ required: 'Payment ID is required' }}
              render={({ field, fieldState }) => (
                <div className="flex flex-col">
                  <Input
                    {...field}
                    placeholder="e.g. TXN-10029"
                    className={fieldState.error ? "border-destructive focus:ring-destructive" : ""}
                  />
                  {fieldState.error && (
                    <span className="text-xs text-destructive mt-1 font-semibold">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </div>

          {/* Case Number */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">Case Number</label>
            <Controller
              name="caseNumber"
              control={control}
              rules={{ required: 'Case number is required' }}
              render={({ field, fieldState }) => (
                <div className="flex flex-col">
                  <Input
                    {...field}
                    placeholder="e.g. CASE-567"
                    className={fieldState.error ? "border-destructive focus:ring-destructive" : ""}
                  />
                  {fieldState.error && (
                    <span className="text-xs text-destructive mt-1 font-semibold">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </div>

          {/* Customer Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">Customer Name</label>
            <Controller
              name="customerName"
              control={control}
              rules={{ required: 'Customer name is required' }}
              render={({ field, fieldState }) => (
                <div className="flex flex-col">
                  <Input
                    {...field}
                    placeholder="e.g. John Doe"
                    className={fieldState.error ? "border-destructive focus:ring-destructive" : ""}
                  />
                  {fieldState.error && (
                    <span className="text-xs text-destructive mt-1 font-semibold">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">Amount ($)</label>
            <Controller
              name="amount"
              control={control}
              rules={{ required: 'Amount is required', min: { value: 1, message: 'Amount must be greater than 0' } }}
              render={({ field, fieldState }) => (
                <div className="flex flex-col">
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder="0.00"
                    className={fieldState.error ? "border-destructive focus:ring-destructive" : ""}
                  />
                  {fieldState.error && (
                    <span className="text-xs text-destructive mt-1 font-semibold">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">Payment Method</label>
            <Controller
              name="method"
              control={control}
              render={({ field }) => (
                <select 
                  {...field} 
                  className="flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              )}
            />
          </div>

          {/* Payment Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">Payment Date</label>
            <Controller
              name="date"
              control={control}
              rules={{ required: 'Date is required' }}
              render={({ field, fieldState }) => (
                <div className="flex flex-col">
                  <Input
                    {...field}
                    type="date"
                    className={fieldState.error ? "border-destructive focus:ring-destructive" : ""}
                  />
                  {fieldState.error && (
                    <span className="text-xs text-destructive mt-1 font-semibold">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select 
                  {...field} 
                  className="flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="reversed">Reversed</option>
                </select>
              )}
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">Notes</label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={2}
                  placeholder="Add notes (optional)..."
                  className="flex w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 focus:border-primary/50 resize-none"
                />
              )}
            />
          </div>
        </div>
      </AddDialog>
    </>
  )
}
