export interface Product {
  id: string;
  name: string;
  brand: 'iPhone' | 'Samsung' | 'Xiaomi' | 'Oppo' | 'Vivo' | 'Realme' | 'Other';
  price: number;
  originalPrice?: number;
  condition: 'Like New' | 'Very Good' | 'Good';
  batteryHealth: number;
  storage: string;
  ram: string;
  chipset: string;
  color: string;
  image: string;
  images: string[];
  status: 'Ready' | 'Sold';
  antutuScore?: number;
  description: string;
  hasUBL: boolean;
  isRooted: boolean;
  warrantyStatus: string;
  accessories: string[];
  isFeatured: boolean;
  createdAt: string;
}

export const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 128GB',
    brand: 'iPhone',
    price: 4800000,
    originalPrice: 5300000,
    condition: 'Like New',
    batteryHealth: 91,
    storage: '128GB',
    ram: '4GB',
    chipset: 'Apple A15 Bionic',
    color: 'Midnight',
    image: 'https://images.unsplash.com/photo-1760074016472-029d6b082429?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1760074016472-029d6b082429?w=500&q=80',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&q=80',
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500&q=80'
    ],
    status: 'Ready',
    antutuScore: 789000,
    description:
      'iPhone 13 kondisi mulus, battery health 91%, iCloud OFF, tidak ada minus. Warna Midnight elegan, layar mulus tanpa goresan. Sudah dicek dengan 3uTools: semua komponen original. Face ID berfungsi sempurna.',
    hasUBL: false,
    isRooted: false,
    warrantyStatus: 'No Warranty',
    accessories: ['Dus Original', 'Kabel Lightning', 'Charger Head 20W'],
    isFeatured: true,
    createdAt: '2025-04-01',
  },
  {
    id: '2',
    name: 'Samsung Galaxy A54 5G 256GB',
    brand: 'Samsung',
    price: 3500000,
    originalPrice: 3900000,
    condition: 'Like New',
    batteryHealth: 88,
    storage: '256GB',
    ram: '8GB',
    chipset: 'Exynos 1380',
    color: 'Awesome Violet',
    image: 'https://images.unsplash.com/photo-1633686457670-2d80f3ce696b?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1633686457670-2d80f3ce696b?w=500&q=80',
      'https://images.unsplash.com/photo-1610945415295-d9baf06020a1?w=500&q=80',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80'
    ],
    status: 'Ready',
    antutuScore: 492000,
    description:
      'Samsung A54 5G dengan storage besar 256GB, RAM 8GB. Layar Super AMOLED 6.4" masih sangat bagus. Sudah dilakukan stress test 30 menit, tidak throttle berlebihan. Baterai 88% masih sangat baik.',
    hasUBL: false,
    isRooted: false,
    warrantyStatus: 'No Warranty',
    accessories: ['Dus Original', 'Kabel USB-C', 'Softcase'],
    isFeatured: true,
    createdAt: '2025-04-05',
  },
  {
    id: '3',
    name: 'Xiaomi Redmi Note 12 Pro 256GB',
    brand: 'Xiaomi',
    price: 2400000,
    condition: 'Very Good',
    batteryHealth: 85,
    storage: '256GB',
    ram: '8GB',
    chipset: 'MediaTek Helio G99',
    color: 'Polar White',
    image: 'https://images.unsplash.com/photo-1728897061866-9933536214a9?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1728897061866-9933536214a9?w=500&q=80',
      'https://images.unsplash.com/photo-1664447972886-0498b5849880?w=500&q=80'
    ],
    status: 'Sold',
    antutuScore: 451000,
    description:
      'Redmi Note 12 Pro dengan kamera 108MP, sudah unlock bootloader. Kondisi sangat baik, hanya ada bekas pemakaian ringan. Layar 120Hz mulus.',
    hasUBL: true,
    isRooted: false,
    warrantyStatus: 'No Warranty',
    accessories: ['Dus Original', 'Kabel USB-C'],
    isFeatured: false,
    createdAt: '2025-03-20',
  },
  {
    id: '4',
    name: 'iPhone 12 128GB',
    brand: 'iPhone',
    price: 4200000,
    originalPrice: 4500000,
    condition: 'Very Good',
    batteryHealth: 89,
    storage: '128GB',
    ram: '4GB',
    chipset: 'Apple A14 Bionic',
    color: 'Product Red',
    image: 'https://images.unsplash.com/photo-1588515603140-81bd9f7d1db0?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1588515603140-81bd9f7d1db0?w=500&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80'
    ],
    status: 'Ready',
    antutuScore: 672000,
    description:
      'iPhone 12 warna Product Red edisi, kondisi sangat baik. Battery health 89%, iCloud OFF. Semua fungsi normal, Face ID sempurna. Dipastikan bukan rekondisi melalui 3uTools.',
    hasUBL: false,
    isRooted: false,
    warrantyStatus: 'No Warranty',
    accessories: ['Dus Original', 'Kabel Lightning'],
    isFeatured: false,
    createdAt: '2025-03-25',
  },
  {
    id: '5',
    name: 'Samsung Galaxy S21 FE 5G 128GB',
    brand: 'Samsung',
    price: 3200000,
    condition: 'Good',
    batteryHealth: 82,
    storage: '128GB',
    ram: '6GB',
    chipset: 'Snapdragon 888',
    color: 'Graphite',
    image: 'https://images.unsplash.com/photo-1587749090881-1ea18126ab3a?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1587749090881-1ea18126ab3a?w=500&q=80',
      'https://images.unsplash.com/photo-1610945264801-687430fef684?w=500&q=80'
    ],
    status: 'Ready',
    antutuScore: 821000,
    description:
      'Samsung S21 FE dengan chipset flagship Snapdragon 888! Kondisi good, ada bekas pemakaian wajar di frame. Layar Super AMOLED 120Hz masih tajam. Baterai 82%, direkomendasikan ganti baterai untuk performa optimal.',
    hasUBL: false,
    isRooted: false,
    warrantyStatus: 'No Warranty',
    accessories: ['Kabel USB-C'],
    isFeatured: false,
    createdAt: '2025-04-10',
  },
  {
    id: '6',
    name: 'OPPO Reno 8 128GB',
    brand: 'Oppo',
    price: 2200000,
    condition: 'Good',
    batteryHealth: 84,
    storage: '128GB',
    ram: '8GB',
    chipset: 'MediaTek Dimensity 1300',
    color: 'Shimmer Gold',
    image: 'https://images.unsplash.com/photo-1633997011021-0254baa23289?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1633997011021-0254baa23289?w=500&q=80',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80'
    ],
    status: 'Sold',
    antutuScore: 561000,
    description:
      'OPPO Reno 8 dengan desain tipis dan elegan. Kondisi good, ada sedikit goresan micro di body belakang. Layar AMOLED 90Hz masih oke. Kamera portrait bagus.',
    hasUBL: false,
    isRooted: false,
    warrantyStatus: 'No Warranty',
    accessories: ['Charger 65W', 'Kabel USB-C'],
    isFeatured: false,
    createdAt: '2025-03-15',
  },
];

