import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLowStockAlerts } from "../../features/inventory/lowStockAlertsSlice";
import Error from "../common/Error";
import Loader from "../common/Loader";

function LowStockAlerts() {
  const dispatch = useDispatch();
  const { loading, error, items } = useSelector(
    (state) => state?.inventory?.lowStockAlerts,
  );

  useEffect(() => {
    dispatch(fetchLowStockAlerts());
  }, []);
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  if (error) {
    return <Error error={error} />;
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Low Stock Alerts</h3>
          <p className="mt-1 text-sm text-slate-500">
            Products below reorder level
          </p>
        </div>
        <AlertTriangle className="text-amber-500" size={22} />
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.sku}
            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {item.sku}
                </p>
              </div>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                {item.stock} left
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white">
              <div
                className="h-2 rounded-full bg-red-500"
                style={{ width: `${(item.stock / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LowStockAlerts;
