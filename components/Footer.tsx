export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-dark to-dark bg-opacity-95 text-accent py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🥟</span>
              <span>Uncle's Chinese</span>
            </h3>
            <p className="text-sm text-gray-300">Authentic Thai & Chinese Cuisine</p>
            <p className="text-sm text-gray-300 mt-2">Momo Festival Campaign</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">📞 Contact</h3>
            <p className="text-sm text-gray-300">Phone: +1 (555) 123-4567</p>
            <p className="text-sm text-gray-300 mt-1">Email: info@uncleschinese.com</p>
            <p className="text-sm text-gray-300 mt-1">Hours: 11 AM - 11 PM</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">📍 Location</h3>
            <p className="text-sm text-gray-300">123 Main Street</p>
            <p className="text-sm text-gray-300 mt-1">Downtown, City 12345</p>
            <p className="text-sm text-gray-300 mt-1">Available on all platforms</p>
          </div>
        </div>
        <div className="border-t border-accent border-opacity-20 pt-6 text-center text-sm text-gray-300">
          <p>&copy; {currentYear} Uncle's Chinese. All rights reserved. | Momo Festival Challenge</p>
        </div>
      </div>
    </footer>
  );
}
