import '@/assets/styles/globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'PropertyPulse | Find The Perfect Rental',
  description: 'Find your dream rental property',
  keywords: 'rental, find rentals, find proerties'
}
const MainLayout = ({ children }) => {
  return (
    <AuthProvider>
    <html lang="en">
      <body className='min-h-screen flex flex-col'>
        <Navbar />
        <main className='flex-1'>{children}</main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
    </AuthProvider>
  );
};

export default MainLayout;


