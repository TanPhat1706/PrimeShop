package com.primeshop.bank;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bank")
@CrossOrigin(origins = "http://localhost:5173")
public class BankController {

    @Autowired
    private BankRepository repository;

    @PostMapping("/link")
    public ResponseEntity<?> linkBank(@RequestBody Map<String, String> body) {
        Long userId = Long.valueOf(body.get("userId"));
        String accountNumber = body.get("accountNumber");

        // Tạo token giả
        String fakeToken = UUID.randomUUID().toString();

        // Mã hóa (cần implement EncryptionUtil)
        byte[] encAccount = EncryptionUtil.encrypt(accountNumber);
        byte[] encToken = EncryptionUtil.encrypt(fakeToken);

        // Tạo entity Bank
        Bank bank = new Bank();
        bank.setUserId(userId);
        bank.setAccountNumber(encAccount);
        bank.setToken(encToken);
        bank.setStatus("linked");
        repository.save(bank);

        return ResponseEntity.ok(Map.of("token", fakeToken));
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmBank(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        byte[] encToken = EncryptionUtil.encrypt(token);

        Bank bank = repository.findByToken(encToken)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        bank.setStatus("confirmed");
        repository.save(bank);

        return ResponseEntity.ok(Map.of("message", "Bank link confirmed"));
    }
}
