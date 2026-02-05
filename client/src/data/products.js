import soapImg from '../assets/product-soap.png';
import brushImg from '../assets/product-toothbrush.png';
import bagImg from '../assets/product-bag.png';

export const products = [
    {
        id: 1,
        name: "Lavender Bliss Soap",
        category: "Personal Care",
        price: 15.00,
        image: soapImg,
        rating: 5,
        organic: true,
        handmade: true,
        description: "A calming lavender soap handmade with organic ingredients."
    },
    {
        id: 2,
        name: "Bamboo Essentials Set",
        category: "Personal Care",
        price: 24.50,
        image: brushImg,
        rating: 4.8,
        organic: true,
        handmade: false,
        description: "Biodegradable bamboo toothbrushes for the whole family."
    },
    {
        id: 3,
        name: "Organic Cotton Mesh Bag",
        category: "Bags",
        price: 12.00,
        image: bagImg,
        rating: 4.9,
        organic: true,
        handmade: true,
        description: "Reusable grocery bag made from 100% organic cotton."
    },
    {
        id: 4,
        name: "Charcoal Detox Soap",
        category: "Personal Care",
        price: 14.00,
        image: soapImg, // Reusing image
        rating: 4.7,
        organic: true,
        handmade: true,
        description: "Activated charcoal soap for deep cleansing."
    },
    {
        id: 5,
        name: "Travel Bamboo Case",
        category: "Accessories",
        price: 8.50,
        image: brushImg, // Reusing image
        rating: 4.5,
        organic: true,
        handmade: false,
        description: "Travel case for your bamboo toothbrush."
    },
    {
        id: 6,
        name: "Large Market Tote",
        category: "Bags",
        price: 18.00,
        image: bagImg, // Reusing image
        rating: 4.9,
        organic: true,
        handmade: true,
        description: "Extra large tote for farmers market runs."
    }
];
