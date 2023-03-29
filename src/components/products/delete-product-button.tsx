import Button from "antd/lib/button";
import Form from "antd/lib/form";
import useForm from "antd/lib/form/hooks/useForm";
import Input from "antd/lib/input";
import Modal from "antd/lib/modal";
import {
  CSSProperties,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { LanguageCtx } from "../../services/context/language-ctx";
import type { ProductPrivateInfo } from "../../services/_types";
import Alert from "antd/lib/alert";
import Text from "antd/lib/typography/Text";
import deleteProduct from "../../services/delete-product"; // Update the import statement
import { useRouter } from "next/router";
import PageRoutes from "../../routing/page-routes";
import Notification from "../../services/notifications/notification";

type Data = { confirmation: string };
type Props = {
  product: ProductPrivateInfo;
  setProduct: Dispatch<SetStateAction<ProductPrivateInfo | null>>;
  style?: CSSProperties;
};

const DeleteProductButton: FC<Props> = ({ product, setProduct, style }) => {
  const { en } = useContext(LanguageCtx);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = useForm<Data>();

  const productName = en ? product.title_en : product.title_fr;

  async function submit() {
    const res = await deleteProduct(product.id);
    if (res) {
      setModalOpen(false);
      router.push(PageRoutes.products); // Update the route
    }
  }

  function openModal() {
    setModalOpen(true);
  }

  return (
    <>
      <Button
        danger
        type="primary"
        size="large"
        onClick={openModal}
        style={style}
      >
        {en ? "Delete Product" : "Supprimer le Produit"}
      </Button>
      <Modal
        title={
          (en ? "Delete Product: " : "Supprimer le Produit : ") + productName
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        okButtonProps={{
          htmlType: "submit",
          form: "delete-product-form",
          danger: true,
        }}
        okText={en ? "Delete Product" : "Supprimer le Produit"}
        cancelButtonProps={{ danger: true }}
        cancelText={en ? "Cancel" : "Annuler"}
        destroyOnClose
        bodyStyle={{ paddingBottom: 0 }}
      >
        <Alert
          showIcon
          type="warning"
          message={en ? "Warning!" : "Avertissement !"}
          description={
            en
              ? "This action is irreversible, this product will be permanently deleted. To confirm, input the product's name."
              : "Cette action est irréversible, ce produit sera définitivement supprimé. Pour confirmer, saisissez le nom du produit."
          }
          style={{ marginBottom: 16 }}
        ></Alert>
        <Form
          form={form}
          layout="vertical"
          id="delete-product-form"
          onFinish={submit}
          preserve={false}
        >
          <Form.Item
            name="confirmation"
            label={
              <Text>
                {en ? "Type: " : "Tapez : "}
                <b>
                  <span style={{ color: "red" }}>{productName}</span>
                </b>
                {" to confirm"}
              </Text>
            }
            validateFirst
            rules={[
              { required: true, message: "Required" },
              {
                validator: (_, v) =>
                  v === productName
                    ? Promise.resolve()
                    : Promise.reject(en ? "Incorrect" : "Incorrect"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DeleteProductButton;
