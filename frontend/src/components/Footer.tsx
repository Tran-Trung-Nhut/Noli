import { FaFacebookSquare, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
    <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <p className="text-gray-600">
                &copy; 2025 NoliShop. Mọi quyền được bảo lưu.
                 Powered by <a href="https://trantrungnhut.vercel.app" className="underline">Trần Trung Nhựt</a>
            </p>
            <div className="flex space-x-4">
                <a 
                href="https://www.facebook.com/profile.php?id=100071433255220" 
                target="_blank" 
                className="text-blue-800 hover:scale-110 duration-500">
                    <FaFacebookSquare size={28}/>
                </a>
                <a href="#" className="text-[#E1306C] hover:scale-110 duration-500"><FaInstagram size={28}/></a>
            </div>
        </div>
    </footer>
    );
};

export default Footer