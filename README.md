# Yalla Dealz Backend Project Scope.

Project In-Scope:

The Business Workflow:
The GroupBuying is based on making deals through the registered "Merchants" as a form of "Coupon" which has a start and end date. The "User" (Buyer) will buy these coupons after registering in the system first. He will pay online (credit-card) through the website "Payment Gateway". Once payment is done successfully, the buyer will receive an "Email Notification" which has the Coupon code and the details of the coupon deal. Finally, the buyer can print this coupon and redeem his offer at the Merchant's venue. The website Owner then shares the profit with the Merchant as agreed on the commission basis. The system also enables the Buyers to share Deals (Coupons), and get shares of profit for successful purchases by their references.
The System Components: As described above, the system will have the following main components that form the desired GroupBuying system

Merchants: The one who creates the deals/coupons in the system, and set the price, and the deals start and end dates. The Merchant can register online, and submit all the required data, once registered the system owner will receive an email notification of merchant registration and then can activate/deactivate the merchant account. Once activated, the registered merchant will receive a notification of successful activation.
Coupons: They are being created by the merchants, as each coupon (deal) has its price, start/end date, and the details of the coupon, also it has validity dates. Each coupon will belong to one buyer upon successful purchase of the coupon.

Buyers/Customers: They are the money makers of the system and source of profit. First, he needs to register, then he can buy coupons using the credit cards, and also he can share the coupon, and make a profit upon successful purchase of his people who shared by him. Upon Purchasing the deals and upon successful sharing, the customer will get notifications to his email.

Transactions & Payments: All the transactions will be recorded, starting from the moment the Merchant creates the deal, till it reaches to the customer who buys the deal. Also, it will record the status of the Merchant's payments and profit sharing, whether he got paid back or still pending.
Subscriptions: Registered Customers can get specific deals sent to their emails based on their preferences. While Visitors can get common deals.
Email Notifications: This is considered the messenger of the system, and the main communicator that notify the system users (Admin, Merchants, Customers, Visitors).
Administration: The website owner has the full control of the system workflow, and has the full grant to create/read/update/delete (CRUD) the main components of the systems. In addition to some dashboards that can be populated from the data of the system.
Workflow & Processes: Registration - Deals - Notifications - Purchase - Subscriptions - Transactions - Activation/Deactivation Accounts & Deals

Technology Stack:
Web Server & Business Layer: NodeJS, ExpressJS (as a framework), 
Database Layer: MongoDB 
Frontend  Layer: NuxtJS "Theme ready made"
