import { Button, Col, Row } from "antd";
import SalePhasesSelect from "./SalePhasesSelect";
// import DateRangePicker from "./DateRangePicker";
import CreateLead from "./CreateLead";
import { useLeadsQuery } from "../../../../query/sales/management/leads/leads_data.query";
import { useLeadsQuery as useProposalQuery } from "../../../../query/sales/management/proposal/get.query";
import { exportLeadsToExcel } from "../utils/exportLeadsToExcel";
import { useLeadsQuery as usePurchaseQuery } from "../../../..//query/sales/management/purchase/get.query";
import { exportProposalsToExcel } from "../utils/exportProposalsToExcel";
import { exportDealsToExcel } from "../utils/exportDealsToExcel";

type HeaderProps = {
  salesPhaseActive: string;
};
function Header({ salesPhaseActive }: HeaderProps) {
  const { data } = useLeadsQuery();
  const { data: proposalData } = useProposalQuery();
  const { data: purchaseData } = usePurchaseQuery();
  console.log("ppprrooppsaldata", proposalData);
  console.log("purchasedata", purchaseData);
  const handleDownload = () => {
    if (salesPhaseActive === "lead") {
      exportLeadsToExcel(data?.records ?? []);
    } else if (salesPhaseActive === "proposal") {
      exportProposalsToExcel(proposalData?.records ?? []);
    } else if (salesPhaseActive === "deals") {
      exportDealsToExcel(purchaseData?.records ?? []);
    }
  };

  return (
    <Row gutter={[8, 8]}>
      <Col>
        <SalePhasesSelect />
      </Col>
      <Col>{/* <DateRangePicker /> */}</Col>
      {salesPhaseActive === "lead" && (
        <Col>
          <CreateLead />
        </Col>
      )}

      <Col>
        <Button onClick={handleDownload}>Download Report</Button>
      </Col>
    </Row>
  );
}

export default Header;
