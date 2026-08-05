import type { MileStone } from "../../types/sales/deals/milestones.response";
import { useMileStoneHistory } from "../../query/accounts/milestones.get.query";
type Payment = {
  created_at: string;
  amount: number;
  comments: string;
};
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function MilestoneExpandedRow({ record }: { record: MileStone }) {
  console.log("test", record);
  const { data: milestoneData, loading: milestoneLoading } =
    useMileStoneHistory(record.id);
  console.log("oooo", milestoneData, milestoneLoading);
  const payments: Payment[] = milestoneData;
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 20,
        background: "#fff",
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#8c8c8c",
          marginBottom: 12,
        }}
      >
        Payments History
      </div>

      {payments.map((payment, index) => (
        <div key={payment?.comments}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                color: "#595959",
                fontSize: 15,
              }}
            >
              {formatDate(payment.created_at)}
            </div>

            <div
              style={{
                width: 130,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              {formatCurrency(payment?.amount)}
            </div>

            <div
              style={{
                flex: 2,
                color: "#8c8c8c",
                fontSize: 15,
              }}
            >
              {payment?.comments}
            </div>
          </div>

          {index !== payments.length - 1 && (
            <div
              style={{
                height: 1,
                background: "#f0f0f0",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default MilestoneExpandedRow;
