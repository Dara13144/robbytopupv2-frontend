import { GameProduct } from './api';

const MLBB_PACKAGES = [
  { id: 'mlbb-evo3d', productId: 'p-mlbb', name: 'Evo3D MLBB', amount: 100, price: 0.99, category: 'BEST_SELLER', isActive: true, badge: null },
  { id: 'mlbb-weekly', productId: 'p-mlbb', name: 'Weekly Pass Best', amount: 210, price: 1.80, category: 'BEST_SELLER', isActive: true, badge: 'ទទួលបាន 200 💎 ភ្លាមៗ' },
  { id: 'mlbb-11', productId: 'p-mlbb', name: '11 Diamonds', amount: 11, price: 0.25, category: 'NORMAL', isActive: true, badge: null },
  { id: 'mlbb-50', productId: 'p-mlbb', name: '50 Diamonds', amount: 50, price: 0.99, category: 'NORMAL', isActive: true, badge: 'សាកល្បង' },
  { id: 'mlbb-150', productId: 'p-mlbb', name: '150 Diamonds', amount: 150, price: 2.80, category: 'NORMAL', isActive: true, badge: null },
  { id: 'mlbb-250', productId: 'p-mlbb', name: '250 Diamonds', amount: 250, price: 4.50, category: 'NORMAL', isActive: true, badge: 'ពេញនិយម' },
  { id: 'mlbb-500', productId: 'p-mlbb', name: '500 Diamonds', amount: 500, price: 8.90, category: 'NORMAL', isActive: true, badge: null },
  { id: 'mlbb-1000', productId: 'p-mlbb', name: '1000 Diamonds', amount: 1000, price: 17.50, category: 'NORMAL', isActive: true, badge: 'កញ្ចប់ពិសេស 💎' },
];

const FF_PACKAGES = [
  { id: 'ff-evo3d', productId: 'p-ff', name: 'Evo3D', amount: 50, price: 0.83, category: 'BEST_SELLER', isActive: true, badge: null },
  { id: 'ff-evo7d', productId: 'p-ff', name: 'Evo7D', amount: 100, price: 0.97, category: 'BEST_SELLER', isActive: true, badge: null },
  { id: 'ff-evo30d', productId: 'p-ff', name: 'Evo30D', amount: 200, price: 2.48, category: 'BEST_SELLER', isActive: true, badge: null },
  { id: 'ff-luck', productId: 'p-ff', name: 'ផ្សងសំណាង', amount: 80, price: 0.57, category: 'BEST_SELLER', isActive: true, badge: 'បានមួយ ដោយចៃដន្យ' },
  { id: 'ff-25', productId: 'p-ff', name: '25 Diamonds', amount: 25, price: 0.29, category: 'NORMAL', isActive: true, badge: 'សាកល្បង' },
  { id: 'ff-100', productId: 'p-ff', name: '100 Diamonds', amount: 100, price: 0.97, category: 'NORMAL', isActive: true, badge: null },
  { id: 'ff-310', productId: 'p-ff', name: '310 Diamonds', amount: 310, price: 2.63, category: 'NORMAL', isActive: true, badge: null },
  { id: 'ff-520', productId: 'p-ff', name: '520 Diamonds', amount: 520, price: 4.15, category: 'NORMAL', isActive: true, badge: 'ពេញនិយម' },
  { id: 'ff-1060', productId: 'p-ff', name: '1060 Diamonds', amount: 1060, price: 8.40, category: 'NORMAL', isActive: true, badge: 'Bonus Event 🔥' },
  { id: 'ff-2180', productId: 'p-ff', name: '2180 Diamonds', amount: 2180, price: 16.49, category: 'NORMAL', isActive: true, badge: null },
  { id: 'ff-5600', productId: 'p-ff', name: '5600 Diamonds', amount: 5600, price: 43.55, category: 'NORMAL', isActive: true, badge: null },
  { id: 'ff-11500', productId: 'p-ff', name: '11500 Diamonds', amount: 11500, price: 88.55, category: 'NORMAL', isActive: true, badge: 'កញ្ចប់ពិសេស 💎' },
  { id: 'ff-weekly-lite', productId: 'p-ff', name: 'WeeklyLite', amount: 100, price: 0.45, category: 'NORMAL', isActive: true, badge: 'ទទួលបាន 20 💎 ភ្លាមៗ' },
  { id: 'ff-weekly', productId: 'p-ff', name: 'Weekly', amount: 250, price: 1.67, category: 'NORMAL', isActive: true, badge: 'ទទួលបាន 200 💎 ភ្លាមៗ' },
  { id: 'ff-monthly', productId: 'p-ff', name: 'Monthly', amount: 1200, price: 7.60, category: 'NORMAL', isActive: true, badge: 'ទទួលបាន 1000 💎 ភ្លាមៗ' },
];

export const FALLBACK_PRODUCTS: GameProduct[] = [
  { id: 'p-mlbb-kh', name: 'MOBILE LEGENDS | KHMER', slug: 'mobile-legends-khmer', image: '/images/games/mlbb.png', category: 'MOBILE_GAME', isActive: true, packages: MLBB_PACKAGES },
  { id: 'p-mlbb-ph', name: 'MOBILE LEGENDS | PHILIPPINES', slug: 'mobile-legends-philippines', image: '/images/games/mlbb.png', category: 'MOBILE_GAME', isActive: true, packages: MLBB_PACKAGES },
  { id: 'p-mlbb-id', name: 'MOBILE LEGENDS | INDONESIA', slug: 'mobile-legends-indonesia', image: '/images/games/mlbb.png', category: 'MOBILE_GAME', isActive: true, packages: MLBB_PACKAGES },
  { id: 'p-ff-kh', name: 'FREE FIRE | KHMER', slug: 'free-fire-khmer', image: '/images/games/freefire.png', category: 'MOBILE_GAME', isActive: true, packages: FF_PACKAGES },
  { id: 'p-ff-id', name: 'FREE FIRE | INDONESIA', slug: 'free-fire-indonesia', image: '/images/games/freefire.png', category: 'MOBILE_GAME', isActive: true, packages: FF_PACKAGES },
  { id: 'p-ff-vn', name: 'FREE FIRE | VIETNAM', slug: 'free-fire-vietnam', image: '/images/games/freefire.png', category: 'MOBILE_GAME', isActive: true, packages: FF_PACKAGES },
  { id: 'p-ff-tw', name: 'FREE FIRE | TAIWAN', slug: 'free-fire-taiwan', image: '/images/games/freefire.png', category: 'MOBILE_GAME', isActive: true, packages: FF_PACKAGES },
  {
    id: 'p-magic-chess', name: 'MAGIC CHESS GOGO', slug: 'magic-chess-gogo', image: '/images/games/magicchess.png', category: 'MOBILE_GAME', isActive: true,
    packages: [
      { id: 'mc-1', productId: 'p-magic-chess', name: 'Evo3D Magic Chess', amount: 50, price: 0.83, category: 'BEST_SELLER', isActive: true, badge: null },
      { id: 'mc-2', productId: 'p-magic-chess', name: '100 Gold Coins', amount: 100, price: 0.99, category: 'NORMAL', isActive: true, badge: null },
      { id: 'mc-3', productId: 'p-magic-chess', name: '500 Gold Coins', amount: 500, price: 4.50, category: 'NORMAL', isActive: true, badge: 'ពេញនិយម' },
    ]
  },
  {
    id: 'p-hok', name: 'HONOR OF KINGS', slug: 'honor-of-kings', image: '/images/games/hok.png', category: 'MOBILE_GAME', isActive: true,
    packages: [
      { id: 'hok-1', productId: 'p-hok', name: '88 Tokens', amount: 88, price: 0.99, category: 'BEST_SELLER', isActive: true, badge: null },
      { id: 'hok-2', productId: 'p-hok', name: '432 Tokens', amount: 432, price: 4.99, category: 'BEST_SELLER', isActive: true, badge: 'ពេញនិយម' },
      { id: 'hok-3', productId: 'p-hok', name: '905 Tokens', amount: 905, price: 9.99, category: 'NORMAL', isActive: true, badge: null },
      { id: 'hok-4', productId: 'p-hok', name: '2475 Tokens', amount: 2475, price: 24.99, category: 'NORMAL', isActive: true, badge: 'ពេញនិយម' },
      { id: 'hok-5', productId: 'p-hok', name: '4950 Tokens', amount: 4950, price: 49.99, category: 'NORMAL', isActive: true, badge: null },
      { id: 'hok-6', productId: 'p-hok', name: '10000 Tokens', amount: 10000, price: 99.99, category: 'NORMAL', isActive: true, badge: 'កញ្ចប់ពិសេស 💎' },
    ]
  },
  {
    id: 'p-pubg', name: 'PUBG MOBILE', slug: 'pubg-mobile', image: '/images/games/pubgm.png', category: 'MOBILE_GAME', isActive: true,
    packages: [
      { id: 'pubg-1', productId: 'p-pubg', name: '60 UC', amount: 60, price: 0.99, category: 'BEST_SELLER', isActive: true, badge: null },
      { id: 'pubg-2', productId: 'p-pubg', name: '325 UC', amount: 325, price: 4.99, category: 'BEST_SELLER', isActive: true, badge: 'ពេញនិយម' },
      { id: 'pubg-3', productId: 'p-pubg', name: '660 UC', amount: 660, price: 9.99, category: 'NORMAL', isActive: true, badge: null },
      { id: 'pubg-4', productId: 'p-pubg', name: '1800 UC', amount: 1800, price: 24.99, category: 'NORMAL', isActive: true, badge: 'ពេញនិយម' },
      { id: 'pubg-5', productId: 'p-pubg', name: '3850 UC', amount: 3850, price: 49.99, category: 'NORMAL', isActive: true, badge: null },
      { id: 'pubg-6', productId: 'p-pubg', name: '8100 UC', amount: 8100, price: 99.99, category: 'NORMAL', isActive: true, badge: 'កញ្ចប់ពិសេស 💎' },
    ]
  },
  {
    id: 'p-bloodstrike', name: 'BLOOD STRIKE', slug: 'blood-strike', image: '/images/games/bloodstrike.png', category: 'MOBILE_GAME', isActive: true,
    packages: [
      { id: 'bs-1', productId: 'p-bloodstrike', name: '100 Gold', amount: 100, price: 0.99, category: 'BEST_SELLER', isActive: true, badge: null },
      { id: 'bs-2', productId: 'p-bloodstrike', name: '500 Gold', amount: 500, price: 4.99, category: 'BEST_SELLER', isActive: true, badge: 'ពេញនិយម' },
      { id: 'bs-3', productId: 'p-bloodstrike', name: '1000 Gold', amount: 1000, price: 9.99, category: 'NORMAL', isActive: true, badge: null },
      { id: 'bs-4', productId: 'p-bloodstrike', name: '2500 Gold', amount: 2500, price: 24.99, category: 'NORMAL', isActive: true, badge: 'ពេញនិយម' },
      { id: 'bs-5', productId: 'p-bloodstrike', name: '5000 Gold', amount: 5000, price: 49.99, category: 'NORMAL', isActive: true, badge: null },
      { id: 'bs-6', productId: 'p-bloodstrike', name: '10000 Gold', amount: 10000, price: 99.99, category: 'NORMAL', isActive: true, badge: 'កញ្ចប់ពិសេស 💎' },
    ]
  },
  {
    id: 'p-valorant', name: 'VALORANT', slug: 'valorant', image: '/images/games/valorant.png', category: 'PC_GAME', isActive: true,
    packages: [
      { id: 'val-1', productId: 'p-valorant', name: '475 VP', amount: 475, price: 4.99, category: 'BEST_SELLER', isActive: true, badge: null },
      { id: 'val-2', productId: 'p-valorant', name: '1000 VP', amount: 1000, price: 9.99, category: 'BEST_SELLER', isActive: true, badge: 'ពេញនិយម' },
      { id: 'val-3', productId: 'p-valorant', name: '2050 VP', amount: 2050, price: 19.99, category: 'NORMAL', isActive: true, badge: null },
      { id: 'val-4', productId: 'p-valorant', name: '3650 VP', amount: 3650, price: 34.99, category: 'NORMAL', isActive: true, badge: 'ពេញនិយម' },
      { id: 'val-5', productId: 'p-valorant', name: '5350 VP', amount: 5350, price: 49.99, category: 'NORMAL', isActive: true, badge: null },
      { id: 'val-6', productId: 'p-valorant', name: '11000 VP', amount: 11000, price: 99.99, category: 'NORMAL', isActive: true, badge: 'កញ្ចប់ពិសេស 💎' },
    ]
  },
  {
    id: 'p-farlight', name: 'FARLIGHT 84', slug: 'farlight-84', image: '/images/games/farlight.png', category: 'MOBILE_GAME', isActive: true,
    packages: [
      { id: 'fl-1', productId: 'p-farlight', name: '60 Diamonds', amount: 60, price: 0.99, category: 'BEST_SELLER', isActive: true, badge: null },
      { id: 'fl-2', productId: 'p-farlight', name: '330 Diamonds', amount: 330, price: 4.99, category: 'BEST_SELLER', isActive: true, badge: 'ពេញនិយម' },
      { id: 'fl-3', productId: 'p-farlight', name: '720 Diamonds', amount: 720, price: 9.99, category: 'NORMAL', isActive: true, badge: null },
      { id: 'fl-4', productId: 'p-farlight', name: '2200 Diamonds', amount: 2200, price: 29.99, category: 'NORMAL', isActive: true, badge: 'ពេញនិយម' },
      { id: 'fl-5', productId: 'p-farlight', name: '3800 Diamonds', amount: 3800, price: 49.99, category: 'NORMAL', isActive: true, badge: null },
    ]
  },
  {
    id: 'p-deltaforce', name: 'DELTA FORCE', slug: 'delta-force', image: '/images/games/deltaforce.png', category: 'PC_GAME', isActive: true,
    packages: [
      { id: 'df-1', productId: 'p-deltaforce', name: '60 Coins', amount: 60, price: 0.99, category: 'BEST_SELLER', isActive: true, badge: null },
      { id: 'df-2', productId: 'p-deltaforce', name: '330 Coins', amount: 330, price: 4.99, category: 'BEST_SELLER', isActive: true, badge: 'ពេញនិយម' },
      { id: 'df-3', productId: 'p-deltaforce', name: '720 Coins', amount: 720, price: 9.99, category: 'NORMAL', isActive: true, badge: null },
      { id: 'df-4', productId: 'p-deltaforce', name: '2200 Coins', amount: 2200, price: 29.99, category: 'NORMAL', isActive: true, badge: 'ពេញនិយម' },
      { id: 'df-5', productId: 'p-deltaforce', name: '3800 Coins', amount: 3800, price: 49.99, category: 'NORMAL', isActive: true, badge: null },
    ]
  }
];
