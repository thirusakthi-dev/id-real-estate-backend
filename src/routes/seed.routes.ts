import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import { prisma } from "../lib/prisma.js";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seedKey = req.headers["x-seed-key"];

    if (!process.env.SEED_KEY || seedKey !== process.env.SEED_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // WARNING:
    // This deletes all existing favorites, properties and users.
    await prisma.favorite.deleteMany();
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();

    const usersData = [
      {
        name: "Arun Kumar",
        email: "arun.kumar@gmail.com",
        password: "Arun@123",
        phone: "9876543210",
        city: "Chennai",
        bio: "Experienced property consultant helping families find quality homes in Chennai.",
        whatsapp: "919876543210",
        instagram: "arun.properties",
        facebook: "arun.properties",
        linkedin: "arun-kumar",
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@gmail.com",
        password: "Priya@123",
        phone: "9876543211",
        city: "Bangalore",
        bio: "Real estate consultant specializing in residential properties across Bangalore.",
        whatsapp: "919876543211",
        instagram: "priya.homes",
        facebook: "priya.homes",
        linkedin: "priya-sharma",
      },
      {
        name: "Rahul Menon",
        email: "rahul.menon@gmail.com",
        password: "Rahul@123",
        phone: "9876543212",
        city: "Kochi",
        bio: "Helping buyers and tenants discover well-connected properties in Kochi.",
        whatsapp: "919876543212",
        instagram: "rahul.realestate",
        facebook: "rahul.realestate",
        linkedin: "rahul-menon",
      },
      {
        name: "Sneha Raj",
        email: "sneha.raj@gmail.com",
        password: "Sneha@123",
        phone: "9876543213",
        city: "Coimbatore",
        bio: "Property advisor focused on modern homes and investment opportunities.",
        whatsapp: "919876543213",
        instagram: "sneha.properties",
        facebook: "sneha.properties",
        linkedin: "sneha-raj",
      },
      {
        name: "Vikram Singh",
        email: "vikram.singh@gmail.com",
        password: "Vikram@123",
        phone: "9876543214",
        city: "Hyderabad",
        bio: "Real estate professional offering residential and commercial properties.",
        whatsapp: "919876543214",
        instagram: "vikram.realestate",
        facebook: "vikram.realestate",
        linkedin: "vikram-singh",
      },
    ];

    const users = [];

    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          phone: userData.phone,
          city: userData.city,
          bio: userData.bio,
          whatsapp: userData.whatsapp,
          instagram: userData.instagram,
          facebook: userData.facebook,
          linkedin: userData.linkedin,
        },
      });

      users.push({
        id: user.id,
        name: user.name,
        email: user.email,
        password: userData.password,
        city: user.city,
      });
    }

    const propertyTemplates = [
      {
        title: "Modern 3 BHK Apartment",
        propertyType: "APARTMENT",
        listingType: "SALE",
        price: 8500000,
        bedrooms: 3,
        bathrooms: 3,
        area: 1650,
      },
      {
        title: "Premium 2 BHK Apartment",
        propertyType: "APARTMENT",
        listingType: "SALE",
        price: 6200000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1250,
      },
      {
        title: "Luxury Family Villa",
        propertyType: "VILLA",
        listingType: "SALE",
        price: 14500000,
        bedrooms: 4,
        bathrooms: 4,
        area: 2800,
      },
      {
        title: "Spacious Independent House",
        propertyType: "HOUSE",
        listingType: "SALE",
        price: 9800000,
        bedrooms: 3,
        bathrooms: 3,
        area: 2100,
      },
      {
        title: "Residential Plot",
        propertyType: "PLOT",
        listingType: "SALE",
        price: 5500000,
        bedrooms: null,
        bathrooms: null,
        area: 1800,
      },
      {
        title: "Furnished 2 BHK for Rent",
        propertyType: "APARTMENT",
        listingType: "RENT",
        price: 28000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
      },
      {
        title: "Commercial Office Space",
        propertyType: "OFFICE",
        listingType: "RENT",
        price: 65000,
        bedrooms: null,
        bathrooms: null,
        area: 2200,
      },
      {
        title: "Prime Retail Shop",
        propertyType: "SHOP",
        listingType: "RENT",
        price: 45000,
        bedrooms: null,
        bathrooms: null,
        area: 950,
      },
      {
        title: "Elegant 4 BHK Villa",
        propertyType: "VILLA",
        listingType: "SALE",
        price: 18500000,
        bedrooms: 4,
        bathrooms: 4,
        area: 3200,
      },
      {
        title: "Contemporary 3 BHK House",
        propertyType: "HOUSE",
        listingType: "SALE",
        price: 11200000,
        bedrooms: 3,
        bathrooms: 3,
        area: 2350,
      },
    ];

    const createdProperties = [];

    for (const user of users) {
      const city = user.city ?? "Chennai";

      for (const template of propertyTemplates) {
        const property = await prisma.property.create({
          data: {
            title: `${template.title} - ${city}`,

            description:
              "Beautifully designed property with modern amenities, excellent connectivity and a convenient location.",

            price: template.price,

            location: `${city} Main Road`,

            city,

            bedrooms: template.bedrooms,

            bathrooms: template.bathrooms,

            area: template.area,

            propertyType: template.propertyType as
              | "APARTMENT"
              | "VILLA"
              | "HOUSE"
              | "PLOT"
              | "OFFICE"
              | "SHOP",

            listingType: template.listingType as "SALE" | "RENT",

            images: [],

            isAvailable: true,

            userId: user.id,
          },
        });

        createdProperties.push(property);
      }
    }

    for (let userIndex = 0; userIndex < users.length; userIndex++) {
      const targetUserIndex = (userIndex + 1) % users.length;

      const targetUser = users[targetUserIndex];

      const targetProperties = createdProperties
        .filter((property) => property.userId === targetUser.id)
        .slice(0, 5);

      for (const property of targetProperties) {
        await prisma.favorite.create({
          data: {
            userId: users[userIndex].id,
            propertyId: property.id,
          },
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Database seeded successfully",
      data: {
        users: users.length,
        properties: createdProperties.length,
        favorites: users.length * 5,
        credentials: users.map((user) => ({
          name: user.name,
          email: user.email,
          password: user.password,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
