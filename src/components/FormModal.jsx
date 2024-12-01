import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import {
  addDoc,
  db,
  serverTimestamp,
  collection,
  updateDoc,
} from "../db/index.js";
import { useNavigate } from "react-router-dom";
import CheckOutForm from "./CheckOutForm";
import Cart from "../context/cart.js";
import User from "../context/index.js";
import { toast } from "sonner";

const formatRupiah = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const FormModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [backdrop, setBackdrop] = useState();
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCart } = useContext(Cart);
  const { login } = useContext(User);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedData) {
      setCartData(storedData);
    }
  }, []);

  let deliveryCharges = 100;

  const handleOpen = (backdrop) => {
    setBackdrop(backdrop);
    onOpen();
  };

  // Calculate total order price of order
  const calculateTotalPrice = () => {
    return cartData.reduce((total, item) => {
      const itemQuantity = parseInt(item.qty);
      const itemPrice = parseFloat(item.price);

      if (!isNaN(itemQuantity) && !isNaN(itemPrice)) {
        return total + itemQuantity * itemPrice;
      } else {
        console.log(
          "Invalid item:",
          item,
          "Quantity:",
          item.quantity,
          "Price:",
          item.price
        );
        return total;
      }
    }, 0) + deliveryCharges; // Add delivery charges to total
  };

  // Confirm order function
  const confirmOrder = async ({ name, email, address }) => {
    const orderDetails = {
      name,
      email,
      address,
      totalItems: cartData.length,
      totalAmount: calculateTotalPrice(),
      items: cartData,
      userUid: login?.user?.uid,
      status: "pending",
      timestamp: serverTimestamp(),
    };
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, "orders"), orderDetails);
      await updateDoc(docRef, {
        orderId: docRef.id,
      });
      toast.success("Your Order has been placed successfully!");
      setLoading(false);
      setCartData([]);
      localStorage.clear();
      setCart(0);
      navigate("/orderstatus");
    } catch (error) {
      console.log("error", error);
      toast.error("An error occurred while placing order.");
      setLoading(false);
    }
  };

  return (
    <>
      {cartData && cartData.length > 0 ? (
        <Button
          key={"blur"}
          variant="flat"
          backdrop={backdrop}
          color="primary"
          onPress={() => handleOpen("blur")}
        >
          Order Now
        </Button>
      ) : (
        ""
      )}
      {/* Form modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        className="poppins"
      >
        <ModalContent style={{ overflow: "hidden" }}>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Order Details
              </ModalHeader>
              <ModalBody>
                <div className="check-out-form-container">
                  <CheckOutForm confirmOrder={confirmOrder} loading={loading} />
                </div>
                <div className="flex px-1 justify-between poppins">
                  <div>Total Items:</div>
                  <div className="text-lg font-bold"> {cartData.length}</div>
                </div>
                <div className="flex px-1 justify-between poppins">
                  <div>Delivery Charges:</div>
                  <div className="text-lg font-bold"> {formatRupiah(deliveryCharges)}/-</div>
                </div>
                <div className="flex justify-between poppins">
                  <div>Total Price:</div>
                  <div className="text-lg font-bold">
                    {formatRupiah(calculateTotalPrice())}/-
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default FormModal;