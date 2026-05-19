export interface MasterDevice {
  brand: string;
  model: string;
  market_sell: number;
  max_buyback: number;
  floor_buyback: number;
}

export const BRANDS = [
  'iPhone', 'Samsung', 'Google Pixel', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Infinix', 'Asus / ROG', 'iQOO', 'Others'
];

export const DEVICE_MASTER_DATABASE: MasterDevice[] = [
  // ==========================================
  // APPLE (2020 - 2026)
  // ==========================================
  // 2020
  { brand: "iPhone", model: "iPhone SE (2020) 64GB", market_sell: 2000000, max_buyback: 1500000, floor_buyback: 1200000 },
  { brand: "iPhone", model: "iPhone 12 Mini 128GB", market_sell: 4000000, max_buyback: 3200000, floor_buyback: 2800000 },
  { brand: "iPhone", model: "iPhone 12 128GB", market_sell: 4800000, max_buyback: 3900000, floor_buyback: 3400000 },
  { brand: "iPhone", model: "iPhone 12 Pro 128GB", market_sell: 6200000, max_buyback: 5100000, floor_buyback: 4500000 },
  { brand: "iPhone", model: "iPhone 12 Pro Max 128GB", market_sell: 7000000, max_buyback: 5800000, floor_buyback: 5100000 },
  // 2021
  { brand: "iPhone", model: "iPhone 13 Mini 128GB", market_sell: 6000000, max_buyback: 4900000, floor_buyback: 4300000 },
  { brand: "iPhone", model: "iPhone 13 128GB", market_sell: 7200000, max_buyback: 6000000, floor_buyback: 5300000 },
  { brand: "iPhone", model: "iPhone 13 Pro 128GB", market_sell: 9300000, max_buyback: 7800000, floor_buyback: 7000000 },
  { brand: "iPhone", model: "iPhone 13 Pro Max 128GB", market_sell: 10500000, max_buyback: 8800000, floor_buyback: 7800000 },
  // 2022
  { brand: "iPhone", model: "iPhone SE (2022) 64GB", market_sell: 3500000, max_buyback: 2800000, floor_buyback: 2300000 },
  { brand: "iPhone", model: "iPhone 14 128GB", market_sell: 8900000, max_buyback: 7450000, floor_buyback: 6700000 },
  { brand: "iPhone", model: "iPhone 14 Plus 128GB", market_sell: 9800000, max_buyback: 8200000, floor_buyback: 7300000 },
  { brand: "iPhone", model: "iPhone 14 Pro 128GB", market_sell: 11500000, max_buyback: 9500000, floor_buyback: 8400000 },
  { brand: "iPhone", model: "iPhone 14 Pro Max 128GB", market_sell: 12800000, max_buyback: 10800000, floor_buyback: 9600000 },
  // 2023
  { brand: "iPhone", model: "iPhone 15 128GB", market_sell: 11200000, max_buyback: 9300000, floor_buyback: 8300000 },
  { brand: "iPhone", model: "iPhone 15 Plus 128GB", market_sell: 12500000, max_buyback: 10400000, floor_buyback: 9200000 },
  { brand: "iPhone", model: "iPhone 15 Pro 128GB", market_sell: 14800000, max_buyback: 12300000, floor_buyback: 11000000 },
  { brand: "iPhone", model: "iPhone 15 Pro Max 256GB", market_sell: 17200000, max_buyback: 14500000, floor_buyback: 13000000 },
  // 2024
  { brand: "iPhone", model: "iPhone 16 128GB", market_sell: 13800000, max_buyback: 11500000, floor_buyback: 10200000 },
  { brand: "iPhone", model: "iPhone 16 Plus 128GB", market_sell: 15200000, max_buyback: 12800000, floor_buyback: 11500000 },
  { brand: "iPhone", model: "iPhone 16 Pro 128GB", market_sell: 17500000, max_buyback: 14800000, floor_buyback: 13200000 },
  { brand: "iPhone", model: "iPhone 16 Pro Max 256GB", market_sell: 20500000, max_buyback: 17200000, floor_buyback: 15500000 },
  // 2025/2026 (Estimasi Terbaru di sistem)
  { brand: "iPhone", model: "iPhone 17 128GB", market_sell: 15500000, max_buyback: 13000000, floor_buyback: 11800000 },
  { brand: "iPhone", model: "iPhone 17 Pro Max 256GB", market_sell: 23500000, max_buyback: 19800000, floor_buyback: 18000000 },

  // ==========================================
  // SAMSUNG (2020 - 2026)
  // ==========================================
  // 2020
  { brand: "Samsung", model: "Galaxy S20 FE 8/128GB", market_sell: 2500000, max_buyback: 1800000, floor_buyback: 1500000 },
  { brand: "Samsung", model: "Galaxy Note 20 Ultra 8/256GB", market_sell: 4500000, max_buyback: 3500000, floor_buyback: 3000000 },
  // 2021
  { brand: "Samsung", model: "Galaxy S21 5G 8/256GB", market_sell: 3800000, max_buyback: 3000000, floor_buyback: 2500000 },
  { brand: "Samsung", model: "Galaxy S21 Ultra 5G 12/256GB", market_sell: 5100000, max_buyback: 4150000, floor_buyback: 3600000 },
  { brand: "Samsung", model: "Galaxy Z Flip 3 8/128GB", market_sell: 3500000, max_buyback: 2800000, floor_buyback: 2300000 },
  { brand: "Samsung", model: "Galaxy Z Fold 3 12/256GB", market_sell: 6000000, max_buyback: 4800000, floor_buyback: 4100000 },
  // 2022
  { brand: "Samsung", model: "Galaxy S22 5G 8/128GB", market_sell: 4400000, max_buyback: 3550000, floor_buyback: 3000000 },
  { brand: "Samsung", model: "Galaxy S22 Ultra 5G 12/256GB", market_sell: 7800000, max_buyback: 6300000, floor_buyback: 5500000 },
  { brand: "Samsung", model: "Galaxy Z Flip 4 8/256GB", market_sell: 5500000, max_buyback: 4500000, floor_buyback: 3800000 },
  { brand: "Samsung", model: "Galaxy Z Fold 4 12/256GB", market_sell: 9500000, max_buyback: 7800000, floor_buyback: 6800000 },
  { brand: "Samsung", model: "Galaxy A33 5G 8/128GB", market_sell: 2000000, max_buyback: 1500000, floor_buyback: 1200000 },
  { brand: "Samsung", model: "Galaxy A53 5G 8/256GB", market_sell: 2800000, max_buyback: 2200000, floor_buyback: 1800000 },
  // 2023
  { brand: "Samsung", model: "Galaxy S23 5G 8/256GB", market_sell: 8500000, max_buyback: 7000000, floor_buyback: 6100000 },
  { brand: "Samsung", model: "Galaxy S23 Ultra 12/256GB", market_sell: 11000000, max_buyback: 9000000, floor_buyback: 8000000 },
  { brand: "Samsung", model: "Galaxy Z Flip 5 8/256GB", market_sell: 9000000, max_buyback: 7500000, floor_buyback: 6500000 },
  { brand: "Samsung", model: "Galaxy Z Fold 5 12/256GB", market_sell: 15500000, max_buyback: 12800000, floor_buyback: 11000000 },
  { brand: "Samsung", model: "Galaxy A34 5G 8/128GB", market_sell: 2700000, max_buyback: 2150000, floor_buyback: 1800000 },
  { brand: "Samsung", model: "Galaxy A54 5G 8/256GB", market_sell: 3600000, max_buyback: 2900000, floor_buyback: 2400000 },
  // 2024
  { brand: "Samsung", model: "Galaxy S24 5G 8/256GB", market_sell: 9500000, max_buyback: 7900000, floor_buyback: 7000000 },
  { brand: "Samsung", model: "Galaxy S24 Ultra 12/256GB", market_sell: 14500000, max_buyback: 12000000, floor_buyback: 10500000 },
  { brand: "Samsung", model: "Galaxy Z Flip 6 12/256GB", market_sell: 13500000, max_buyback: 11200000, floor_buyback: 9800000 },
  { brand: "Samsung", model: "Galaxy Z Fold 6 12/256GB", market_sell: 21500000, max_buyback: 18200000, floor_buyback: 16500000 },
  { brand: "Samsung", model: "Galaxy A35 5G 8/256GB", market_sell: 3800000, max_buyback: 3100000, floor_buyback: 2600000 },
  { brand: "Samsung", model: "Galaxy A55 5G 8/256GB", market_sell: 4700000, max_buyback: 3850000, floor_buyback: 3300000 },
  // 2025/2026
  { brand: "Samsung", model: "Galaxy S25 Ultra 12/256GB", market_sell: 18500000, max_buyback: 15500000, floor_buyback: 14000000 },
  { brand: "Samsung", model: "Galaxy A56 5G 8/256GB", market_sell: 5500000, max_buyback: 4500000, floor_buyback: 3900000 },

  // ==========================================
  // GOOGLE PIXEL (2020 - 2026)
  // ==========================================
  { brand: "Google Pixel", model: "Google Pixel 5 8/128GB", market_sell: 2500000, max_buyback: 1800000, floor_buyback: 1500000 },
  { brand: "Google Pixel", model: "Google Pixel 6 8/128GB", market_sell: 3400000, max_buyback: 2700000, floor_buyback: 2200000 },
  { brand: "Google Pixel", model: "Google Pixel 6 Pro 12/128GB", market_sell: 4200000, max_buyback: 3400000, floor_buyback: 2900000 },
  { brand: "Google Pixel", model: "Google Pixel 7 8/128GB", market_sell: 4500000, max_buyback: 3650000, floor_buyback: 3100000 },
  { brand: "Google Pixel", model: "Google Pixel 7 Pro 12/256GB", market_sell: 5400000, max_buyback: 4400000, floor_buyback: 3800000 },
  { brand: "Google Pixel", model: "Google Pixel 8 8/128GB", market_sell: 7300000, max_buyback: 6000000, floor_buyback: 5200000 },
  { brand: "Google Pixel", model: "Google Pixel 8 Pro 12/128GB", market_sell: 9200000, max_buyback: 7600000, floor_buyback: 6700000 },
  { brand: "Google Pixel", model: "Google Pixel 9 Pro 16/256GB", market_sell: 13500000, max_buyback: 11500000, floor_buyback: 10200000 },

  // ==========================================
  // XIAOMI / POCO (2020 - 2026)
  // ==========================================
  { brand: "Xiaomi", model: "POCO X3 Pro 8/256GB", market_sell: 2000000, max_buyback: 1500000, floor_buyback: 1200000 },
  { brand: "Xiaomi", model: "POCO F3 5G 8/256GB", market_sell: 2500000, max_buyback: 1900000, floor_buyback: 1500000 },
  { brand: "Xiaomi", model: "POCO X5 Pro 5G 8/256GB", market_sell: 2800000, max_buyback: 2200000, floor_buyback: 1800000 },
  { brand: "Xiaomi", model: "POCO F5 5G 8/256GB", market_sell: 3400000, max_buyback: 2750000, floor_buyback: 2300000 },
  { brand: "Xiaomi", model: "POCO X6 Pro 5G 12/512GB", market_sell: 3700000, max_buyback: 3000000, floor_buyback: 2550000 },
  { brand: "Xiaomi", model: "POCO F6 12/512GB", market_sell: 5200000, max_buyback: 4300000, floor_buyback: 3700000 },
  { brand: "Xiaomi", model: "Redmi Note 10 Pro 8/128GB", market_sell: 1500000, max_buyback: 1100000, floor_buyback: 800000 },
  { brand: "Xiaomi", model: "Redmi Note 11 Pro 5G 8/128GB", market_sell: 2100000, max_buyback: 1600000, floor_buyback: 1300000 },
  { brand: "Xiaomi", model: "Redmi Note 12 Pro 5G 8/256GB", market_sell: 2500000, max_buyback: 1950000, floor_buyback: 1600000 },
  { brand: "Xiaomi", model: "Redmi Note 13 Pro 5G 8/256GB", market_sell: 3200000, max_buyback: 2550000, floor_buyback: 2100000 },
  { brand: "Xiaomi", model: "Redmi Note 14 Pro+ 12/512GB", market_sell: 4800000, max_buyback: 3900000, floor_buyback: 3400000 },
  { brand: "Xiaomi", model: "Xiaomi 11T Pro 12/256GB", market_sell: 3500000, max_buyback: 2800000, floor_buyback: 2300000 },
  { brand: "Xiaomi", model: "Xiaomi 12 8/256GB", market_sell: 4500000, max_buyback: 3600000, floor_buyback: 3100000 },
  { brand: "Xiaomi", model: "Xiaomi 13T 12/256GB", market_sell: 4900000, max_buyback: 4000000, floor_buyback: 3500000 },
  { brand: "Xiaomi", model: "Xiaomi 14 12/256GB", market_sell: 9800000, max_buyback: 8200000, floor_buyback: 7200000 },
  { brand: "Xiaomi", model: "Xiaomi 15 Pro 16/512GB", market_sell: 14500000, max_buyback: 12000000, floor_buyback: 10500000 },

  // ==========================================
  // OPPO (2020 - 2026)
  // ==========================================
  { brand: "Oppo", model: "Oppo Reno 5 5G 8/128GB", market_sell: 1800000, max_buyback: 1300000, floor_buyback: 1000000 },
  { brand: "Oppo", model: "Oppo Reno 8 5G 8/256GB", market_sell: 2500000, max_buyback: 1900000, floor_buyback: 1500000 },
  { brand: "Oppo", model: "Oppo Reno 10 5G 8/256GB", market_sell: 3100000, max_buyback: 2450000, floor_buyback: 2000000 },
  { brand: "Oppo", model: "Oppo Reno 11 5G 8/256GB", market_sell: 3900000, max_buyback: 3100000, floor_buyback: 2650000 },
  { brand: "Oppo", model: "Oppo Reno 12 Pro 5G 12/512GB", market_sell: 6500000, max_buyback: 5300000, floor_buyback: 4600000 },
  { brand: "Oppo", model: "Oppo Find X5 Pro 12/256GB", market_sell: 6500000, max_buyback: 5200000, floor_buyback: 4500000 },
  { brand: "Oppo", model: "Oppo Find N3 Flip 12/256GB", market_sell: 9500000, max_buyback: 7800000, floor_buyback: 6800000 },
  { brand: "Oppo", model: "Oppo Find X8 Ultra 16/512GB", market_sell: 16500000, max_buyback: 13800000, floor_buyback: 12200000 },

  // ==========================================
  // VIVO (2020 - 2026)
  // ==========================================
  { brand: "Vivo", model: "Vivo V20 8/128GB", market_sell: 1500000, max_buyback: 1100000, floor_buyback: 800000 },
  { brand: "Vivo", model: "Vivo V25 5G 8/256GB", market_sell: 2500000, max_buyback: 1900000, floor_buyback: 1500000 },
  { brand: "Vivo", model: "Vivo V27 5G 8/256GB", market_sell: 3200000, max_buyback: 2550000, floor_buyback: 2150000 },
  { brand: "Vivo", model: "Vivo V29 5G 8/256GB", market_sell: 3800000, max_buyback: 3050000, floor_buyback: 2600000 },
  { brand: "Vivo", model: "Vivo V30 5G 8/256GB", market_sell: 4100000, max_buyback: 3300000, floor_buyback: 2800000 },
  { brand: "Vivo", model: "Vivo V30 Pro 5G 12/512GB", market_sell: 6500000, max_buyback: 5300000, floor_buyback: 4600000 },
  { brand: "Vivo", model: "Vivo X80 Pro 12/256GB", market_sell: 7000000, max_buyback: 5600000, floor_buyback: 4900000 },
  { brand: "Vivo", model: "Vivo X100 Pro 16/512GB", market_sell: 12500000, max_buyback: 10400000, floor_buyback: 9200000 },

  // ==========================================
  // REALME (2020 - 2026)
  // ==========================================
  { brand: "Realme", model: "Realme 7 Pro 8/128GB", market_sell: 1400000, max_buyback: 1000000, floor_buyback: 700000 },
  { brand: "Realme", model: "Realme 9 Pro+ 5G 8/256GB", market_sell: 2200000, max_buyback: 1700000, floor_buyback: 1400000 },
  { brand: "Realme", model: "Realme 11 Pro 5G 8/256GB", market_sell: 3200000, max_buyback: 2500000, floor_buyback: 2100000 },
  { brand: "Realme", model: "Realme 12 Pro+ 5G 8/256GB", market_sell: 4300000, max_buyback: 3500000, floor_buyback: 3000000 },
  { brand: "Realme", model: "Realme 13 Pro+ 5G 12/512GB", market_sell: 5500000, max_buyback: 4500000, floor_buyback: 3900000 },
  { brand: "Realme", model: "Realme GT Master Edition 8/256GB", market_sell: 2300000, max_buyback: 1800000, floor_buyback: 1500000 },
  { brand: "Realme", model: "Realme GT3 16/1TB", market_sell: 6500000, max_buyback: 5300000, floor_buyback: 4600000 },

  // ==========================================
  // INFINIX (2020 - 2026)
  // ==========================================
  { brand: "Infinix", model: "Infinix Zero X Pro 8/256GB", market_sell: 1800000, max_buyback: 1300000, floor_buyback: 1000000 },
  { brand: "Infinix", model: "Infinix Zero 30 5G 12/256GB", market_sell: 3100000, max_buyback: 2400000, floor_buyback: 1900000 },
  { brand: "Infinix", model: "Infinix Note 12 VIP 8/256GB", market_sell: 2000000, max_buyback: 1500000, floor_buyback: 1200000 },
  { brand: "Infinix", model: "Infinix Note 40 Pro 8/256GB", market_sell: 2100000, max_buyback: 1600000, floor_buyback: 1250000 },
  { brand: "Infinix", model: "Infinix GT 10 Pro 8/256GB", market_sell: 2800000, max_buyback: 2200000, floor_buyback: 1800000 },
  { brand: "Infinix", model: "Infinix GT 20 Pro 5G 12/256GB", market_sell: 3300000, max_buyback: 2650000, floor_buyback: 2200000 },

  // ==========================================
  // ASUS / ROG & iQOO & Others
  // ==========================================
  { brand: "Asus / ROG", model: "ROG Phone 3 8/128GB", market_sell: 3500000, max_buyback: 2700000, floor_buyback: 2200000 },
  { brand: "Asus / ROG", model: "ROG Phone 6 8/256GB", market_sell: 6000000, max_buyback: 4800000, floor_buyback: 4100000 },
  { brand: "Asus / ROG", model: "ROG Phone 8 12/256GB", market_sell: 10500000, max_buyback: 8800000, floor_buyback: 7800000 },
  { brand: "Asus / ROG", model: "ROG Phone 9 16/512GB", market_sell: 14500000, max_buyback: 12000000, floor_buyback: 10500000 },
  { brand: "iQOO", model: "iQOO 11 5G 16/256GB", market_sell: 6800000, max_buyback: 5600000, floor_buyback: 4900000 },
  { brand: "iQOO", model: "iQOO 12 5G 16/512GB", market_sell: 9500000, max_buyback: 8000000, floor_buyback: 7000000 },
  { brand: "Others", model: "Tecno Pova 6 Pro 5G 12/256GB", market_sell: 2250000, max_buyback: 1750000, floor_buyback: 1350000 }
];
