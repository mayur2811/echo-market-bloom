
export const products = [
  {
    id: "p1",
    name: "LCD Monitor",
    description: "High-quality LED gaming monitor with high refresh rate and low response time",
    price: 650,
    discountPrice: 599.99,
    category: "Electronics",
    imageUrl: "https://source.unsplash.com/random/300x300/?monitor",
    sellerId: "seller-001",
    stock: 10,
    rating: 4.5,
    reviews: [
      {
        id: "r1",
        userId: "u1",
        username: "John",
        rating: 5,
        comment: "Great monitor, amazing colors!",
        createdAt: "2023-01-01T00:00:00.000Z"
      }
    ],
    specifications: {
      brand: "BrandX",
      model: "ModelY",
      size: "27 inch",
      resolution: "1920x1080"
    }
  },
  {
    id: "p2",
    name: "Gaming Keyboard",
    description: "Mechanical RGB gaming keyboard with customizable keys",
    price: 200,
    discountPrice: 159.99,
    category: "Gaming",
    imageUrl: "https://source.unsplash.com/random/300x300/?keyboard",
    sellerId: "seller-001",
    stock: 15,
    rating: 4.2,
    reviews: [],
    specifications: {
      brand: "GamerZ",
      model: "MX-3000",
      type: "Mechanical",
      layout: "QWERTY"
    }
  },
  {
    id: "p3",
    name: "Gaming Headset",
    description: "Professional-grade gaming headset with surround sound",
    price: 150,
    discountPrice: 129.99,
    category: "Gaming",
    imageUrl: "https://source.unsplash.com/random/300x300/?headset",
    sellerId: "seller-002",
    stock: 8,
    rating: 4.7,
    reviews: [],
    specifications: {
      brand: "AudioMax",
      model: "ProGamer 7.1",
      connectivity: "Wired",
      compatibility: "PC, PlayStation, Xbox"
    }
  },
  {
    id: "p4",
    name: "Gaming Mouse",
    description: "High-precision gaming mouse with programmable buttons",
    price: 80,
    discountPrice: 69.99,
    category: "Gaming",
    imageUrl: "https://source.unsplash.com/random/300x300/?mouse",
    sellerId: "seller-002",
    stock: 20,
    rating: 4.5,
    reviews: [],
    specifications: {
      brand: "GamerZ",
      model: "Precision Pro",
      DPI: "16000",
      buttons: "7 programmable buttons"
    }
  },
  {
    id: "p5",
    name: "Gaming Laptop",
    description: "Powerful gaming laptop with high-end graphics and processing power",
    price: 1500,
    discountPrice: 1399.99,
    category: "Computers",
    imageUrl: "https://source.unsplash.com/random/300x300/?laptop",
    sellerId: "seller-003",
    stock: 5,
    rating: 4.8,
    reviews: [],
    specifications: {
      brand: "GameBook",
      model: "Pro X",
      processor: "Intel i9",
      graphics: "NVIDIA RTX 3080"
    }
  },
  {
    id: "p6",
    name: "Gaming Chair",
    description: "Ergonomic gaming chair with lumbar support",
    price: 250,
    discountPrice: 229.99,
    category: "Furniture",
    imageUrl: "https://source.unsplash.com/random/300x300/?gaming+chair",
    sellerId: "seller-003",
    stock: 12,
    rating: 4.3,
    reviews: [],
    specifications: {
      brand: "ComfortSeat",
      model: "GamerPro",
      material: "Leather",
      weight: "25kg"
    }
  },
  {
    id: "p7",
    name: "Wireless Controller",
    description: "High-quality wireless controller compatible with multiple platforms",
    price: 70,
    discountPrice: 59.99,
    category: "Gaming",
    imageUrl: "https://source.unsplash.com/random/300x300/?controller",
    sellerId: "seller-001",
    stock: 30,
    rating: 4.6,
    reviews: [],
    specifications: {
      brand: "GamePlus",
      model: "X-500",
      connectivity: "Wireless",
      battery: "20-hour battery life"
    }
  },
  {
    id: "p8",
    name: "Gaming Console",
    description: "Next-gen gaming console with 4K capabilities",
    price: 499,
    discountPrice: 479.99,
    category: "Electronics",
    imageUrl: "https://source.unsplash.com/random/300x300/?console",
    sellerId: "seller-002",
    stock: 7,
    rating: 4.9,
    reviews: [],
    specifications: {
      brand: "GameStation",
      model: "X5",
      storage: "1TB SSD",
      resolution: "4K"
    }
  }
];
