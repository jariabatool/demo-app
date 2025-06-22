**Description**
This is a full-stack e-commerce application for selling shirts with variant-based ordering. Built using Next.js for the frontend and Node.js + MySQL for the backend, it allows users to view product details, select specific size and color variants, and place an order through a responsive and user-friendly interface.

**Fixes **
⦁	 Handled dynamic product routing using Next.js useRouter() to fetch product and variant data based on URL ID.
⦁	Implemented variant selection logic that auto-matches size and color to display accurate pricing and availability.
⦁	Added controlled order form submission with user input validation and a clean confirmation message upon success.
⦁	Used modular CSS for styling, improving maintainability and avoiding style conflicts across components.

**Type of change**
⦁	 Bug fix (non-breaking change which fixes an issue)
⦁	New feature (non-breaking change which adds functionality)
⦁	This change requires a documentation update

**Checklist:**
⦁	I have performed a self-review of my own code 
⦁	I have tested my code to prove my fix is effective or that my feature works

Build is Passing

**Loom video:**
https://www.loom.com/share/97f3bda042f342c78aba550b3dcfd460?sid=db4f3585-4851-4467-8030-a4418b7232dc

To run backend: node index.js
to run frontend: npm run dev
