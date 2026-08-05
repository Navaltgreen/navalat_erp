import { Col, Row } from "antd";
import Deals from "./Deals";
const DealsManagement = () => {

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}><Deals /></Col>
    </Row>
  );
};

export default DealsManagement;
