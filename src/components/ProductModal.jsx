import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import Cart from "../context/cart";
import { Spinner, Chip } from "@nextui-org/react";
import ImageLoading from "../assets/loading.gif";
import { Image, Space, notification } from "antd";
import User from "../context";
import ToolTip from "./PopOver";
import dummyProducts from "../db/dummyData"; // Impor data dummy

const formatRupiah = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export default function ProductModal({ id }) {
  const { cart, setCart } = useContext(Cart);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const { login } = useContext(User);

  // Modal open function
  const handleOpen = () => {
    onOpen();
  };

  // Fetching product details using dummy data
  const fetchData = useCallback(() => {
    setLoading(true);
    const productData = dummyProducts.find((product) => product.id === id);
    
    if (productData) {
      setProductDetails(productData);
    } else {
      setProductDetails({});
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add selected item to cart
  const addToCartHandler = (data) => {
    const dataWithQty = { ...data, qty: 1 };
    const storedCartData = localStorage.getItem("cart");
    let cartData = storedCartData ? JSON.parse(storedCartData) : [];
    const existingItemIndex = cartData.findIndex((item) => item.id === dataWithQty.id);
    
    if (existingItemIndex !== -1) {
      cartData[existingItemIndex].qty += 1;
    } else {
      cartData.push(dataWithQty);
    }

    localStorage.setItem("cart", JSON.stringify(cartData));
    setCart(cartData);

    notification.success({
      message: "Item Added Successfully",
      description: `${dataWithQty.title.length > 150 ? dataWithQty.title.slice(0, 125) + "..." : dataWithQty.title}!`,
      duration: 1.5,
    });

    onClose();
  };

  return (
    <div className="outfit">
      <div className="flex flex-wrap gap-3 ">
        <Button
          variant="flat"
          color="warning"
          onPress={handleOpen}
          className="capitalize"
        >
          View Details
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {loading ? (
                  <img className="w-50 h-40 object-contain rounded-lg" src={ImageLoading} />
                ) : (
                  <div className="flex justify-center items-center">
                    <Image
                      width={200}
                      src={productDetails.image}
                      preview={{
                        toolbarRender: (
                          _,
                          {
                            actions: {
                              onFlipY,
                              onFlipX,
                              onRotateLeft,
                              onRotateRight,
                              onZoomOut,
                              onZoomIn,
                            },
                          }
                        ) => (
                          <Space size={12} className="toolbar-wrapper">
                            <SwapOutlined rotate={90} onClick={onFlipY} />
                            <SwapOutlined onClick={onFlipX} />
                            <RotateLeftOutlined onClick={onRotateLeft} />
                            <RotateRightOutlined onClick={onRotateRight} />
                            <ZoomOutOutlined onClick={onZoomOut} />
                            <ZoomInOutlined onClick={onZoomIn} />
                          </Space>
                        ),
                      }}
                    />
                  </div>
                )}
                {loading ? (
                  <Spinner color="primary" className="mt-10 " />
                ) : (
                  <div className="capitalize outfit">
                    {productDetails.title.length > 150
                      ? productDetails.title.slice(0, 125) + "...."
                      : productDetails.title}
                  </div>
                )}
              </ModalHeader>
              <ModalBody className="capitalize outfit">
                {productDetails.description}
                <div>
                  {loading ? (
                    ""
                  ) : (
                    <div>
                      <Chip color="warning" variant="dot" className="bg-[#27272a] text-white">
                        {productDetails.category}
                      </Chip>
                      <br />
                      <p className="mt-5">
                        Price : <b>{formatRupiah(productDetails.price)}/-</b>
                      </p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {login.userStatus ? (
                  <Button color="success" onClick={() => addToCartHandler(productDetails)}>
                    Add To Cart
                  </Button>
                ) : (
                  <ToolTip title={"Add To Cart "} val={`Please login to add to cart ↑ `} />
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}