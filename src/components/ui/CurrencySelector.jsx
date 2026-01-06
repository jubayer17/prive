import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
];

export default function CurrencySelector({ value, onChange, className }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map(c => (
          <SelectItem key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function formatPrice(amount, currency = 'USD') {
  const curr = currencies.find(c => c.code === currency) || currencies[0];
  return `${curr.symbol}${amount?.toFixed(2) || '0.00'}`;
}

export function getCurrencySymbol(currency = 'USD') {
  const curr = currencies.find(c => c.code === currency) || currencies[0];
  return curr.symbol;
}