import { Col, Row } from "antd";
import ProposalTable from "./ProposalTable";

function Proposal() {
  return (
    <Row>
      <Col span={24}>
        <ProposalTable />
      </Col>
    </Row>
  );
}

export default Proposal;
