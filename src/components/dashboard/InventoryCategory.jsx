import { useEffect } from "react";
import { inventoryCategory } from "../../features/inventory/inventoryCategory";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../common/Loader";
import Error from "../common/Error";

function InventoryCategory() {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    items: categories,
  } = useSelector((state) => state?.inventory?.inventoryCategory);
  useEffect(() => {
    dispatch(inventoryCategory());
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
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm ">
      <h3 className="text-lg font-bold text-slate-950">
        Inventory by Category
      </h3>
      <p className="mt-1 text-sm text-slate-500">Available stock percentage</p>

      <div className="mt-7 space-y-5 overflow-y-auto h-[300px] pr-2">
        {categories.map((category) => (
          <div key={category.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">
                {category?.category}
              </span>
              <span className="font-bold text-slate-950">
                {category?.percentage}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div
                className={`h-3 rounded-full`}
                style={{ width: `${category?.percentage}%`, backgroundColor:category?.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InventoryCategory;
