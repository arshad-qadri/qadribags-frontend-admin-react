import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CreditCard,
  IndianRupee,
  LockKeyhole,
  Mail,
  MapPin,
  Package,
  Phone,
  ReceiptText,
  Tag,
  UserRound,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Badge from "../components/common/Badge";
import StatCard from "../components/common/StatCard";
import {
  fetchCustomerByCustomerId,
  fetchCustomerOrderValue,
  fetchCustomerOrdersByCustomerId,
  toggleCustomerStatus,
} from "../features/customers";
import { customerStatus } from "../utils/common";
import { formatCurrency } from "../utils/numberFormat";
import { formatDate, formatPaymentStatus } from "../utils/orderFormat";

function CustomerView() {
  const { customerId } = useParams();
  const dispatch = useDispatch();
  const loading = useSelector(
    (state) => state.customers.fetchCustomerByCustomerId.loading,
  );
  const loaded = useSelector(
    (state) => state.customers.fetchCustomerByCustomerId.loaded,
  );
  const error = useSelector(
    (state) => state.customers.fetchCustomerByCustomerId.error,
  );
  const customer = useSelector(
    (state) => state.customers.fetchCustomerByCustomerId.item,
  );
  const orders = useSelector(
    (state) => state.customers.fetchCustomerOrdersByCustomerId.items,
  );
  const orderValue = useSelector(
    (state) => state.customers.fetchCustomerOrderValue.item,
  );
  const orderValueLoading = useSelector(
    (state) => state.customers.fetchCustomerOrderValue.loading,
  );
  const orderValueError = useSelector(
    (state) => state.customers.fetchCustomerOrderValue.error,
  );
  const ordersLoading = useSelector(
    (state) => state.customers.fetchCustomerOrdersByCustomerId.loading,
  );
  const ordersError = useSelector(
    (state) => state.customers.fetchCustomerOrdersByCustomerId.error,
  );
  const statusUpdating = useSelector(
    (state) => state.customers.toggleCustomerStatus.updating,
  );

  useEffect(() => {
    dispatch(fetchCustomerByCustomerId(customerId));
    dispatch(fetchCustomerOrderValue(customerId));
    dispatch(fetchCustomerOrdersByCustomerId(customerId));
  }, [customerId, dispatch]);

  if (loading && !customer) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-sm">
        Loading customer details...
      </div>
    );
  }

  if (loaded && !customer && !error) {
    return <Navigate to="/customers" replace />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm font-medium text-red-700 shadow-sm">
        {error}
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const totalOrderItems = orders.reduce(
    (sum, order) =>
      sum +
      (order.items || []).reduce(
        (itemSum, item) => itemSum + Number(item.quantity || 0),
        0,
      ),
    0,
  );
  const isActive = customer.status === customerStatus.ACTIVE;
  const totalOrderValue = formatCurrency(orderValue?.order_value ?? 0);
  const outstandingPayments = formatCurrency(orderValue?.due_amount ?? 0);

  const customerStats = [
    {
      label: "Customer Type",
      value: customer.customer_type || "-",
      change: "Current customer category",
      icon: Tag,
      tone: "emerald",
    },
    {
      label: "City",
      value: customer.city || "-",
      change: customer.state || "Location not available",
      icon: MapPin,
      tone: "blue",
    },
    {
      label: "GST Number",
      value: customer.gst_number || "-",
      change: "Tax registration detail",
      icon: ReceiptText,
      tone: "violet",
    },
    {
      label: "Orders",
      value: String(orders.length),
      change: `${totalOrderItems} items across customer orders`,
      icon: Package,
      tone: "amber",
    },
  ];

  const handleStatusToggle = () => {
    const nextStatus = isActive
      ? customerStatus.INACTIVE
      : customerStatus.ACTIVE;

    dispatch(toggleCustomerStatus({ customerId, nextStatus }))
      .unwrap()
      .then(() => {
        toast.success(
          `Customer marked ${
            nextStatus === customerStatus.ACTIVE ? "active" : "inactive"
          } successfully`,
        );
      })
      .catch((statusError) => {
        toast.error(statusError || "Unable to update customer status");
      });
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-center">
        <div>
          <Link
            to="/customers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to customers
          </Link>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            {customer.name}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {customer.customer_id} | Customer profile and account details.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {customerStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">Orders</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <OrderSummaryCard
              label="Total Order Value"
              value={totalOrderValue}
              icon={IndianRupee}
              loading={orderValueLoading}
              error={orderValueError}
            />
            <OrderSummaryCard
              label="Outstanding Payments"
              value={outstandingPayments}
              icon={CreditCard}
              loading={orderValueLoading}
              error={orderValueError}
            />
          </div>

          {ordersLoading ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
              Loading customer orders...
            </div>
          ) : ordersError ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700">
              {ordersError}
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm font-semibold text-slate-900">
                No orders available
              </p>
              <p className="mt-2 text-sm text-slate-500">
                This customer does not have any orders yet.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Order ID</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Items</th>
                    <th className="px-4 py-3 font-bold">Amount</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="bg-white">
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {order.order_number}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {(order.items || []).reduce(
                          (sum, item) => sum + Number(item.quantity || 0),
                          0,
                        )}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {formatCurrency(order.grand_total)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <StatusBadge label={order.status} tone="blue" />
                          <StatusBadge
                            label={formatPaymentStatus(order.payment_status)}
                            tone={
                              order.payment_status === "PAID"
                                ? "emerald"
                                : order.payment_status === "PARTIAL"
                                  ? "amber"
                                  : "red"
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mt-6">
          <h3 className="text-lg font-bold text-slate-950">Customer Details</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <DetailItem label="Name" value={customer.name} icon={UserRound} />
            <DetailItem label="Email" value={customer.email} icon={Mail} />
            <DetailItem
              label="Mobile"
              value={customer.mobile_number}
              icon={Phone}
            />
            <DetailItem
              label="Customer Type"
              value={customer.customer_type}
              icon={Tag}
            />
            <DetailItem label="City" value={customer.city} icon={MapPin} />
            <DetailItem label="State" value={customer.state} icon={MapPin} />
            <DetailItem
              label="Pincode"
              value={customer.pincode}
              icon={MapPin}
            />
            <SwitchDetailItem
              label="Account Status"
              value={isActive ? "Active" : "Inactive"}
              checked={isActive}
              loading={statusUpdating}
              onToggle={handleStatusToggle}
            />
            <DetailItem
              label="GST Number"
              value={customer.gst_number}
              icon={Building2}
            />
            <DetailItem
              label="Address"
              value={customer.address}
              wide
              icon={Building2}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <OrderInfoPanel
          title="Billing Contact"
          icon={Phone}
          lines={[customer.mobile_number || "-", customer.email || "-"]}
        />
        <OrderInfoPanel
          title="Shipping Address"
          icon={MapPin}
          lines={[
            customer.address || "-",
            [customer.city, customer.state, customer.pincode]
              .filter(Boolean)
              .join(", ") || "-",
          ]}
        />
        <OrderInfoPanel
          title="Last Order Snapshot"
          icon={CalendarDays}
          lines={
            orders.length > 0
              ? [
                  `Last order: ${orders[0].order_number}`,
                  `Date: ${formatDate(orders[0].created_at)}`,
                ]
              : ["Last order: -", "Date: -"]
          }
        />
      </section>

      <section className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-red-700">
              <LockKeyhole size={16} />
              <p className="text-sm font-semibold">Permanent Delete</p>
            </div>
            <p className="mt-2 text-sm text-red-600">
              This button is UI only for now. We can connect the permanent
              delete API later.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
          >
            Permanently Delete Customer
          </button>
        </div>
      </section>
    </div>
  );
}

function OrderSummaryCard({ label, value, icon: Icon, loading, error }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={15} />
        <p className="text-xs font-bold uppercase">{label}</p>
      </div>
      <p className="mt-2 text-lg font-bold text-slate-950">
        {loading ? "Loading..." : value}
      </p>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function OrderInfoPanel({ title, icon: Icon, lines }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={16} />
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          {title}
        </h3>
      </div>
      <div className="mt-3 space-y-2 text-sm text-slate-600">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ label, tone }) {
  const toneClasses = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <Badge
      label={label}
      className={`${toneClasses[tone] || toneClasses.blue}`}
    />
  );
}

function DetailItem({ label, value, icon: Icon, wide = false }) {
  return (
    <div
      className={`rounded-lg border border-slate-100 bg-slate-50 p-4 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={14} />
        <p className="text-xs font-bold uppercase">{label}</p>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-900">{value || "-"}</p>
    </div>
  );
}

function SwitchDetailItem({ label, value, checked, loading, onToggle }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            checked
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onToggle}
          disabled={loading}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition focus:outline-none focus:ring-4 ${
            checked
              ? "bg-emerald-600 focus:ring-emerald-100"
              : "bg-slate-300 focus:ring-slate-200"
          } ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          aria-pressed={checked}
          aria-label={`${checked ? "Deactivate" : "Activate"} customer`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${
              checked ? "translate-x-8" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default CustomerView;
