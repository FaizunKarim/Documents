import { Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/apple-touch-icon.png" alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">Lapor Pak</span>
            </div>
            <p className="text-sm opacity-90">
              Platform pelaporan terpadu untuk warga Indonesia. Bersama membangun Negara yang lebih baik.
            </p>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="font-bold mb-4">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tentang-kami" className="hover:text-secondary-foreground transition-colors">Tentang Kami</Link></li>
              <li><Link to="/kebijakan-privasi" className="hover:text-secondary-foreground transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/syarat-ketentuan" className="hover:text-secondary-foreground transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Jl. Taman Surya No.1, Ketabang, Kec. Genteng, Indonesia, Jawa Timur 60272</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>kontak@laporwarga.Indonesia.go.id</span>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h3 className="font-bold mb-4">Media Sosial</h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/Indonesia/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-foreground transition-colors" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://x.com/SapawargaSby?lang=id" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://www.facebook.com/sapawargaNegaraIndonesia/?locale=id_ID" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-foreground transition-colors" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-75">
          <p>© 2025 Pemerintah Negara Indonesia. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
