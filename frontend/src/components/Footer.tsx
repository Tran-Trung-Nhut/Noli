const Footer = () => {
    return (
    <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
        <p className="text-gray-600">&copy; 2025 FashionStore. Mọi quyền được bảo lưu.</p>
        <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-sky-500">FB</a>
            <a href="#" className="text-gray-600 hover:text-sky-500">IG</a>
        </div>
        </div>
    </footer>
    );
};

export default Footer