const Categories = () => {
    const categories = [
    { id: 1, name: 'Túi xách', image: 'https://product.hstatic.net/200000685523/product/img_6996_073df1dfd7004501bb4ec1f6934c8d81.jpeg' },
    { id: 2, name: 'Túi đeo vai', image: 'https://file.hstatic.net/200000835085/file/phu-hop-mang-lai-loi-ich-toi-da__web__3fe41831ce44478398a3c405fa5d9f97.png' },
    { id: 3, name: 'Balo Mini', image: 'https://zongvietnam.com/wp-content/uploads/2025/03/balo-mini-thoi-trang-sieu-nhe-nho-gon-es7159-21-247x247.jpg' },
    { id: 4, name: 'Balo', image: 'https://cdn.kosshop.vn/wp-content/uploads/2021/02/2660013028903-balo-dung-may-anh-va-laptop-01.jpg' },
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