import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import BirdWiki from '../models/BirdWiki.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    BirdWiki.deleteMany({}),
    Review.deleteMany({}),
    Order.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // Users
  const admin = await User.create({ name: 'অ্যাডমিন', email: 'admin@skaviary.com', password: 'admin123', role: 'admin' });
  const user = await User.create({ name: 'রহিম উদ্দিন', email: 'rahim@example.com', password: 'user123', role: 'user' });

  // Product categories
  const catBirds = await Category.create({ name: 'জীবন্ত পাখি', slug: 'live-birds', description: 'বিশ্বস্ত ব্রিডারদের কাছ থেকে সুন্দর ও সুস্থ পাখি', image: '/uploads/category-birds.jpg', type: 'product' });
  const catFood = await Category.create({ name: 'পাখির খাবার', slug: 'bird-food', description: 'সব প্রজাতির জন্য প্রিমিয়াম পুষ্টিকর খাবার', image: '/uploads/category-food.jpg', type: 'product' });
  const catMedicine = await Category.create({ name: 'পাখির ওষুধ', slug: 'bird-medicine', description: 'স্বাস্থ্য সাপ্লিমেন্ট ও পশু চিকিৎসা পণ্য', image: '/uploads/category-medicine.jpg', type: 'product' });
  const catCages = await Category.create({ name: 'খাঁচা ও আনুষাঙ্গিক', slug: 'cages-accessories', description: 'প্রশস্ত খাঁচা, পার্চ, খেলনা এবং আরও অনেক কিছু', image: '/uploads/category-cages.jpg', type: 'product' });

  // Wiki categories
  const catParrots = await Category.create({ name: 'টিয়া পাখি', slug: 'parrots', description: 'রঙিন ও বুদ্ধিমান টিয়া প্রজাতি', image: '/uploads/wiki-parrots.jpg', type: 'wiki' });
  const catFinches = await Category.create({ name: 'ফিঞ্চ', slug: 'finches', description: 'ছোট, সুরেলা গানের পাখি', image: '/uploads/wiki-finches.jpg', type: 'wiki' });
  const catLocal = await Category.create({ name: 'দেশীয় পাখি', slug: 'local-birds', description: 'বাংলাদেশের স্থানীয় পাখি প্রজাতি', image: '/uploads/wiki-local.jpg', type: 'wiki' });

  // Products (prices in BDT)
  const products = await Product.insertMany([
    {
      name: 'বাজরিগার (সবুজ)', slug: 'budgerigar-green',
      description: 'অস্ট্রেলিয়ান বাজরিগার, সুন্দর সবুজ রঙের। হাতে পোষা, বাচ্চাদের জন্য আদর্শ। কথা বলতে শেখানো যায়। সুস্থ ও চঞ্চল পাখি।',
      price: 800, discount_price: 650, stock: 15, category: catBirds._id,
      images: ['/uploads/budgie-green-1.jpg'],
      features: ['হাতে পোষা', 'কথা শেখার ক্ষমতা', '৩-৫ মাস বয়স', 'সুস্থতার নিশ্চয়তা', 'জোড়ায় পাওয়া যায়'],
      is_featured: true,
    },
    {
      name: 'ককাটিয়েল - লুটিনো', slug: 'cockatiel-lutino',
      description: 'সুন্দর হলুদ-সাদা রঙের ককাটিয়েল। গালে কমলা রঙের ছোপ। শিস দিতে পারে এবং সুরেলা গান করে। প্রথমবার পাখি পালনকারীদের জন্য উপযুক্ত।',
      price: 5500, stock: 6, category: catBirds._id,
      images: ['/uploads/cockatiel-1.jpg'],
      features: ['বন্ধুত্বপূর্ণ স্বভাব', 'নতুনদের জন্য আদর্শ', '৪-৬ মাস বয়স', 'হাতে খাওয়ানো', 'সুস্থতার গ্যারান্টি'],
      is_featured: true,
    },
    {
      name: 'লাভবার্ড - ফিশার', slug: 'lovebird-fischer',
      description: 'রঙিন ফিশার লাভবার্ড। সবুজ শরীর, কমলা মুখ, নীল লেজ। জোড়ায় রাখলে অসাধারণ দেখায়। খুবই চঞ্চল ও মজার পাখি।',
      price: 3500, discount_price: 3000, stock: 10, category: catBirds._id,
      images: ['/uploads/lovebird-1.jpg'],
      features: ['রঙিন পালক', 'জোড়ায় আদর্শ', '৩-৫ মাস বয়স', 'সুস্থ ও সচল', 'ব্রিডিং জোড়া পাওয়া যায়'],
      is_featured: true,
    },
    {
      name: 'ইন্ডিয়ান রিংনেক - সবুজ', slug: 'indian-ringneck-green',
      description: 'অসাধারণ সবুজ রঙের ইন্ডিয়ান রিংনেক। কথা বলার দারুণ ক্ষমতা। বুদ্ধিমান ও খেলাপ্রিয়। দীর্ঘদিনের সঙ্গী হতে পারে।',
      price: 15000, discount_price: 12000, stock: 4, category: catBirds._id,
      images: ['/uploads/ringneck-1.jpg'],
      features: ['দারুণ কথা বলে', 'হাতে পোষা', '৮-১২ মাস বয়স', 'স্বাস্থ্য পরীক্ষিত', 'DNA সেক্সড'],
      is_featured: true,
    },
    {
      name: 'প্রিমিয়াম বীজ মিক্স - টিয়া ব্লেন্ড', slug: 'premium-seed-mix-parrot',
      description: 'সূর্যমুখী বীজ, কুমড়ার বীজ, চিনাবাদাম ও শুকনো ফলের মিশ্রণ। ভিটামিন ও মিনারেল সমৃদ্ধ। কোনো কৃত্রিম প্রিজারভেটিভ নেই।',
      price: 350, discount_price: 280, stock: 50, category: catFood._id,
      images: ['/uploads/seed-mix-1.jpg'],
      features: ['১ কেজি প্যাকেট', 'প্রাকৃতিক উপাদান', 'ভিটামিন সমৃদ্ধ', 'প্রিজারভেটিভ মুক্ত', 'সব টিয়ার জন্য উপযুক্ত'],
      is_featured: true,
    },
    {
      name: 'মিলেট স্প্রে - ফিঞ্চ ও বাজরিগার', slug: 'millet-spray-finch',
      description: 'প্রাকৃতিক মিলেট স্প্রে, ফিঞ্চ ও বাজরিগারের প্রিয় খাবার। পুষ্টিকর ও সুস্বাদু। পাখির মানসিক স্বাস্থ্যের জন্যও উপকারী।',
      price: 150, stock: 80, category: catFood._id,
      images: ['/uploads/millet-1.jpg'],
      features: ['৫টি স্প্রে/প্যাকেট', 'সম্পূর্ণ প্রাকৃতিক', 'পুষ্টিকর', 'পাখির প্রিয়', 'ফরেজিং এর জন্য আদর্শ'],
    },
    {
      name: 'ভিটামিন ড্রপস - সব পাখির জন্য', slug: 'vitamin-drops-all-birds',
      description: 'সব ধরনের পোষা পাখির জন্য তরল মাল্টিভিটামিন। পানিতে মিশিয়ে খাওয়ান। রোগ প্রতিরোধ ক্ষমতা, পালকের মান ও সার্বিক স্বাস্থ্যের উন্নতি করে।',
      price: 250, stock: 40, category: catMedicine._id,
      images: ['/uploads/vitamins-1.jpg'],
      features: ['৩০ মিলি বোতল', 'পানিতে দ্রবণীয়', 'সব প্রজাতির জন্য', 'পশু চিকিৎসক অনুমোদিত', '৩ মাসের সাপ্লাই'],
    },
    {
      name: 'অ্যান্টি-মাইট স্প্রে', slug: 'anti-mite-spray',
      description: 'পালকের মাইট ও উকুনের দ্রুত চিকিৎসা। পাখি ও খাঁচায় সরাসরি ব্যবহার করা যায়। অবিষাক্ত ফর্মুলা।',
      price: 180, discount_price: 150, stock: 30, category: catMedicine._id,
      images: ['/uploads/anti-mite-1.jpg'],
      features: ['২৫০ মিলি স্প্রে বোতল', 'অবিষাক্ত', 'দ্রুত কার্যকর', 'সব পাখির জন্য নিরাপদ', 'খাঁচা ও পাখি উভয়ে ব্যবহারযোগ্য'],
    },
    {
      name: 'ডিলাক্স ফ্লাইট কেজ - বড়', slug: 'deluxe-flight-cage-large',
      description: 'প্রশস্ত লোহার খাঁচা। বাজরিগার, ককাটিয়েল ও ছোট টিয়ার জন্য আদর্শ। একাধিক দরজা, খাবার পাত্র ও পার্চ সহ।',
      price: 4500, discount_price: 3800, stock: 8, category: catCages._id,
      images: ['/uploads/cage-large-1.jpg'],
      features: ['৭৬x৪৬x৯২ সেমি', 'মজবুত লোহা', 'খুলনযোগ্য ট্রে', 'পার্চ অন্তর্ভুক্ত', 'সহজ সমাবেশ', 'পাউডার কোটেড'],
      is_featured: true,
    },
    {
      name: 'প্রাকৃতিক কাঠের পার্চ সেট', slug: 'natural-wood-perch-set',
      description: '৩টি বিভিন্ন মাপের প্রাকৃতিক কাঠের পার্চ। পাখির পায়ের স্বাস্থ্যের জন্য উপকারী। সহজে লাগানো যায়।',
      price: 350, stock: 25, category: catCages._id,
      images: ['/uploads/perch-set-1.jpg'],
      features: ['৩টির সেট', 'প্রাকৃতিক কাঠ', 'বিভিন্ন মাপ', 'সহজে ইনস্টল', 'পাখির জন্য নিরাপদ'],
    },
    {
      name: 'ফরেজিং টয় - মাঝারি পাখির জন্য', slug: 'foraging-toy-medium',
      description: 'মানসিক উদ্দীপনার জন্য ফরেজিং খেলনা। ট্রিট ভরে দিন, পাখি নিজে বের করবে। অ্যাক্রিলিক ও স্টেইনলেস স্টিলের তৈরি।',
      price: 280, discount_price: 220, stock: 20, category: catCages._id,
      images: ['/uploads/foraging-toy-1.jpg'],
      features: ['টেকসই অ্যাক্রিলিক', 'মানসিক উদ্দীপনা', 'সহজে রিফিল', 'স্টেইনলেস স্টিল হার্ডওয়্যার', 'মাঝারি পাখির জন্য'],
    },
  ]);

  // Bird Wiki - Bangladesh birds
  await BirdWiki.insertMany([
    {
      name: 'বাজরিগার', slug: 'budgerigar', scientific_name: 'Melopsittacus undulatus',
      description: 'বাজরিগার বাংলাদেশের সবচেয়ে জনপ্রিয় পোষা পাখি। ছোট আকৃতির এই টিয়া পাখি অস্ট্রেলিয়ার স্থানীয় প্রজাতি। এরা অত্যন্ত বন্ধুত্বপূর্ণ এবং মানুষের কথা নকল করতে পারে। বাংলাদেশে এদের বিভিন্ন রঙের মিউটেশন পাওয়া যায়।',
      habitat: 'অস্ট্রেলিয়ার শুষ্ক ও আধা-শুষ্ক অঞ্চল। বাংলাদেশে পোষা পাখি হিসেবে পালিত হয়।',
      diet: 'প্রধানত বীজ খায়। বন্দী অবস্থায় বীজ মিক্স, তাজা শাকসবজি ও পেলেট খাওয়ানো হয়।',
      lifespan: 'বন্দী অবস্থায় ১০-১৫ বছর', conservation_status: 'ন্যূনতম উদ্বেগ',
      images: ['/uploads/wiki-budgie-1.jpg'], category: catParrots._id,
      fun_facts: ['১৭০০টি পর্যন্ত শব্দ শিখতে পারে', 'মাথা ১৮০ ডিগ্রি ঘোরাতে পারে', 'বন্য বাজরিগার সবসময় সবুজ ও হলুদ হয়', 'বিশ্বের তৃতীয় সর্বাধিক জনপ্রিয় পোষা প্রাণী'],
    },
    {
      name: 'দোয়েল', slug: 'doyel', scientific_name: 'Copsychus saularis',
      description: 'দোয়েল বাংলাদেশের জাতীয় পাখি। কালো ও সাদা রঙের এই সুন্দর পাখি তার মিষ্টি গানের জন্য বিখ্যাত। সারা বাংলাদেশে দেখা যায়। ভোরবেলা ও সন্ধ্যায় এদের গান শোনা যায়।',
      habitat: 'বাংলাদেশের সর্বত্র - বাগান, গ্রাম, শহরের পার্ক। দক্ষিণ ও দক্ষিণ-পূর্ব এশিয়ায় পাওয়া যায়।',
      diet: 'পোকামাকড়, কেঁচো, ছোট ফল ও বেরি খায়।',
      lifespan: 'বন্য অবস্থায় ৮-১২ বছর', conservation_status: 'ন্যূনতম উদ্বেগ',
      images: ['/uploads/wiki-doyel-1.jpg'], category: catLocal._id,
      fun_facts: ['বাংলাদেশের জাতীয় পাখি', 'পুরুষ পাখি গান গেয়ে স্ত্রী পাখিকে আকৃষ্ট করে', 'এরা নিজের এলাকা রক্ষায় খুব সাহসী', 'ভোরের আলোতে সবার আগে গান শুরু করে'],
    },
    {
      name: 'শালিক', slug: 'shalik', scientific_name: 'Acridotheres tristis',
      description: 'ভাত শালিক বাংলাদেশের সবচেয়ে পরিচিত পাখিগুলোর একটি। বাদামি রঙের এই পাখি শহর ও গ্রাম সর্বত্র দেখা যায়। দলবদ্ধভাবে থাকতে পছন্দ করে এবং বিভিন্ন ধরনের শব্দ নকল করতে পারে।',
      habitat: 'বাংলাদেশের সর্বত্র - শহর, গ্রাম, কৃষিজমি। দক্ষিণ এশিয়ায় ব্যাপকভাবে বিস্তৃত।',
      diet: 'সর্বভুক - পোকামাকড়, ফল, শস্যদানা, রান্নাঘরের উচ্ছিষ্ট সব খায়।',
      lifespan: 'বন্য অবস্থায় ৪-১২ বছর', conservation_status: 'ন্যূনতম উদ্বেগ',
      images: ['/uploads/wiki-shalik-1.jpg'], category: catLocal._id,
      fun_facts: ['মানুষের কথা নকল করতে পারে', 'এরা খুবই সামাজিক পাখি', 'অনেক দেশে এদের আক্রমণাত্মক প্রজাতি হিসেবে গণ্য করা হয়', 'জোড়ায় সারাজীবন একসাথে থাকে'],
    },
    {
      name: 'টিয়া (চন্দনা)', slug: 'rose-ringed-parakeet', scientific_name: 'Psittacula krameri',
      description: 'চন্দনা টিয়া বাংলাদেশের সবচেয়ে পরিচিত টিয়া পাখি। উজ্জ্বল সবুজ রঙের এই পাখি কথা বলতে পারে। পুরুষ পাখির গলায় গোলাপি-কালো রিং থাকে। গ্রামাঞ্চলে এদের প্রচুর দেখা যায়।',
      habitat: 'বাংলাদেশের বন, বাগান, কৃষিজমি। ভারত, পাকিস্তান ও আফ্রিকায়ও পাওয়া যায়।',
      diet: 'ফল, বীজ, ফুলের মধু, শস্যদানা। আম ও পেয়ারা পছন্দ করে।',
      lifespan: 'বন্দী অবস্থায় ২৫-৩০ বছর', conservation_status: 'ন্যূনতম উদ্বেগ',
      images: ['/uploads/wiki-tia-1.jpg'], category: catParrots._id,
      fun_facts: ['৫০০টির বেশি শব্দ শিখতে পারে', 'বাংলাদেশের গ্রামে এদের "টিয়া" বলে ডাকা হয়', 'আলেকজান্ডার দ্য গ্রেটের সময় থেকে পোষা পাখি হিসেবে পালিত', 'পুরুষ পাখির গলার রিং ২-৩ বছর বয়সে দেখা যায়'],
    },
    {
      name: 'মাছরাঙা', slug: 'machhranga', scientific_name: 'Alcedo atthis',
      description: 'মাছরাঙা বাংলাদেশের অন্যতম সুন্দর পাখি। নীল-কমলা রঙের এই পাখি পানির উপর দ্রুত উড়ে গিয়ে মাছ ধরতে পারদর্শী। নদী, পুকুর ও জলাশয়ের ধারে দেখা যায়।',
      habitat: 'বাংলাদেশের নদী, পুকুর, খাল, বিল ও জলাশয়ের পাশে। ইউরোপ ও এশিয়ায় পাওয়া যায়।',
      diet: 'প্রধানত ছোট মাছ। এছাড়া ব্যাঙাচি, জলজ পোকা ও ছোট চিংড়িও খায়।',
      lifespan: 'বন্য অবস্থায় ৬-১০ বছর', conservation_status: 'ন্যূনতম উদ্বেগ',
      images: ['/uploads/wiki-kingfisher-1.jpg'], category: catLocal._id,
      fun_facts: ['পানিতে ডুব দিয়ে মাছ ধরে', 'ঘণ্টায় ৪০ কিমি বেগে উড়তে পারে', 'জাপানের বুলেট ট্রেনের নকশা মাছরাঙার ঠোঁট থেকে অনুপ্রাণিত', 'এক জায়গায় স্থির থেকে হভার করতে পারে'],
    },
    {
      name: 'ময়না', slug: 'moyna', scientific_name: 'Gracula religiosa',
      description: 'পাহাড়ি ময়না বাংলাদেশের সিলেট ও চট্টগ্রামের পাহাড়ি বনে পাওয়া যায়। এরা মানুষের কথা অত্যন্ত পরিষ্কারভাবে নকল করতে পারে। কালো রঙের এই পাখির গলায় হলুদ ঝুলন্ত চামড়া থাকে।',
      habitat: 'বাংলাদেশের সিলেট ও চট্টগ্রাম বিভাগের চিরসবুজ বন। দক্ষিণ-পূর্ব এশিয়ায় পাওয়া যায়।',
      diet: 'ফল, বেরি, পোকামাকড় ও ফুলের মধু।',
      lifespan: 'বন্দী অবস্থায় ১৫-২৫ বছর', conservation_status: 'ন্যূনতম উদ্বেগ',
      images: ['/uploads/wiki-moyna-1.jpg'], category: catLocal._id,
      fun_facts: ['পৃথিবীর সেরা কথা বলা পাখিদের একটি', 'মানুষের কণ্ঠস্বরের আবেগও নকল করতে পারে', 'বাংলাদেশে এদের সংখ্যা কমে যাচ্ছে', 'এক সময় রাজা-বাদশাহদের দরবারে রাখা হতো'],
    },
    {
      name: 'লাভবার্ড', slug: 'lovebird', scientific_name: 'Agapornis spp.',
      description: 'লাভবার্ড আফ্রিকার স্থানীয় ছোট আকৃতির টিয়া পাখি। এরা সবসময় জোড়ায় থাকে বলে এদের "ভালোবাসার পাখি" বলা হয়। বাংলাদেশে পোষা পাখি হিসেবে খুবই জনপ্রিয়।',
      habitat: 'আফ্রিকার বন ও তৃণভূমি। বাংলাদেশে পোষা পাখি হিসেবে পালিত।',
      diet: 'বীজ, ফল, শাকসবজি ও ফুলের কুঁড়ি।',
      lifespan: 'বন্দী অবস্থায় ১০-১৫ বছর', conservation_status: 'ন্যূনতম উদ্বেগ',
      images: ['/uploads/wiki-lovebird-1.jpg'], category: catParrots._id,
      fun_facts: ['সবসময় জোড়ায় থাকে', 'সঙ্গী মারা গেলে বিষণ্ণ হয়ে পড়ে', '৯ প্রজাতির লাভবার্ড আছে', 'একে অপরের পালক পরিষ্কার করে ভালোবাসা প্রকাশ করে'],
    },
    {
      name: 'বুলবুলি', slug: 'bulbuli', scientific_name: 'Pycnonotus cafer',
      description: 'বুলবুলি বাংলাদেশের অত্যন্ত পরিচিত গানের পাখি। মাথায় কালো টুপি ও লেজের নিচে লাল রঙ এদের বিশেষ বৈশিষ্ট্য। এরা সুমিষ্ট গান করে এবং বাগানে প্রায়ই দেখা যায়।',
      habitat: 'বাংলাদেশের সর্বত্র - বাগান, ঝোপঝাড়, শহরের গাছপালায়। দক্ষিণ এশিয়ায় বিস্তৃত।',
      diet: 'ফল, বেরি, পোকামাকড় ও ফুলের মধু।',
      lifespan: 'বন্য অবস্থায় ৫-১১ বছর', conservation_status: 'ন্যূনতম উদ্বেগ',
      images: ['/uploads/wiki-bulbuli-1.jpg'], category: catFinches._id,
      fun_facts: ['বাংলা সাহিত্যে "বুলবুলি" নামে বহুল উল্লেখিত', 'ভোরবেলা সবচেয়ে সুন্দর গান গায়', 'পাকা পেঁপে ও কলা খুব পছন্দ করে', 'ফসলের পোকা খেয়ে কৃষকদের উপকার করে'],
    },
  ]);

  // Sample reviews in Bangla
  await Review.insertMany([
    { user: user._id, product: products[0]._id, rating: 5, comment: 'অসাধারণ পাখি! খুব সুন্দর ও সুস্থ। ইতিমধ্যে কথা বলতে শুরু করেছে।' },
    { user: user._id, product: products[1]._id, rating: 4, comment: 'চমৎকার ককাটিয়েল। প্রথমে একটু লাজুক ছিল কিন্তু দ্রুতই বন্ধুত্বপূর্ণ হয়ে গেছে।' },
    { user: user._id, product: products[4]._id, rating: 5, comment: 'আমার পাখি এই বীজ মিক্স খুব পছন্দ করেছে। দারুণ কোয়ালিটি!' },
    { user: user._id, product: products[8]._id, rating: 5, comment: 'চমৎকার খাঁচা - মজবুত, প্রশস্ত এবং পরিষ্কার করা সহজ।' },
  ]);

  // Sample order
  await Order.create({
    user: user._id,
    items: [
      { product: products[4]._id, name: 'প্রিমিয়াম বীজ মিক্স', quantity: 2, price: 280 },
      { product: products[9]._id, name: 'প্রাকৃতিক কাঠের পার্চ সেট', quantity: 1, price: 350 },
    ],
    total: 910, status: 'delivered',
    shipping_address: { name: 'রহিম উদ্দিন', phone: '01712345678', street: 'শাহ মখদুম এভিনিউ', city: 'রাজশাহী', district: 'রাজশাহী', zip: '6000' },
    payment: { method: 'bkash', bkash_number: '01318558415', transaction_id: 'TXN8A2K4M9', amount: 910, verified: true },
  });

  console.log('✅ ডাটাবেস সফলভাবে সিড করা হয়েছে!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
