package com.primeshop.cart;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.primeshop.product.Product;
import com.primeshop.product.ProductRepo;
import com.primeshop.user.User;
import com.primeshop.user.UserRepo;

@Service
public class CartService {
    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private CartItemRepo cartItemRepo;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private UserRepo userRepo;

    public CartResponse addToCart(CartItemRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found!"));
        
        Cart cart = cartRepo.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart(user);
            return cartRepo.save(newCart);
        });

        Product product = productRepo.findBySlugAndActiveTrue(request.getProductSlug()).orElseThrow(() -> new RuntimeException("Product not found!"));

        Optional<CartItem> cartItem = cartItemRepo.findByCartAndProduct(cart, product);
        if (cartItem.isPresent()) {           
            return updateCartItem(cartItem.get(), product, request.getQuantity(), cart);
        }
        else {
            if (request.getQuantity() < 1) {
                throw new RuntimeException();
            }
            CartItem newCartItem = new CartItem(cart, product, request.getQuantity());
            cartItemRepo.save(newCartItem);
        }
        return new CartResponse(cart);
    }

    public CartResponse getCart() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found!"));
        Cart cart = cartRepo.findByUser(user).orElseThrow(() -> new RuntimeException("Cart not found!"));

        return new CartResponse(cart);
    }
    
    public CartResponse removeFromCart(CartItemRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found!"));

        Cart cart = cartRepo.findByUser(user).orElseThrow(() -> new RuntimeException("Cart not found!"));
        Product product = productRepo.findBySlugAndActiveTrue(request.getProductSlug()).orElseThrow(() -> new RuntimeException("Product not found!"));
        Optional<CartItem> cartItem = cartItemRepo.findByCartAndProduct(cart, product);
        if (cartItem.isEmpty()) {
            throw new RuntimeException("Product is not in cart!");
        }
        CartItem cartItem2 = cartItem.get();
        cartItemRepo.delete(cartItem2);
        cart.setTotalPrice();
        cartRepo.save(cart);
        
        return new CartResponse(cart); // Changed from null to cart to avoid deleted instance error
    }

    private CartResponse updateCartItem(CartItem cartItem, Product product, Integer quantity, Cart cart) {
        cartItem.updateQuantity(cartItem.getQuantity() + quantity);
        cartItemRepo.save(cartItem);
        if (cartItem.getQuantity() < 1) {
            cartItemRepo.delete(cartItem);            
        }     
        cart.setTotalPrice();
        System.out.println(cart.getTotalPrice());
        cartRepo.save(cart);
        return new CartResponse(cart);
    }

    public Long getCartItemCount() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found!"));
        Cart cart = cartRepo.findByUser(user).orElseThrow(() -> new RuntimeException("Cart not found!"));
        
        return cartItemRepo.countByCart(cart);
    }
}


