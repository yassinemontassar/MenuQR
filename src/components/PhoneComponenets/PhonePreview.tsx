"use client"
import useStore from "@/app/hooks/use-items";
import { useEffect } from "react";

export default function PhonePreview() {
  const items = useStore((state) => state.items);
  return (
    <div className='h-full overflow-y-scroll p-4'>
        <header className='text-center mb-8'>
          <img src='https://tse1.mm.bing.net/th/id/OIP.z4Sh2va6sH3m446LrDZmZwHaH_?rs=1&pid=ImgDetMain' width="20%" alt='Restaurant Logo' className='mx-auto mb-4 h-16' />
          <h1 className='text-2xl font-bold'>Welcome to Our Restaurant
          {items.map((item, index) => (
        <div key={index}>
          <h1>{item.title}</h1>
        </div>
          ))}
          </h1>
          <p className='text-gray-500'>Explore our delicious menu</p>
        </header>
        <div className="menu-section">
          <h2 className="text-xl font-bold mb-2">Appetizers</h2>
          <div className="menu-item">
            <span>Appetizer 1</span>
            <span>$5.99</span>
          </div>
          <div className="menu-item">
            <span>Appetizer 2</span>
            <span>$7.99</span>
          </div>
        </div>

        <div className="menu-section">
          <h2 className="text-xl font-bold mb-2">Main Courses</h2>
          <div className="menu-item">
            <span>Main Course 1</span>
            <span>$12.99</span>
          </div>
          <div className="menu-item">
            <span>Main Course 2</span>
            <span>$14.99</span>
          </div>
        </div>

      </div>
  );
}
