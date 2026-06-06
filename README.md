NextyWeb - Professional Web Design Agency Website
A complete multi-page professional website for a web design agency called "NextyWeb". Built with HTML, CSS, JavaScript, and Firebase.

🚀 Features
Public Pages
Homepage - Hero section, services preview, portfolio preview, reviews, pricing teaser, CTA
Services - Dynamic services grid loaded from Firestore, FAQ accordion
Portfolio - Filterable project gallery with categories
Pricing - 3-tier pricing table with feature comparison
About - Company story, team section, stats, mission statement
Contact - Contact form with Firestore integration and EmailJS
Blog - Dynamic blog posts loaded from Firestore
Reviews - Client testimonials with star ratings
Admin Portal
Dashboard - Statistics overview with quick actions
Manage Blogs - Rich text editor (Quill.js), image upload, publish/unpublish
Manage Reviews - Add/edit/delete reviews with ratings
Manage Services - Add/edit/delete service cards
Manage Portfolio - Upload projects with images
AI FAQ Chatbot
Floating chatbot widget on all public pages
Rule-based FAQ responses with keyword detection
Quick reply buttons for common questions
Animated slide-up panel
🎨 Design
Color Palette: Navy Blue (#1B3A6B), White (#FFFFFF), Teal (#1DB09A)
Typography: Inter/Poppins from Google Fonts
Responsive: Mobile-first design with hamburger menu
Modern: Clean card-based layouts, subtle shadows, rounded corners
📁 Project Structure
nextyweb/
├── public/
│   ├── css/
│   │   ├── main.css          # Main stylesheet
│   │   └── admin.css         # Admin portal styles
│   ├── js/
│   │   ├── firebase-config.js # Firebase configuration
│   │   ├── main.js           # Main JavaScript
│   │   ├── auth.js           # Admin authentication
│   │   ├── admin.js          # Admin dashboard functionality
│   │   └── chatbot.js        # AI FAQ chatbot
│   ├── images/
│   │   └── logo.svg          # Placeholder logo
│   └── pages/
│       ├── services.html
│       ├── portfolio.html
│       ├── pricing.html
│       ├── about.html
│       ├── contact.html
│       ├── blog.html
│       ├── blog-post.html
│       └── reviews.html
├── admin/
│   ├── index.html            # Admin login
│   ├── dashboard.html
│   ├── manage-blogs.html
│   ├── manage-reviews.html
│   ├── manage-services.html
│   └── manage-portfolio.html
├── index.html                # Homepage
├── firebase.json
├── .firebaserc
└── README.md
🛠️ Setup Instructions
1. Create Firebase Project
Go to Firebase Console
Click "Add project" and follow the setup wizard
Give your project a name (e.g., "nextyweb")
2. Get Firebase Configuration
In Firebase Console, click the web icon (</>) to add a web app
Register your app with a nickname
Copy the Firebase configuration object
3. Update Firebase Config
Open public/js/firebase-config.js and replace the placeholder values:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
4. Enable Firebase Services
In Firebase Console, enable the following services:

Authentication
Go to Authentication → Sign-in method
Enable "Email/Password" provider
Create an admin user with email and password
Firestore Database
Go to Firestore Database → Create database
Start in test mode (for development)
Choose a location close to your users
Storage
Go to Storage → Get started
Start in test mode (for development)
Choose a location close to your users
5. Set Up EmailJS (Optional)
For contact form email notifications:

Go to EmailJS
Create an account
Create an email service (Gmail, Outlook, etc.)
Create an email template
Get your Public Key, Service ID, and Template ID
Update public/js/firebase-config.js:

const emailJSConfig = {
  publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
  serviceId: 'YOUR_EMAILJS_SERVICE_ID',
  templateId: 'YOUR_EMAILJS_TEMPLATE_ID'
};
6. Deploy to Firebase
Install Firebase CLI:

npm install -g firebase-tools
Login to Firebase:

firebase login
Initialize Firebase in your project:

cd nextyweb
firebase init
Select Hosting, Firestore, and Storage
Use existing project (select your project)
Set public directory to .
Configure as single-page app: Yes
Set up automatic builds: No
Deploy:

firebase deploy
7. Access Admin Portal
Go to https://your-project-id.web.app/admin/
Login with the admin email/password you created in Firebase Authentication
Start adding content!
📝 Firestore Collections
The following collections will be created automatically when you add content:

blogs - Blog posts
reviews - Client reviews
services - Service offerings
portfolio - Portfolio projects
leads - Contact form submissions
🔒 Security Rules
For production, update your Firestore security rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /blogs/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /reviews/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /services/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /portfolio/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Leads - write only from authenticated users
    match /leads/{document} {
      allow read: if request.auth != null;
      allow write: if true;
    }
  }
}
🎯 Customization
Colors
Edit CSS variables in public/css/main.css:

:root {
  --primary: #1B3A6B;
  --secondary: #FFFFFF;
  --accent: #1DB09A;
  --text-dark: #1A1A2E;
  --text-light: #F5F5F5;
  --bg-light: #F8FAFF;
}
Logo
Replace public/images/logo.svg with your own logo.

Content
Update company information in footer sections
Modify pricing plans in index.html and pages/pricing.html
Edit FAQ questions in pages/services.html
Customize chatbot responses in public/js/chatbot.js
📱 Mobile Responsive
The website is fully responsive with:

Hamburger navigation menu on mobile
Single-column layouts on small screens
Touch-friendly buttons (min 44px height)
Full-width chatbot panel on mobile
🤖 Chatbot FAQ
The chatbot responds to these keywords:

"pricing" / "cost" / "how much" → Pricing information
"contact" / "reach" / "email" → Contact information
"services" / "what do you do" → Services overview
"time" / "how long" / "delivery" → Delivery timeline
"portfolio" / "examples" / "work" → Portfolio link
"refund" / "guarantee" → Satisfaction guarantee
📄 License
This project is for NextyWeb. All rights reserved.

🆘 Support
For issues or questions, please contact:

Email: iftekharirab11@gmail.com
Phone: +8801619804451
Built with ❤️ by NextyWeb
