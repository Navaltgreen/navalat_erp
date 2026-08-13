import { Col, Row } from "antd";
import DealsPhasesSelect from "./DealsPhasesSelect";

type HeaderProps = {
  dealsPhaseActive: string;
};
function Header({ dealsPhaseActive }: HeaderProps) {
  console.log("dealsPhaseActive", dealsPhaseActive);
  return (
    <Row gutter={[8, 8]}>
      <Col>
        <DealsPhasesSelect />
      </Col>
    </Row>
  );
}

export default Header;
