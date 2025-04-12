
package com.ecommerce.util;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Check if we already have users
        if (userRepository.count() == 0) {
            seedUsers();
        }
        
        // Check if we already have products
        if (productRepository.count() == 0) {
            seedProducts();
        }
    }
    
    private void seedUsers() {
        log.info("Seeding users...");
        
        // Create buyer user
        User buyer = new User();
        buyer.setName("John Doe");
        buyer.setEmail("buyer@example.com");
        buyer.setPassword(passwordEncoder.encode("password"));
        buyer.setRole(User.Role.BUYER);
        buyer.setAddress("123 Main St");
        buyer.setCity("New York");
        buyer.setState("NY");
        buyer.setZipCode("10001");
        buyer.setCountry("United States");
        buyer.setPhone("1234567890");
        
        // Create seller user
        User seller = new User();
        seller.setName("Jane Smith");
        seller.setEmail("seller@example.com");
        seller.setPassword(passwordEncoder.encode("password"));
        seller.setRole(User.Role.SELLER);
        seller.setAddress("456 Market St");
        seller.setCity("San Francisco");
        seller.setState("CA");
        seller.setZipCode("94103");
        seller.setCountry("United States");
        seller.setPhone("9876543210");
        
        userRepository.saveAll(Arrays.asList(buyer, seller));
        log.info("Users seeded successfully");
    }
    
    private void seedProducts() {
        log.info("Seeding products...");
        
        User seller = userRepository.findByEmail("seller@example.com").orElseThrow();
        
        List<String> categories = Arrays.asList("Electronics", "Clothing", "Books", "Home", "Beauty", "Sports", "Toys");
        
        List<String> productNames = Arrays.asList(
                "Smart LED TV", "Wireless Earbuds", "Laptop", "Smartphone", "Tablet", 
                "T-shirt", "Jeans", "Jacket", "Dress", "Shoes",
                "Programming Book", "Novel", "Biography", "Science Book", "History Book",
                "Coffee Table", "Sofa", "Bed", "Dining Table", "Lamp",
                "Face Cream", "Shampoo", "Perfume", "Lipstick", "Sunscreen",
                "Football", "Basketball", "Tennis Racket", "Running Shoes", "Yoga Mat",
                "Action Figure", "Board Game", "Puzzle", "Teddy Bear", "Remote Control Car"
        );
        
        List<String> imageUrls = Arrays.asList(
                "https://source.unsplash.com/random/800x600/?television",
                "https://source.unsplash.com/random/800x600/?earbuds",
                "https://source.unsplash.com/random/800x600/?laptop",
                "https://source.unsplash.com/random/800x600/?smartphone",
                "https://source.unsplash.com/random/800x600/?tablet",
                "https://source.unsplash.com/random/800x600/?tshirt",
                "https://source.unsplash.com/random/800x600/?jeans",
                "https://source.unsplash.com/random/800x600/?jacket",
                "https://source.unsplash.com/random/800x600/?dress",
                "https://source.unsplash.com/random/800x600/?shoes",
                "https://source.unsplash.com/random/800x600/?book",
                "https://source.unsplash.com/random/800x600/?novel",
                "https://source.unsplash.com/random/800x600/?biography",
                "https://source.unsplash.com/random/800x600/?science",
                "https://source.unsplash.com/random/800x600/?history",
                "https://source.unsplash.com/random/800x600/?table",
                "https://source.unsplash.com/random/800x600/?sofa",
                "https://source.unsplash.com/random/800x600/?bed",
                "https://source.unsplash.com/random/800x600/?dining",
                "https://source.unsplash.com/random/800x600/?lamp",
                "https://source.unsplash.com/random/800x600/?cream",
                "https://source.unsplash.com/random/800x600/?shampoo",
                "https://source.unsplash.com/random/800x600/?perfume",
                "https://source.unsplash.com/random/800x600/?lipstick",
                "https://source.unsplash.com/random/800x600/?sunscreen",
                "https://source.unsplash.com/random/800x600/?football",
                "https://source.unsplash.com/random/800x600/?basketball",
                "https://source.unsplash.com/random/800x600/?tennis",
                "https://source.unsplash.com/random/800x600/?running",
                "https://source.unsplash.com/random/800x600/?yoga",
                "https://source.unsplash.com/random/800x600/?figure",
                "https://source.unsplash.com/random/800x600/?game",
                "https://source.unsplash.com/random/800x600/?puzzle",
                "https://source.unsplash.com/random/800x600/?teddy",
                "https://source.unsplash.com/random/800x600/?car"
        );
        
        Random random = new Random();
        
        // Generate 50 products for now (you can expand to 500)
        for (int i = 0; i < 50; i++) {
            Product product = new Product();
            
            int nameIndex = i % productNames.size();
            String name = productNames.get(nameIndex) + " " + (i + 1);
            
            product.setName(name);
            product.setDescription("This is a description for " + name + ". It is a high-quality product with many features.");
            product.setPrice(BigDecimal.valueOf(random.nextInt(990) + 10)); // Price between 10 and 1000
            
            // Set discount for some products
            if (random.nextBoolean()) {
                BigDecimal discount = product.getPrice().multiply(BigDecimal.valueOf(random.nextInt(30) + 5).divide(BigDecimal.valueOf(100)));
                product.setDiscountPrice(product.getPrice().subtract(discount));
            }
            
            product.setStock(random.nextInt(100) + 1); // Stock between 1 and 100
            product.setCategory(categories.get(random.nextInt(categories.size())));
            product.setImageUrl(imageUrls.get(nameIndex % imageUrls.size()));
            product.setFeatured(random.nextInt(10) < 2); // 20% chance to be featured
            product.setUpcoming(random.nextInt(10) < 1); // 10% chance to be upcoming
            product.setUser(seller);
            
            productRepository.save(product);
        }
        
        log.info("Products seeded successfully");
    }
}
