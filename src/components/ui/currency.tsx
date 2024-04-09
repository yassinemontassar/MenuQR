"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat('en-TN', {
  style: 'currency',
  currency: 'TND',
});

interface CurrencyProps {
  value?: string | number;
}

const Currency: React.FC<CurrencyProps> = ({
  value = 0
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const formattedValue = formatter.format(Number(value));
  const currencySymbol = formattedValue.replace(/[0-9.,]/g, '').trim();
  let numericValue = formattedValue.replace(/[^0-9.,]/g, '').trim();

  // Check if the numeric value is an integer
  const isInteger = Number.isInteger(Number(numericValue));

  // Remove trailing zeros if it's an integer
  if (isInteger) {
    numericValue = String(Number(numericValue));
  }
  numericValue = numericValue.replace('.', ',');
  return ( 
    <div className="font-semibold">
      {numericValue}DT
    </div>
  );
}

export default Currency;
