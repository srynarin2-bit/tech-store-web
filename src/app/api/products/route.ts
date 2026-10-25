import { NextResponse } from 'next/server';

let dynamicProducts = [
  // --- 20 PHONES ---
  { id: 'p1', name: 'iPhone 15 Pro Max 1TB', category: 'Phone', price: 1599.00, description: 'Titanium design, A17 Pro chip, 5x Telephoto camera.', imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80' },
  { id: 'p2', name: 'iPhone 15 Pro 512GB', category: 'Phone', price: 1299.00, description: 'Advanced A17 Pro performance with professional triple camera.', imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80' },
  { id: 'p3', name: 'iPhone 15 Plus 256GB', category: 'Phone', price: 999.00, description: 'Dynamic Island, 48MP camera, and all-day battery life.', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80' },
  { id: 'p4', name: 'iPhone 15 128GB', category: 'Phone', price: 799.00, description: 'Sleek aluminum design with USB-C and Super Retina XDR display.', imageUrl: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&auto=format&fit=crop&q=80' },
  { id: 'p5', name: 'iPhone 14 Pro Max 256GB', category: 'Phone', price: 1099.00, description: 'A16 Bionic chip, Always-On display, and 48MP main camera.', imageUrl: 'https://images.unsplash.com/photo-1530319067432-f2a729c03db5?w=500&auto=format&fit=crop&q=80' },
  { id: 'p6', name: 'iPhone 14 Pro 128GB', category: 'Phone', price: 999.00, description: 'Dynamic Island and ProMotion technology in compact form.', imageUrl: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=500&auto=format&fit=crop&q=80' },
  { id: 'p7', name: 'iPhone 14 Plus 128GB', category: 'Phone', price: 849.00, description: 'Larger 6.7-inch display with dependable dual-camera system.', imageUrl: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&auto=format&fit=crop&q=80' },
  { id: 'p8', name: 'iPhone 14 128GB', category: 'Phone', price: 699.00, description: 'Reliable performance with Crash Detection and cinematic mode.', imageUrl: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&auto=format&fit=crop&q=80' },
  { id: 'p9', name: 'iPhone 13 Pro Max 256GB', category: 'Phone', price: 899.00, description: 'Pro camera system with macro photography and 120Hz display.', imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&auto=format&fit=crop&q=80' },
  { id: 'p10', name: 'iPhone 13 Pro 128GB', category: 'Phone', price: 799.00, description: 'A15 Bionic chip with 5-core GPU for high-speed graphics.', imageUrl: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&auto=format&fit=crop&q=80' },
  { id: 'p11', name: 'iPhone 13 128GB', category: 'Phone', price: 599.00, description: 'Brighter OLED display and cinematic video recording.', imageUrl: 'https://images.unsplash.com/photo-1533750349077-cdbb1ee4a753?w=500&auto=format&fit=crop&q=80' },
  { id: 'p12', name: 'iPhone 13 mini 128GB', category: 'Phone', price: 529.00, description: 'Pocket-friendly 5.4-inch design with uncompromised speed.', imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80' },
  { id: 'p13', name: 'iPhone 12 Pro Max 256GB', category: 'Phone', price: 749.00, description: 'Ceramic Shield front cover with LiDAR scanner.', imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80' },
  { id: 'p14', name: 'iPhone 12 Pro 128GB', category: 'Phone', price: 679.00, description: 'Stainless steel frame and professional dual-lens setup.', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80' },
  { id: 'p15', name: 'iPhone 12 128GB', category: 'Phone', price: 499.00, description: '5G speed and A14 Bionic processor in a sleek body.', imageUrl: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&auto=format&fit=crop&q=80' },
  { id: 'p16', name: 'iPhone 12 mini 64GB', category: 'Phone', price: 429.00, description: 'Compact size with full 5G capability and OLED screen.', imageUrl: 'https://images.unsplash.com/photo-1530319067432-f2a729c03db5?w=500&auto=format&fit=crop&q=80' },
  { id: 'p17', name: 'iPhone 11 Pro Max 256GB', category: 'Phone', price: 599.00, description: 'Triple-camera system with Night mode and robust glass back.', imageUrl: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=500&auto=format&fit=crop&q=80' },
  { id: 'p18', name: 'iPhone 11 128GB', category: 'Phone', price: 399.00, description: 'Liquid Retina LCD display and reliable dual cameras.', imageUrl: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&auto=format&fit=crop&q=80' },
  { id: 'p19', name: 'iPhone SE (3rd Gen) 128GB', category: 'Phone', price: 429.00, description: 'Classic Home button design powered by the A15 Bionic chip.', imageUrl: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&auto=format&fit=crop&q=80' },
  { id: 'p20', name: 'iPhone 14 256GB', category: 'Phone', price: 799.00, description: 'Upgraded graphics core and enhanced battery longevity.', imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&auto=format&fit=crop&q=80' },

  // --- 20 LAPTOPS ---
  { id: 'l1', name: 'MacBook Pro 16" M3 Max', category: 'Computer', price: 3499.00, description: 'Liquid Retina XDR display, 36GB Unified Memory, 1TB SSD.', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80' },
  { id: 'l2', name: 'MacBook Pro 14" M3 Pro', category: 'Computer', price: 1999.00, description: 'Space Black finish, M3 Pro chip, 18GB RAM, 512GB SSD.', imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=80' },
  { id: 'l3', name: 'MacBook Air 15" M3', category: 'Computer', price: 1299.00, description: 'Ultra-thin, silent fanless design with 16GB RAM and stunning screen.', imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&auto=format&fit=crop&q=80' },
  { id: 'l4', name: 'MacBook Air 13" M2', category: 'Computer', price: 999.00, description: 'Portable powerhouse with MagSafe charging and all-day battery.', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80' },
  { id: 'l5', name: 'Dell XPS 16 OLED', category: 'Computer', price: 2499.00, description: 'Intel Core Ultra 7, NVIDIA RTX 4070, 4K OLED touch display.', imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80' },
  { id: 'l6', name: 'Dell XPS 14 Touch', category: 'Computer', price: 1899.00, description: 'Precision crafted aluminum chassis with Intel Core Ultra 7 processor.', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80' },
  { id: 'l7', name: 'Dell XPS 13 Plus', category: 'Computer', price: 1399.00, description: 'Minimalist keyboard layout with seamless glass haptic touchpad.', imageUrl: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=500&auto=format&fit=crop&q=80' },
  { id: 'l8', name: 'Dell Inspiron 16 Plus', category: 'Computer', price: 1099.00, description: 'High-performance creator laptop with powerful multi-core CPU.', imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80' },
  { id: 'l9', name: 'Dell Latitude 7440', category: 'Computer', price: 1499.00, description: 'Secure business laptop featuring enterprise encryption and Intel vPro.', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80' },
  { id: 'l10', name: 'Dell G16 Gaming Laptop', category: 'Computer', price: 1399.00, description: 'Advanced cooling design with NVIDIA RTX graphics and 240Hz screen.', imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80' },
  { id: 'l11', name: 'ASUS ROG Zephyrus G16', category: 'Computer', price: 2199.00, description: 'AMD Ryzen AI 9 HX, RTX 4070, OLED 240Hz gaming laptop.', imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80' },
  { id: 'l12', name: 'ASUS ROG Strix Scar 18', category: 'Computer', price: 2899.00, description: 'Ultimate esports machine with Intel i9 and RTX 4080 graphics.', imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80' },
  { id: 'l13', name: 'ASUS Zenbook 14 OLED', category: 'Computer', price: 1049.00, description: 'Intel Core Ultra 7, thin profile, stellar battery longevity.', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80' },
  { id: 'l14', name: 'ASUS Vivobook Pro 15', category: 'Computer', price: 899.00, description: 'Creator laptop with vibrant display and dedicated graphics card.', imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&auto=format&fit=crop&q=80' },
  { id: 'l15', name: 'ASUS TUF Gaming A15', category: 'Computer', price: 999.00, description: 'Military-grade durability, AMD Ryzen 7, RTX 4060 graphics.', imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80' },
  { id: 'l16', name: 'ASUS ProArt P16', category: 'Computer', price: 2599.00, description: 'Built for professional video editors and 3D digital artists.', imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80' },
  { id: 'l17', name: 'ASUS ExpertBook B9', category: 'Computer', price: 1699.00, description: 'World lightest 14-inch business laptop with military durability.', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80' },
  { id: 'l18', name: 'MacBook Pro 14" M3', category: 'Computer', price: 1599.00, description: 'Standard M3 chip with active cooling and gorgeous Liquid Retina display.', imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=80' },
  { id: 'l19', name: 'Dell Inspiron 15 3000', category: 'Computer', price: 549.00, description: 'Reliable everyday laptop, Intel Core i5, 16GB RAM, 512GB SSD.', imageUrl: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=500&auto=format&fit=crop&q=80' },
  { id: 'l20', name: 'ASUS ROG Flow X13', category: 'Computer', price: 1499.00, description: 'Convertible 2-in-1 gaming laptop with touch screen rotation.', imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80' },

  // --- 20 TABLETS ---
  { id: 't1', name: 'iPad Pro 12.9" M2 Wi-Fi', category: 'Tablet', price: 1099.00, description: 'XDR Display, Apple Pencil hover, ultra-fast wireless.', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80' },
  { id: 't2', name: 'iPad Pro 11" M2 Wi-Fi', category: 'Tablet', price: 899.00, description: 'Compact Pro performance with Liquid Retina display.', imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80' },
  { id: 't3', name: 'iPad Air 13" M2', category: 'Tablet', price: 799.00, description: 'Supercharged by M2 chip, gorgeous wide-screen layout.', imageUrl: 'https://images.unsplash.com/photo-1585790050230-5b28fab91604?w=500&auto=format&fit=crop&q=80' },
  { id: 't4', name: 'iPad Air 11" M2', category: 'Tablet', price: 599.00, description: 'Fast M2 performance in a lightweight everyday tablet.', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80' },
  { id: 't5', name: 'iPad 10.9" (10th Gen)', category: 'Tablet', price: 349.00, description: 'All-screen design, A14 Bionic chip, vibrant color options.', imageUrl: 'https://images.unsplash.com/photo-1589739700289-4b2195f4628f?w=500&auto=format&fit=crop&q=80' },
  { id: 't6', name: 'iPad mini (A17 Pro)', category: 'Tablet', price: 499.00, description: 'Compact 8.3-inch powerhouse with Apple Intelligence support.', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80' },
  { id: 't7', name: 'iPad Pro 12.9" M1 Cellular', category: 'Tablet', price: 999.00, description: 'ProMotion technology with 5G cellular connectivity.', imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80' },
  { id: 't8', name: 'iPad 9th Gen 10.2"', category: 'Tablet', price: 299.00, description: 'Affordable everyday iPad with Center Stage camera.', imageUrl: 'https://images.unsplash.com/photo-1585790050230-5b28fab91604?w=500&auto=format&fit=crop&q=80' },
  { id: 't9', name: 'Samsung Galaxy Tab S9 Ultra', category: 'Tablet', price: 1199.00, description: '14.6-inch Dynamic AMOLED 2X, S-Pen included, IP68 water resistant.', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80' },
  { id: 't10', name: 'Samsung Galaxy Tab S9+', category: 'Tablet', price: 999.00, description: '12.4-inch AMOLED display with quad AKG speakers.', imageUrl: 'https://images.unsplash.com/photo-1589739700289-4b2195f4628f?w=500&auto=format&fit=crop&q=80' },
  { id: 't11', name: 'Samsung Galaxy Tab S9', category: 'Tablet', price: 799.00, description: 'Flagship portable tablet with Snapdragon 8 Gen 2 for Galaxy.', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80' },
  { id: 't12', name: 'Samsung Galaxy Tab S9 FE+', category: 'Tablet', price: 599.00, description: 'Large screen Fan Edition with included S-Pen stylus.', imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80' },
  { id: 't13', name: 'Samsung Galaxy Tab S9 FE', category: 'Tablet', price: 449.00, description: 'IP68 water resistance and smooth 90Hz refresh display.', imageUrl: 'https://images.unsplash.com/photo-1585790050230-5b28fab91604?w=500&auto=format&fit=crop&q=80' },
  { id: 't14', name: 'Samsung Galaxy Tab A9+', category: 'Tablet', price: 219.00, description: 'Smooth 90Hz refresh rate, quad speakers, family-friendly interface.', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80' },
  { id: 't15', name: 'Samsung Galaxy Tab S8 Ultra', category: 'Tablet', price: 899.00, description: 'Massive 14.6 screen with ultra-slim bezels and dual front cameras.', imageUrl: 'https://images.unsplash.com/photo-1589739700289-4b2195f4628f?w=500&auto=format&fit=crop&q=80' },
  { id: 't16', name: 'Samsung Galaxy Tab A8', category: 'Tablet', price: 199.00, description: 'Compact family entertainment tablet with expandable storage.', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80' },
  { id: 't17', name: 'iPad Air 5th Gen', category: 'Tablet', price: 599.00, description: 'M1 chip performance with Touch ID in the top power button.', imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80' },
  { id: 't18', name: 'Samsung Galaxy Tab S7 FE', category: 'Tablet', price: 429.00, description: 'Large 12.4-inch display great for remote learning and media.', imageUrl: 'https://images.unsplash.com/photo-1585790050230-5b28fab91604?w=500&auto=format&fit=crop&q=80' },
  { id: 't19', name: 'iPad mini 6', category: 'Tablet', price: 449.00, description: 'All-screen design with USB-C and support for Apple Pencil 2.', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80' },
  { id: 't20', name: 'Samsung Galaxy Tab Active4 Pro', category: 'Tablet', price: 649.00, description: 'Rugged enterprise tablet built for field work and harsh conditions.', imageUrl: 'https://images.unsplash.com/photo-1589739700289-4b2195f4628f?w=500&auto=format&fit=crop&q=80' }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (category && category !== 'All') {
    const filtered = dynamicProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    return NextResponse.json(filtered);
  }

  return NextResponse.json(dynamicProducts);
}

// Handle adding a new product via API from Admin Dashboard
export async function POST(request: Request) {
  try {
    const newProduct = await request.json();
    dynamicProducts.unshift(newProduct);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}

// Handle updating a product via API from Admin Dashboard
export async function PUT(request: Request) {
  try {
    const updatedProduct = await request.json();
    dynamicProducts = dynamicProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}

// Handle deleting a product via API from Admin Dashboard
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    dynamicProducts = dynamicProducts.filter(p => p.id !== id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}