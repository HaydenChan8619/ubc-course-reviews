import Link from 'next/link';
import { FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="sauder-blue-bk text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        {/* Main content container */}
        <div className="flex flex-col items-center justify-center">
          {/* Thank you message - centered */}
          <p className="mb-4 text-center max-w-xl mx-auto">
            Thank you for supporting this student-lead project!
            <br />
            You're awesome! Have a great day :)
          </p>

          {/* Social links */}
          <div className="flex space-x-6">
            <Link 
              href="https://github.com/HaydenChan8619/" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              <FaGithub size={24} />
            </Link>
            
            <Link
              href="https://www.linkedin.com/in/haydenphchan/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              <FaLinkedin size={24} />
            </Link>
            
            <Link
              href="https://www.youtube.com/@HaydenChanUBC"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              <FaYoutube size={24} />
            </Link>
          </div>
        </div>
        <div className='pt-4'></div>
        <div className="border-t border-gray-700 pt-4 text-center text-sm w-full">
            <div>Created by Hayden Chan</div>
        </div>
        </div>
    </footer>
  );
}