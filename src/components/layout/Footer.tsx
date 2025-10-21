

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-primary mt-auto">
      <div className="max-w-content mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">
            &copy; {currentYear} GYMBROS. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:text-accent transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm hover:text-accent transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
