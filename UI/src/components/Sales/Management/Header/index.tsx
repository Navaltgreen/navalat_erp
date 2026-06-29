import { Button, Col, Row } from "antd";
import SalePhasesSelect from "./SalePhasesSelect";
import DateRangePicker from "./DateRangePicker";
import CreateLead from "./CreateLead";
import { useLeadsQuery } from "../../../../query/sales/management/leads/leads_data.query";
import { exportLeadsToExcel } from "../utils/exportLeadsToExcel";

function Header() {
  const { data } = useLeadsQuery();
  const handleDownload = () => {
    exportLeadsToExcel(data?.records ?? []);
  };
  return (
    <Row gutter={[8, 8]}>
      <Col>
        <SalePhasesSelect />
      </Col>
      <Col>
        <DateRangePicker />
      </Col>
      <Col>
        <CreateLead />
      </Col>
      <Col>
        <Button onClick={handleDownload}>Download Report</Button>
      </Col>
    </Row>
  );
}

export default Header;
