import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import ProductModal from "./ProductModal";

const formatRupiah = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export default function ProductCard({ list, viewDetails }) {
  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mt-5 mb-5 poppins">
      {list.map((item, index) => (
        <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")}>
          <CardBody className="overflow-visible p-0 ">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={item.title}
              className="w-full h-[140px] object-contain"
              src={item.image || item.imageUrl}
            />
          </CardBody>
          <CardFooter className="text-small flex justify-between">
            <b>{`${item.title.slice(0, 30)}` + "..."}</b>
            <p className="text-default-500">{formatRupiah(item.price)}/-</p>
            <br />
          </CardFooter>
          <div className="flex justify-center items-center py-2 w-full">
            <ProductModal id={item.id} />
          </div>
        </Card>
      ))}
    </div>
  );
}