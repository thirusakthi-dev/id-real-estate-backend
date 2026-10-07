import bcrypt from "bcrypt";
import { PrismaClient, PropertyType, ListingType } from "@prisma/client";

const prisma = new PrismaClient();

const USERS = [
  {
    name: "Arun Kumar",
    email: "arun.kumar@gmail.com",
    password: "Arun@123",
    phone: "9876543210",
    city: "Chennai",
    bio: "Property owner helping families find comfortable homes across Chennai.",
    whatsapp: "9876543210",
    instagram: "arunkumar",
    facebook: "arun.kumar",
    linkedin: "arun-kumar",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    password: "Priya@123",
    phone: "9876543211",
    city: "Bangalore",
    bio: "Independent property owner offering quality residential properties in Bangalore.",
    whatsapp: "9876543211",
    instagram: "priyasharma",
    facebook: "priya.sharma",
    linkedin: "priya-sharma",
  },
  {
    name: "Rahul Menon",
    email: "rahul.menon@gmail.com",
    password: "Rahul@123",
    phone: "9876543212",
    city: "Kochi",
    bio: "Property enthusiast offering premium homes and apartments across Kochi.",
    whatsapp: "9876543212",
    instagram: "rahulmenon",
    facebook: "rahul.menon",
    linkedin: "rahul-menon",
  },
  {
    name: "Sneha Raj",
    email: "sneha.raj@gmail.com",
    password: "Sneha@123",
    phone: "9876543213",
    city: "Coimbatore",
    bio: "Residential property owner focused on comfortable and quality homes.",
    whatsapp: "9876543213",
    instagram: "sneharaj",
    facebook: "sneha.raj",
    linkedin: "sneha-raj",
  },
  {
    name: "Vikram Singh",
    email: "vikram.singh@gmail.com",
    password: "Vikram@123",
    phone: "9876543214",
    city: "Hyderabad",
    bio: "Managing residential and commercial properties across Hyderabad.",
    whatsapp: "9876543214",
    instagram: "vikramsingh",
    facebook: "vikram.singh",
    linkedin: "vikram-singh",
  },
];

const PROPERTY_DATA = [
  // Arun - Chennai
  [
    {
      title: "Modern 3 BHK Apartment",
      description:
        "Spacious 3 BHK apartment with excellent natural lighting, modern interiors and convenient access to schools, offices and shopping areas.",
      price: 8500000,
      location: "OMR",
      bedrooms: 3,
      bathrooms: 2,
      area: 1650,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.SALE,
    },
    {
      title: "Luxury 4 BHK Villa",
      description:
        "Premium independent villa with spacious rooms, private parking, landscaped surroundings and modern amenities.",
      price: 18500000,
      location: "ECR",
      bedrooms: 4,
      bathrooms: 4,
      area: 3200,
      propertyType: PropertyType.VILLA,
      listingType: ListingType.SALE,
    },
    {
      title: "Comfortable 2 BHK Apartment",
      description:
        "Well-maintained apartment located in a peaceful residential neighborhood with excellent connectivity.",
      price: 28000,
      location: "Velachery",
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
    },
    {
      title: "Independent 3 BHK House",
      description:
        "Spacious independent house with private parking and a peaceful residential environment.",
      price: 9500000,
      location: "Anna Nagar",
      bedrooms: 3,
      bathrooms: 3,
      area: 2400,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.SALE,
    },
    {
      title: "Premium 2 BHK Rental",
      description:
        "Modern 2 BHK home suitable for families and working professionals with excellent connectivity.",
      price: 32000,
      location: "Adyar",
      bedrooms: 2,
      bathrooms: 2,
      area: 1250,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
    },
    {
      title: "Residential Plot",
      description:
        "Clear residential plot in a developing neighborhood with good road connectivity.",
      price: 7200000,
      location: "Tambaram",
      bedrooms: null,
      bathrooms: null,
      area: 2400,
      propertyType: PropertyType.PLOT,
      listingType: ListingType.SALE,
    },
    {
      title: "Family 4 BHK Home",
      description:
        "Large family home with spacious rooms, parking and convenient access to everyday amenities.",
      price: 13500000,
      location: "Porur",
      bedrooms: 4,
      bathrooms: 3,
      area: 2900,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.SALE,
    },
    {
      title: "Compact 1 BHK Apartment",
      description:
        "Well-designed 1 BHK apartment ideal for singles and young professionals.",
      price: 18000,
      location: "Sholinganallur",
      bedrooms: 1,
      bathrooms: 1,
      area: 700,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
    },
    {
      title: "Commercial Office Space",
      description:
        "Well-connected office space suitable for startups and professional businesses.",
      price: 65000,
      location: "Guindy",
      bedrooms: null,
      bathrooms: 2,
      area: 1900,
      propertyType: PropertyType.OFFICE,
      listingType: ListingType.RENT,
    },
    {
      title: "Road Facing Commercial Shop",
      description:
        "Road-facing commercial shop suitable for retail and service-based businesses.",
      price: 8500000,
      location: "T Nagar",
      bedrooms: null,
      bathrooms: 1,
      area: 950,
      propertyType: PropertyType.SHOP,
      listingType: ListingType.SALE,
    },
  ],

  // Priya - Bangalore
  [
    {
      title: "Premium 3 BHK Apartment",
      description:
        "Elegant 3 BHK apartment in a premium gated community with modern amenities.",
      price: 12500000,
      location: "Whitefield",
      bedrooms: 3,
      bathrooms: 3,
      area: 1850,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.SALE,
    },
    {
      title: "Fully Furnished 2 BHK",
      description:
        "Fully furnished apartment located close to IT parks and public transport.",
      price: 42000,
      location: "Marathahalli",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
    },
    {
      title: "Independent Family House",
      description:
        "Spacious independent house with private parking and generous living spaces.",
      price: 9800000,
      location: "JP Nagar",
      bedrooms: 3,
      bathrooms: 3,
      area: 2100,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.SALE,
    },
    {
      title: "Modern 4 BHK Villa",
      description:
        "Luxury villa with spacious interiors, private garden and premium finishes.",
      price: 22000000,
      location: "Sarjapur",
      bedrooms: 4,
      bathrooms: 4,
      area: 3400,
      propertyType: PropertyType.VILLA,
      listingType: ListingType.SALE,
    },
    {
      title: "Cozy 1 BHK Apartment",
      description:
        "Compact apartment ideal for professionals working in nearby technology parks.",
      price: 25000,
      location: "HSR Layout",
      bedrooms: 1,
      bathrooms: 1,
      area: 750,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
    },
    {
      title: "Residential Plot Near IT Hub",
      description:
        "Residential plot located in a rapidly developing area with excellent connectivity.",
      price: 9000000,
      location: "Electronic City",
      bedrooms: null,
      bathrooms: null,
      area: 2400,
      propertyType: PropertyType.PLOT,
      listingType: ListingType.SALE,
    },
    {
      title: "Luxury 3 BHK Residence",
      description:
        "Premium residence featuring modern interiors and excellent community amenities.",
      price: 15500000,
      location: "Indiranagar",
      bedrooms: 3,
      bathrooms: 3,
      area: 2000,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.SALE,
    },
    {
      title: "Spacious 2 BHK Rental",
      description: "Bright and spacious apartment in a peaceful neighborhood.",
      price: 35000,
      location: "Koramangala",
      bedrooms: 2,
      bathrooms: 2,
      area: 1300,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
    },
    {
      title: "Commercial Office Floor",
      description:
        "Professional office floor suitable for growing businesses and startups.",
      price: 85000,
      location: "Bellandur",
      bedrooms: null,
      bathrooms: 2,
      area: 2200,
      propertyType: PropertyType.OFFICE,
      listingType: ListingType.RENT,
    },
    {
      title: "Retail Shop Space",
      description:
        "Prime commercial shop space suitable for retail and showroom businesses.",
      price: 11500000,
      location: "MG Road",
      bedrooms: null,
      bathrooms: 1,
      area: 1000,
      propertyType: PropertyType.SHOP,
      listingType: ListingType.SALE,
    },
  ],

  // Rahul - Kochi
  [
    {
      title: "Waterfront 3 BHK Villa",
      description:
        "Beautiful villa with spacious interiors, peaceful surroundings and excellent views.",
      price: 14500000,
      location: "Kakkanad",
      bedrooms: 3,
      bathrooms: 3,
      area: 2600,
      propertyType: PropertyType.VILLA,
      listingType: ListingType.SALE,
    },
    {
      title: "Comfortable 2 BHK Home",
      description:
        "Comfortable family home with good ventilation and easy access to local facilities.",
      price: 22000,
      location: "Edappally",
      bedrooms: 2,
      bathrooms: 2,
      area: 1050,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.RENT,
    },
    {
      title: "Residential Land Near City",
      description:
        "Clear residential plot in a developing neighborhood with good road access.",
      price: 6500000,
      location: "Aluva",
      bedrooms: null,
      bathrooms: null,
      area: 2400,
      propertyType: PropertyType.PLOT,
      listingType: ListingType.SALE,
    },
    {
      title: "Modern 3 BHK Apartment",
      description:
        "Modern apartment with excellent ventilation, parking and community facilities.",
      price: 7800000,
      location: "Vyttila",
      bedrooms: 3,
      bathrooms: 2,
      area: 1550,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.SALE,
    },
    {
      title: "Premium 4 BHK House",
      description:
        "Large independent home with spacious bedrooms and premium interiors.",
      price: 12800000,
      location: "Palarivattom",
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.SALE,
    },
    {
      title: "Furnished 2 BHK Apartment",
      description:
        "Fully furnished apartment ideal for professionals and small families.",
      price: 30000,
      location: "Kalamassery",
      bedrooms: 2,
      bathrooms: 2,
      area: 1150,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
    },
    {
      title: "Luxury Coastal Villa",
      description:
        "Premium coastal villa offering peaceful surroundings and spacious living areas.",
      price: 19500000,
      location: "Fort Kochi",
      bedrooms: 4,
      bathrooms: 4,
      area: 3300,
      propertyType: PropertyType.VILLA,
      listingType: ListingType.SALE,
    },
    {
      title: "Affordable 1 BHK Apartment",
      description:
        "Affordable apartment suitable for a single professional or couple.",
      price: 16000,
      location: "Thrippunithura",
      bedrooms: 1,
      bathrooms: 1,
      area: 650,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
    },
    {
      title: "Commercial Office Space",
      description: "Modern office space in a well-connected commercial area.",
      price: 50000,
      location: "Kaloor",
      bedrooms: null,
      bathrooms: 2,
      area: 1700,
      propertyType: PropertyType.OFFICE,
      listingType: ListingType.RENT,
    },
    {
      title: "Prime Retail Shop",
      description: "Commercial shop with excellent visibility and road access.",
      price: 7200000,
      location: "Marine Drive",
      bedrooms: null,
      bathrooms: 1,
      area: 900,
      propertyType: PropertyType.SHOP,
      listingType: ListingType.SALE,
    },
  ],

  // Sneha - Coimbatore
  [
    {
      title: "Spacious 4 BHK House",
      description:
        "Large independent house suitable for families looking for generous living spaces.",
      price: 9200000,
      location: "RS Puram",
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.SALE,
    },
    {
      title: "Modern 2 BHK Apartment",
      description:
        "Modern apartment with clean interiors and excellent ventilation.",
      price: 18000,
      location: "Saravanampatti",
      bedrooms: 2,
      bathrooms: 2,
      area: 1150,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
    },
    {
      title: "Residential Land",
      description:
        "Residential land in a developing area with good road access.",
      price: 4800000,
      location: "Thudiyalur",
      bedrooms: null,
      bathrooms: null,
      area: 1800,
      propertyType: PropertyType.PLOT,
      listingType: ListingType.SALE,
    },
    {
      title: "Premium 3 BHK Villa",
      description:
        "Beautiful villa with modern interiors, private parking and landscaped surroundings.",
      price: 11500000,
      location: "Race Course",
      bedrooms: 3,
      bathrooms: 3,
      area: 2400,
      propertyType: PropertyType.VILLA,
      listingType: ListingType.SALE,
    },
    {
      title: "Family 3 BHK Apartment",
      description:
        "Comfortable apartment located near schools, hospitals and shopping facilities.",
      price: 6200000,
      location: "Peelamedu",
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.SALE,
    },
    {
      title: "Affordable 2 BHK Rental",
      description: "Well-maintained apartment suitable for a small family.",
      price: 16000,
      location: "Singanallur",
      bedrooms: 2,
      bathrooms: 2,
      area: 1050,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
    },
    {
      title: "Independent 3 BHK Home",
      description:
        "Peaceful independent home with parking and spacious living areas.",
      price: 7800000,
      location: "Saibaba Colony",
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.SALE,
    },
    {
      title: "Compact 1 BHK Home",
      description:
        "Compact and affordable home suitable for working professionals.",
      price: 12000,
      location: "Ganapathy",
      bedrooms: 1,
      bathrooms: 1,
      area: 650,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.RENT,
    },
    {
      title: "Commercial Office",
      description: "Professional office space with good access to major roads.",
      price: 40000,
      location: "Avinashi Road",
      bedrooms: null,
      bathrooms: 2,
      area: 1500,
      propertyType: PropertyType.OFFICE,
      listingType: ListingType.RENT,
    },
    {
      title: "Commercial Shop",
      description:
        "Road-facing commercial shop suitable for retail businesses.",
      price: 6500000,
      location: "Gandhipuram",
      bedrooms: null,
      bathrooms: 1,
      area: 850,
      propertyType: PropertyType.SHOP,
      listingType: ListingType.SALE,
    },
  ],

  // Vikram - Hyderabad
  [
    {
      title: "Premium 4 BHK Residence",
      description:
        "Luxury residence featuring spacious bedrooms, premium finishes and modern amenities.",
      price: 21000000,
      location: "Gachibowli",
      bedrooms: 4,
      bathrooms: 4,
      area: 3500,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.SALE,
    },
    {
      title: "Commercial Office Space",
      description:
        "Well-connected commercial office space suitable for startups and professional offices.",
      price: 55000,
      location: "Hitech City",
      bedrooms: null,
      bathrooms: 2,
      area: 1800,
      propertyType: PropertyType.OFFICE,
      listingType: ListingType.RENT,
    },
    {
      title: "Modern 3 BHK Apartment",
      description:
        "Premium apartment with modern amenities and excellent connectivity.",
      price: 13500000,
      location: "Kondapur",
      bedrooms: 3,
      bathrooms: 3,
      area: 1900,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.SALE,
    },
    {
      title: "Luxury 4 BHK Villa",
      description:
        "Spacious villa with private parking, garden and premium interiors.",
      price: 24000000,
      location: "Jubilee Hills",
      bedrooms: 4,
      bathrooms: 4,
      area: 3800,
      propertyType: PropertyType.VILLA,
      listingType: ListingType.SALE,
    },
    {
      title: "Furnished 2 BHK Rental",
      description: "Fully furnished apartment ideal for working professionals.",
      price: 38000,
      location: "Madhapur",
      bedrooms: 2,
      bathrooms: 2,
      area: 1250,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
    },
    {
      title: "Residential Plot",
      description:
        "Residential plot in a fast-growing neighborhood with excellent connectivity.",
      price: 8500000,
      location: "Nallagandla",
      bedrooms: null,
      bathrooms: null,
      area: 2400,
      propertyType: PropertyType.PLOT,
      listingType: ListingType.SALE,
    },
    {
      title: "Family 3 BHK House",
      description:
        "Spacious independent house suitable for families with private parking.",
      price: 11500000,
      location: "Manikonda",
      bedrooms: 3,
      bathrooms: 3,
      area: 2300,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.SALE,
    },
    {
      title: "Affordable 2 BHK Apartment",
      description:
        "Comfortable apartment with easy access to offices, schools and shopping.",
      price: 24000,
      location: "Kukatpally",
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
    },
    {
      title: "Premium Retail Shop",
      description:
        "Commercial retail space with excellent visibility and customer access.",
      price: 9500000,
      location: "Banjara Hills",
      bedrooms: null,
      bathrooms: 1,
      area: 1000,
      propertyType: PropertyType.SHOP,
      listingType: ListingType.SALE,
    },
    {
      title: "Large Commercial Office",
      description:
        "Large commercial office floor suitable for established businesses.",
      price: 95000,
      location: "Financial District",
      bedrooms: null,
      bathrooms: 3,
      area: 2600,
      propertyType: PropertyType.OFFICE,
      listingType: ListingType.RENT,
    },
  ],
];

async function main() {
  console.log("Starting database seed...");

  // Clear existing development data.
  await prisma.favorite.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  console.log("Existing data cleared.");

  // Hash passwords once per unique password.
  const passwordHashes = await Promise.all(
    USERS.map((user) => bcrypt.hash(user.password, 10)),
  );

  // Create users.
  const createdUsers = [];

  for (let index = 0; index < USERS.length; index++) {
    const user = USERS[index];
    const passwordHash = passwordHashes[index];

    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: passwordHash,
        phone: user.phone,
        city: user.city,
        bio: user.bio,
        whatsapp: user.whatsapp,
        instagram: user.instagram,
        facebook: user.facebook,
        linkedin: user.linkedin,
      },
    });

    createdUsers.push(createdUser);

    console.log(`Created user: ${createdUser.name}`);
  }

  // Create 10 properties for every user.
  const createdProperties = [];

  for (let userIndex = 0; userIndex < createdUsers.length; userIndex++) {
    const user = createdUsers[userIndex];
    const propertiesForUser = PROPERTY_DATA[userIndex];

    for (const property of propertiesForUser) {
      const createdProperty = await prisma.property.create({
        data: {
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          city: user.city,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          propertyType: property.propertyType,
          listingType: property.listingType,
          images: [],
          isAvailable: true,
          userId: user.id,
        },
      });

      createdProperties.push(createdProperty);
    }

    console.log(`Created 10 properties for ${user.name}`);
  }

  /*
   * Create 5 favorites for every user.
   *
   * Each user favorites 5 properties belonging to OTHER users.
   *
   * Example:
   * Arun -> Priya's properties
   * Priya -> Rahul's properties
   * Rahul -> Sneha's properties
   * Sneha -> Vikram's properties
   * Vikram -> Arun's properties
   */

  for (let userIndex = 0; userIndex < createdUsers.length; userIndex++) {
    const user = createdUsers[userIndex];

    const favoriteOwnerIndex = (userIndex + 1) % createdUsers.length;

    const favoriteOwner = createdUsers[favoriteOwnerIndex];

    const propertiesToFavorite = createdProperties
      .filter((property) => property.userId === favoriteOwner.id)
      .slice(0, 5);

    for (const property of propertiesToFavorite) {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          propertyId: property.id,
        },
      });
    }

    console.log(`Created 5 favorites for ${user.name}`);
  }

  console.log("");
  console.log("=================================");
  console.log("DATABASE SEED COMPLETED");
  console.log("=================================");
  console.log("");
  console.log("Users: 5");
  console.log("Properties: 50");
  console.log("Favorites: 25");
  console.log("");
  console.log("LOGIN CREDENTIALS");
  console.log("---------------------------------");

  USERS.forEach((user) => {
    console.log(`${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.password}`);
    console.log("");
  });

  console.log("=================================");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
