import {
  AlertTriangle,
  BadgeIndianRupee,
  Boxes,
  ShoppingCart,
} from 'lucide-react'
import InventoryCategory from '../components/dashboard/InventoryCategory'
import LowStockAlerts from '../components/dashboard/LowStockAlerts'
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable'
import SalesChart from '../components/dashboard/SalesChart'
import StatsGrid from '../components/dashboard/StatsGrid'

const stats = [
  {
    label: 'Total Revenue',
    value: 'Rs 2.84L',
    change: '+18.4%',
    icon: BadgeIndianRupee,
    tone: 'emerald',
  },
  {
    label: 'Orders Today',
    value: '126',
    change: '+12.8%',
    icon: ShoppingCart,
    tone: 'blue',
  },
  {
    label: 'Inventory Items',
    value: '1,842',
    change: '94% stocked',
    icon: Boxes,
    tone: 'violet',
  },
  {
    label: 'Low Stock SKUs',
    value: '8',
    change: 'Needs reorder',
    icon: AlertTriangle,
    tone: 'amber',
  },
]

const salesData = [
  { month: 'Jan', sales: 42 },
  { month: 'Feb', sales: 58 },
  { month: 'Mar', sales: 48 },
  { month: 'Apr', sales: 72 },
  { month: 'May', sales: 66 },
  { month: 'Jun', sales: 84 },
]

const categoryStock = [
  { label: 'School Bags', value: 78, color: 'bg-emerald-600' },
  { label: 'Travel Bags', value: 64, color: 'bg-blue-600' },
  { label: 'Hand Bags', value: 52, color: 'bg-violet-600' },
  { label: 'Laptop Bags', value: 43, color: 'bg-amber-500' },
]


const recentOrders = [
  {
    id: '#QB1024',
    customer: 'Ayesha Khan',
    item: 'School Backpack',
    amount: 'Rs 1,299',
    status: 'Delivered',
  },
  {
    id: '#QB1023',
    customer: 'Rahil Shaikh',
    item: 'Travel Duffel',
    amount: 'Rs 2,499',
    status: 'Packed',
  },
  {
    id: '#QB1022',
    customer: 'Neha Patel',
    item: 'Laptop Bag',
    amount: 'Rs 1,899',
    status: 'Pending',
  },
  {
    id: '#QB1021',
    customer: 'Sameer Ali',
    item: 'Hand Bag',
    amount: 'Rs 1,599',
    status: 'Shipped',
  },
]

function Dashboard() {
  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <SalesChart data={salesData} />
        <InventoryCategory categories={categoryStock} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <LowStockAlerts  />
        <RecentOrdersTable orders={recentOrders} />
      </section>
    </div>
  )
}

export default Dashboard
