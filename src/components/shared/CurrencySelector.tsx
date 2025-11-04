import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: "CNY", symbol: "¥", name: "(CNY)" },
  { code: "USD", symbol: "$", name: "(USD)" },
  { code: "EUR", symbol: "€", name: "(EUR)" },
  { code: "GBP", symbol: "£", name: "(GBP)" },
  { code: "JPY", symbol: "¥", name: "(JPY)" },
  { code: "KRW", symbol: "₩", name: "(KRW)" },
  { code: "HKD", symbol: "HK$", name: "(HKD)" },
  { code: "SGD", symbol: "S$", name: "(SGD)" },
];

interface CurrencySelectorProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export function CurrencySelector({ currency, onCurrencyChange }: CurrencySelectorProps) {
  const t = useTranslations('calculator');
  
  return (
    <div className="w-48">
      <Label htmlFor="currency" className="text-sm mb-2 block">
        {t('currency_label')}
      </Label>
      <Select
        value={currency.code}
        onValueChange={(code) => {
          const selected = CURRENCIES.find((c) => c.code === code);
          if (selected) onCurrencyChange(selected);
        }}
      >
        <SelectTrigger id="currency" className="h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CURRENCIES.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              {curr.symbol} {curr.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
