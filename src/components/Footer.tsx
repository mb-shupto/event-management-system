'use client';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-400 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Event Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;