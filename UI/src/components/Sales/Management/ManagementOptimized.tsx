import { Col, Row } from "antd";
import Header from "./Header";
import useSalesManagementHeaderStore from "../../../store/sales/management/header.store";
import Leads from "./Leads";
import Proposal from "./Proposal";
import QuotationPhaseOne from "./QuotationPhaseOne";
import QuotationPhaseTwo from "./QuotationPhaseTwo";
import QuotationPhaseThree from "./QuotationPhaseThree";
import Purchase from "./Purchase";

function ManagementOptimized() {
  const salesPhaseActive = useSalesManagementHeaderStore(
    (state) => state.salesPhaseActive,
  );
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Header salesPhaseActive={salesPhaseActive} />
      </Col>
      <Col span={24}>
        {salesPhaseActive === "lead" && <Leads />}
        {salesPhaseActive === "proposal" && <Proposal />}
        {salesPhaseActive === "quotation_phase_one" && <QuotationPhaseOne />}
        {salesPhaseActive === "quotation_phase_two" && <QuotationPhaseTwo />}
        {salesPhaseActive === "quotation_phase_three" && (
          <QuotationPhaseThree />
        )}
        {salesPhaseActive === "deals" && <Purchase />}
      </Col>
    </Row>
  );
}

export default ManagementOptimized;
