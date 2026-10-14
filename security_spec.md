# VELMORA Firebase Security Specification & TDD Matrix

## 1. Data Invariants
1. **User Identity Isolation**: A customer can only read or write their own user profile document (`/users/{userId}`) and private subcollection (`/users/{userId}/private/{docId}`).
2. **Anti-Privilege Escalation**: Standard users cannot set or elevate their own `role` to `ADMIN`, modify `loyaltyPoints` arbitrarily, or create records in `/admins/{adminId}`.
3. **Cart & Wishlist Privacy**: A user can only inspect, mutate, or clear their own cart (`/carts/{userId}`) and wishlist (`/wishlists/{userId}`).
4. **Order Ownership & State Protection**: Orders can only be created by authenticated users where `request.resource.data.userId == request.auth.uid`. Existing orders are immutable to non-admin customers, preventing state manipulation of `orderStatus` or `paymentStatus`.
5. **Catalog Protection**: Public users can read active products and categories, but only verified administrators can create, update, or archive products and categories.
6. **Review Authenticity**: Reviews can only be written by authenticated users where `request.resource.data.userId == request.auth.uid`.
7. **Admin Safeguards**: Administrator permissions are verified against the trusted `/admins/{adminId}` collection or verified runtime owner email (`pravalikagoli9@gmail.com`).

---

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)

1. **Payload 1 (Self-Assigned Admin Role)**:
   - Target: `POST /users/usr_attacker`
   - Data: `{ "id": "usr_attacker", "email": "attacker@evil.com", "name": "Attacker", "role": "ADMIN" }`
   - Invariant Violated: Privilege escalation via initial user registration.

2. **Payload 2 (Cart Scraping / Peeking)**:
   - Target: `GET /carts/usr_victim_123`
   - Auth: `usr_intruder`
   - Invariant Violated: Accessing another user's shopping cart.

3. **Payload 3 (Cart Tampering)**:
   - Target: `SET /carts/usr_victim_123`
   - Auth: `usr_intruder`
   - Invariant Violated: Mutating another user's cart items.

4. **Payload 4 (Order Spoofing / Free Purchase)**:
   - Target: `POST /orders/ord_spoofed`
   - Auth: `usr_attacker`
   - Data: `{ "id": "ord_spoofed", "userId": "usr_victim", "customerEmail": "victim@example.com", "totalAmount": 0 }`
   - Invariant Violated: Creating an order under another user's UID.

5. **Payload 5 (Order State Tampering / False Delivery)**:
   - Target: `UPDATE /orders/ord_legit_456`
   - Auth: `usr_customer` (Order owner, but not admin)
   - Data: `{ "orderStatus": "DELIVERED", "paymentStatus": "PAID" }`
   - Invariant Violated: Non-admins modifying final order fulfillment status.

6. **Payload 6 (Product Price Modification)**:
   - Target: `UPDATE /products/velmora_perfume_ambre`
   - Auth: `usr_customer`
   - Data: `{ "price": 10 }`
   - Invariant Violated: Unauthorized product pricing alterations.

7. **Payload 7 (Category Creation by Patron)**:
   - Target: `POST /categories/cat_hacked`
   - Auth: `usr_customer`
   - Invariant Violated: Non-admin adding catalog categories.

8. **Payload 8 (Private PII Harvesting)**:
   - Target: `GET /users/usr_victim/private/info`
   - Auth: `usr_intruder`
   - Invariant Violated: Reading another patron's private phone and shipping address.

9. **Payload 9 (Denial of Wallet - Oversized Payload)**:
   - Target: `SET /carts/usr_attacker`
   - Auth: `usr_attacker`
   - Data: `{ "userId": "usr_attacker", "items": [ ... 500 oversized items ... ] }`
   - Invariant Violated: Unbounded collection size abuse.

10. **Payload 10 (Review Impersonation)**:
    - Target: `POST /reviews/rev_fake`
    - Auth: `usr_attacker`
    - Data: `{ "id": "rev_fake", "userId": "usr_celebrity", "userName": "VIP", "productId": "p1", "rating": 5, "comment": "Fake" }`
    - Invariant Violated: Submitting a review with a spoofed `userId`.

11. **Payload 11 (Admin Directory Hijacking)**:
    - Target: `SET /admins/usr_attacker`
    - Auth: `usr_attacker`
    - Data: `{ "email": "attacker@evil.com", "role": "ADMIN" }`
    - Invariant Violated: Direct unauthorized write to administrative roles collection.

12. **Payload 12 (Unauthenticated Order Listing)**:
    - Target: `LIST /orders`
    - Auth: `null` (Anonymous)
    - Invariant Violated: Unauthenticated access to private transaction history.
