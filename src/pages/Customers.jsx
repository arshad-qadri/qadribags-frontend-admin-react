import { Filter, MapPin, Search, UserPlus, Users, Wallet } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Button from '../components/common/Button'
import ConfirmationPopup from '../components/common/ConfirmationPopup'
import InputBox from '../components/common/InputBox'
import StatCard from '../components/common/StatCard'
import CustomersTable from '../components/customers/CustomersTable'
import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  selectCustomerCreating,
  selectCustomerDeleting,
  selectCustomerUpdating,
  selectCustomers,
  selectCustomersError,
  selectCustomersLoaded,
  selectCustomersLoading,
  updateCustomer,
} from '../features/customers/customersSlice'

const emptyForm = {
  name: '',
  email: '',
  mobile_number: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  gst_number: '',
  customer_type: 'WHOLESALE',
}

function Customers() {
  const dispatch = useDispatch()
  const customers = useSelector(selectCustomers)
  const loading = useSelector(selectCustomersLoading)
  const loaded = useSelector(selectCustomersLoaded)
  const error = useSelector(selectCustomersError)
  const creating = useSelector(selectCustomerCreating)
  const updating = useSelector(selectCustomerUpdating)
  const deleting = useSelector(selectCustomerDeleting)

  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [customerToDelete, setCustomerToDelete] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchCustomers())
    }
  }, [dispatch, loaded])

  const filteredCustomers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return customers.filter((customer) => {
      if (!query) {
        return true
      }

      return [
        customer.name,
        customer.email,
        customer.mobile_number,
        customer.city,
        customer.state,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    })
  }, [customers, searchTerm])

  const citiesCovered = new Set(customers.map((customer) => customer.city).filter(Boolean)).size
  const wholesaleCustomers = customers.filter(
    (customer) => customer.customer_type === 'WHOLESALE',
  ).length
  const retailCustomers = customers.filter(
    (customer) => customer.customer_type === 'RETAIL',
  ).length

  const customerStats = [
    {
      label: 'Total Customers',
      value: String(customers.length),
      change: `${filteredCustomers.length} customers visible`,
      icon: Users,
      tone: 'emerald',
    },
    {
      label: 'Wholesale',
      value: String(wholesaleCustomers),
      change: `${retailCustomers} retail customers`,
      icon: UserPlus,
      tone: 'blue',
    },
    {
      label: 'Customer Type',
      value: wholesaleCustomers > 0 ? 'WHOLESALE' : retailCustomers > 0 ? 'RETAIL' : '-',
      change: 'Based on available customer records',
      icon: Wallet,
      tone: 'violet',
    },
    {
      label: 'Cities Covered',
      value: String(citiesCovered),
      change: 'Active shipping locations',
      icon: MapPin,
      tone: 'amber',
    },
  ]

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingCustomer(null)
    setIsFormOpen(false)
  }

  const openCreateForm = () => {
    setEditingCustomer(null)
    setFormData(emptyForm)
    setIsFormOpen(true)
  }

  const openEditForm = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      mobile_number: customer.mobile_number,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      gst_number: customer.gst_number,
      customer_type: customer.customer_type,
    })
    setIsFormOpen(true)
  }

  const handleChange = ({ target }) => {
    const { name, value } = target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const action = editingCustomer
      ? updateCustomer({ id: editingCustomer.id, customerData: formData })
      : createCustomer(formData)

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(
          editingCustomer
            ? `${formData.name} updated successfully`
            : `${formData.name} created successfully`,
        )
        resetForm()
      })
      .catch((submitError) => {
        toast.error(submitError || 'Unable to save customer')
      })
  }

  const handleDelete = () => {
    if (!customerToDelete) {
      return
    }

    dispatch(deleteCustomer(customerToDelete.id))
      .unwrap()
      .then(() => {
        toast.success(`${customerToDelete.name} deleted successfully`)
        setCustomerToDelete(null)
      })
      .catch((deleteError) => {
        toast.error(deleteError || 'Unable to delete customer')
      })
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Customers</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Customer Management</h2>
          <p className="mt-2 text-sm text-slate-500">
            Track buyers, contact details, activity, and lifetime value.
          </p>
        </div>
        <Button onClick={openCreateForm} className="sm:w-auto sm:px-6">
          <UserPlus size={18} />
          <span className="ml-2">Add Customer</span>
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {customerStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Search name, email, mobile, location"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            <Filter size={17} />
            Filter
          </button>
        </div>
      </section>

      {loading ? (
        <section className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-sm">
          Loading customers...
        </section>
      ) : error ? (
        <section className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm font-medium text-red-700 shadow-sm">
          {error}
        </section>
      ) : (
        <CustomersTable
          customers={filteredCustomers}
          onEdit={openEditForm}
          onDelete={setCustomerToDelete}
        />
      )}

      <CustomerFormModal
        open={isFormOpen}
        formData={formData}
        editingCustomer={editingCustomer}
        loading={creating || updating}
        onChange={handleChange}
        onClose={resetForm}
        onSubmit={handleSubmit}
      />

      <ConfirmationPopup
        open={Boolean(customerToDelete)}
        title="Delete Customer"
        message={
          customerToDelete
            ? `Delete ${customerToDelete.name}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Customer"
        loading={deleting}
        onCancel={() => setCustomerToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

function CustomerFormModal({
  open,
  formData,
  editingCustomer,
  loading,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Customers</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">
              {editingCustomer ? 'Edit Customer' : 'Add Customer'}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Save customer contact details and basic account status.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <InputBox
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Ayesha Khan"
            />
            <InputBox
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="ayesha@example.com"
            />
            <InputBox
              label="Phone"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={onChange}
              placeholder="+91 98765 43210"
            />
            <div className="space-y-2">
              <label
                htmlFor="customer_type"
                className="block text-sm font-medium text-slate-700"
              >
                Customer Type
              </label>
              <select
                id="customer_type"
                name="customer_type"
                value={formData.customer_type}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="WHOLESALE">WHOLESALE</option>
                <option value="RETAIL">RETAIL</option>
              </select>
            </div>
            <InputBox
              label="Address"
              name="address"
              value={formData.address}
              onChange={onChange}
              placeholder="MG Road"
            />
            <InputBox
              label="City"
              name="city"
              value={formData.city}
              onChange={onChange}
              placeholder="Mumbai"
            />
            <InputBox
              label="State"
              name="state"
              value={formData.state}
              onChange={onChange}
              placeholder="Maharashtra"
            />
            <InputBox
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={onChange}
              placeholder="411001"
            />
            <InputBox
              label="GST Number"
              name="gst_number"
              value={formData.gst_number}
              onChange={onChange}
              placeholder="27ABCDE1234F1Z5"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Cancel
            </button>
            <Button
              type="submit"
              loading={loading}
              loadingText={editingCustomer ? 'Saving...' : 'Creating...'}
              className="sm:w-auto sm:px-6"
            >
              {editingCustomer ? 'Save Changes' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Customers
