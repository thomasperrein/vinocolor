import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useProduct } from "medusa-react";
import { getFormattedPrice } from "../utils/getFormattedPrice";
import { useTranslation } from "react-i18next";

export default function Product() {
  const { id } = useParams();
  const { product, isLoading } = useProduct(id!);
  const { t } = useTranslation();

  return (
    <div>
      {isLoading && <span>{t("product.loading")}</span>}
      {product && (
        <Container>
          <Row>
            <Col>
              <img
                width="500px"
                alt={product.title}
                src={product.thumbnail ? product.thumbnail : ""}
              />
            </Col>
            <Col className="d-flex justify-content-center flex-column">
              <h1>{product.title}</h1>
              <p className="mb-4 text-success fw-bold">
                {getFormattedPrice(product.variants?.[0]?.prices?.[0]?.amount)}
              </p>
              <p className="mb-5">{product.description}</p>
              <Button
                variant="success"
                size="lg"
                onClick={() => console.log("ajout")}
              >
                {t("product.add_to_cart")}
              </Button>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}
