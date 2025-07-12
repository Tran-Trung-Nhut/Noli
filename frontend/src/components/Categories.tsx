const Categories = () => {
    const categories = [
    { id: 1, name: 'Nam', image: 'https://images.unsplash.com/photo-1499714608240-22fc391a4e83?auto=format&fit=crop&w=500&q=80' },
    { id: 2, name: 'Nữ', image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=500&q=80' },
    { id: 3, name: 'Trẻ Em', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb9d20ac?auto=format&fit=crop&w=500&q=80' },
    { id: 4, name: 'Phụ Kiện', image: 'https://images.unsplash.com/photo-1524498250077-390f9e378fc6?auto=format&fit=crop&w=500&q=80' },
    ];
    return (
    <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-6">Danh Mục</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(category => (
            <div key={category.id} className="relative hover:scale-105 duration-500">
                <img src={category.image} alt={category.name} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                </div>
            </div>
        ))}
        </div>
    </section>
    );
};

export default Categories