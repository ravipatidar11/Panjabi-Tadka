import { MenuItem, Review } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // Tandoori Specialties
  {
    id: 'tandoori-chicken',
    name: 'Royal Tandoori Chicken',
    description: 'Whole spring chicken marinated overnight in fresh yogurt, kashmiri chilli, & hand-ground garam masala, roasted in clay tandoor.',
    price: 1590,
    category: 'tandoori',
    categoryLabel: 'Tandoori Specialties',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 2,
    isVeg: false,
    isChefSpecial: true,
    isBestseller: true,
    portionSize: 'Full / 4 Pieces'
  },
  {
    id: 'paneer-tikka',
    name: 'Amritsari Paneer Tikka',
    description: 'Artisanal fresh cottage cheese cubes marinated in mustard oil, ajwain, curd, and bell peppers, charred to smoky perfection.',
    price: 1390,
    category: 'tandoori',
    categoryLabel: 'Tandoori Specialties',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 1,
    isVeg: true,
    isGlutenFree: true,
    isBestseller: true,
    portionSize: '6 Pieces'
  },
  {
    id: 'seekh-kebab',
    name: 'Bhatti Seekh Kebab',
    description: 'Minced spiced lamb with ginger, mint, coriander, skewered and slow-cooked over charcoal embers.',
    price: 1680,
    category: 'tandoori',
    categoryLabel: 'Tandoori Specialties',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 2,
    isVeg: false,
    isChefSpecial: true,
    portionSize: '4 Long Skewers'
  },

  // Mains - Chicken & Meats
  {
    id: 'butter-chicken',
    name: 'Murgh Makhani (Butter Chicken)',
    description: 'Tandoori chicken simmered in rich velvety tomato, cashew paste, green cardamom, and homemade white butter.',
    price: 1640,
    category: 'mains',
    categoryLabel: 'Main Course',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 1,
    isVeg: false,
    isBestseller: true,
    isGlutenFree: true,
    portionSize: '16 oz Bowl'
  },
  {
    id: 'chicken-tikka-masala',
    name: 'Chicken Tikka Masala',
    description: 'Charbroiled chicken chunks cooked in a robust onion-tomato gravy infused with roasted cumin and kasuri methi.',
    price: 1590,
    category: 'mains',
    categoryLabel: 'Main Course',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 2,
    isVeg: false,
    portionSize: '16 oz Bowl'
  },
  {
    id: 'mutton-roganjosh',
    name: 'Dhaba Goat Curry',
    description: 'Tender bone-in goat slow-cooked for 4 hours in copper Handi with whole Punjabi spices and roasted onions.',
    price: 1890,
    category: 'mains',
    categoryLabel: 'Main Course',
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 3,
    isVeg: false,
    isChefSpecial: true,
    portionSize: '16 oz Bowl'
  },

  // Mains - Vegetarian
  {
    id: 'dal-makhani',
    name: 'Overnight Slow-Cooked Dal Makhani',
    description: 'Black lentils & kidney beans slow simmered on hot ashes for 16 hours, finished with churned butter and fresh cream.',
    price: 1340,
    category: 'mains',
    categoryLabel: 'Main Course',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 1,
    isVeg: true,
    isBestseller: true,
    isGlutenFree: true,
    portionSize: '16 oz Bowl'
  },
  {
    id: 'sarson-ka-saag',
    name: 'Amritsari Sarson Ka Saag',
    description: 'Traditional mustard greens, spinach, and bathua blended and tempered with garlic, white butter, and green chillies.',
    price: 1420,
    category: 'mains',
    categoryLabel: 'Main Course',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 2,
    isVeg: true,
    isChefSpecial: true,
    portionSize: 'Served with Butter'
  },
  {
    id: 'shahi-paneer',
    name: 'Shahi Paneer Saffron',
    description: 'Soft paneer cubes in a silky cashew, almond, and saffron cream sauce with subtle hints of kewra.',
    price: 1420,
    category: 'mains',
    categoryLabel: 'Main Course',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 1,
    isVeg: true,
    isGlutenFree: true,
    portionSize: '16 oz Bowl'
  },

  // Starters
  {
    id: 'amritsari-fish-fry',
    name: 'Amritsari Fish Fry',
    description: 'Fresh cod fillet crisp fried in carom seed (ajwain) and gram flour batter, served with spicy mint chutneys.',
    price: 1340,
    category: 'starters',
    categoryLabel: 'Starters',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 2,
    isVeg: false,
    isBestseller: true,
    portionSize: '6 Crispy Strips'
  },
  {
    id: 'samosa-chaat',
    name: 'Delhi Samosa Chaat',
    description: 'Crispy potato samosas crushed & topped with warm chana masala, sweetened yogurt, tamarind & mint chutney.',
    price: 920,
    category: 'starters',
    categoryLabel: 'Starters',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 1,
    isVeg: true,
    portionSize: '2 Big Samosas'
  },

  // Breads
  {
    id: 'garlic-naan',
    name: 'Garlic Butter Naan',
    description: 'Leavened clay tandoor bread brushed with melted ghee, garlic, and fresh coriander.',
    price: 380,
    category: 'breads',
    categoryLabel: 'Fresh Breads',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 0,
    isVeg: true,
    isBestseller: true,
    portionSize: '1 Large Naan'
  },
  {
    id: 'amritsari-kulcha',
    name: 'Amritsari Stuffed Kulcha',
    description: 'Flaky multi-layered bread stuffed with spiced mashed potatoes, onions, and pomegranate seeds, baked crisp in tandoor.',
    price: 580,
    category: 'breads',
    categoryLabel: 'Fresh Breads',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 1,
    isVeg: true,
    isChefSpecial: true,
    portionSize: 'Served with Chana'
  },
  {
    id: 'makki-di-roti',
    name: 'Makki Di Roti',
    description: 'Traditional cornmeal flatbread griddled with pure white butter, best enjoyed with Sarson Ka Saag.',
    price: 360,
    category: 'breads',
    categoryLabel: 'Fresh Breads',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 0,
    isVeg: true,
    isGlutenFree: true,
    portionSize: '1 Bread'
  },

  // Rice & Biryanis
  {
    id: 'royal-mutton-biryani',
    name: 'Royal Dum Mutton Biryani',
    description: 'Fragrant long-grain Basmati rice cooked on dum sealed pot with succulent goat meat, saffron, mint & fried onions.',
    price: 1840,
    category: 'rice',
    categoryLabel: 'Biryanis & Rice',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 2,
    isVeg: false,
    isChefSpecial: true,
    portionSize: 'Served with Raita'
  },
  {
    id: 'saffron-jeera-rice',
    name: 'Saffron Jeera Basmati Rice',
    description: 'Aromatic aged Basmati rice tempered with roasted cumin seeds and infused with Kashmiri saffron strands.',
    price: 550,
    category: 'rice',
    categoryLabel: 'Biryanis & Rice',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 0,
    isVeg: true,
    isGlutenFree: true,
    portionSize: 'Serves 2'
  },

  // Desserts & Beverages
  {
    id: 'mango-lassi',
    name: 'Kulhad Mango Lassi',
    description: 'Thick churned yogurt drink blended with Alphonso mango pulp, cardamom, and topped with sliced pistachios in clay kulhad.',
    price: 500,
    category: 'beverages',
    categoryLabel: 'Beverages & Drinks',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 0,
    isVeg: true,
    isBestseller: true,
    portionSize: '16 oz Kulhad'
  },
  {
    id: 'gulab-jamun',
    name: 'Hot Gulab Jamun with Rabri',
    description: 'Fried milk dumplings soaked in cardamom rose syrup, served warm with thickened pistachio rabri.',
    price: 630,
    category: 'desserts',
    categoryLabel: 'Desserts',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 0,
    isVeg: true,
    isBestseller: true,
    portionSize: '2 Warm Pieces'
  },
  {
    id: 'masala-chai',
    name: 'Kullhad Special Masala Chai',
    description: 'Fresh boiled black tea brewed with whole green cardamom, ginger, cloves, cinnamon, and whole milk.',
    price: 330,
    category: 'beverages',
    categoryLabel: 'Beverages & Drinks',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    spiceLevel: 0,
    isVeg: true,
    portionSize: 'Served Hot'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Gurpreet Singh',
    rating: 5,
    date: '2 days ago',
    comment: 'The Dal Makhani takes me straight back to Amritsar! Cooked slowly on hot coals with that true smoky flavor. Best Punjabi food in the entire region!',
    dishRecommended: 'Dal Makhani & Amritsari Kulcha',
    source: 'Google',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'rev-2',
    author: 'Sarah Jenkins',
    rating: 5,
    date: '1 week ago',
    comment: 'Ordered catering for my daughter’s wedding rehearsal dinner for 120 guests. The Butter Chicken and Tandoori appetizers were an absolute hit!',
    dishRecommended: 'Royal Tandoori Platter',
    source: 'Yelp',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'rev-3',
    author: 'Rahul Sharma',
    rating: 5,
    date: '3 weeks ago',
    comment: 'The Sarson Ka Saag with Makki Di Roti in winter is perfection. Fresh butter on top and authentic spices. Beautiful ambiance and super courteous staff.',
    dishRecommended: 'Sarson Ka Saag & Mango Lassi',
    source: 'OpenTable',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  }
];

export const CATERING_PACKAGES = [
  {
    id: 'royal-maharaja',
    name: 'Royal Maharaja Feast',
    pricePerPerson: 3190,
    minGuests: 25,
    description: 'Our flagship luxury buffet experience with live tandoor counter option.',
    includes: [
      '3 Tandoori Starters (Veg & Non-Veg)',
      '3 Signature Main Courses (Butter Chicken, Mutton, Paneer)',
      'Slow-cooked Dal Makhani & Saffron Basmati',
      'Assorted Naan & Kulcha baked fresh',
      'Live Chaat Counter / Salad bar',
      '2 Premium Desserts (Gulab Jamun & Rasmalai)'
    ],
    popular: true
  },
  {
    id: 'punjab-heritage',
    name: 'Punjab Heritage Buffet',
    pricePerPerson: 2350,
    minGuests: 20,
    description: 'Authentic comforting home-style Punjabi celebration menu.',
    includes: [
      '2 Tandoori Starters',
      '2 Main Courses (Chicken Tikka Masala & Shahi Paneer)',
      'Dal Makhani & Jeera Rice',
      'Garlic & Plain Naan',
      'Fresh Cucumber Raita & Salads',
      'Hot Gulab Jamun'
    ]
  },
  {
    id: 'cocktail-bites',
    name: 'High-Spirits Cocktail Bites',
    pricePerPerson: 1850,
    minGuests: 15,
    description: 'Finger foods, skewers, and mini chaat stalls perfect for corporate mixers & cocktail parties.',
    includes: [
      'Paneer Tikka Skewers',
      'Amritsari Fish Bites',
      'Chicken Seekh Kebabs',
      'Samosa Cocktail Chaat Shots',
      'Assorted Chutneys & Dips'
    ]
  }
];
