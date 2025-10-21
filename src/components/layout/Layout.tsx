import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-content mx-auto w-full px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
