import { useState } from "react";
import No_Job from "../assets/product-not-found.svg"

const RecruitmentPage = () => {
    const [jobs] = useState<any[]>([]); // bạn sẽ tự xử lý data sau


    return (
        <main className="min-h-screen bg-white text-gray-800">
            <header className="w-full bg-sky-500 text-white py-16 shadow-md">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Tuyển dụng — NoliShop</h1>
                    <p className="mt-4 text-lg md:text-xl opacity-90">Gia nhập đội ngũ của chúng tôi — cùng xây dựng trải nghiệm mua sắm tuyệt vời.</p>
                </div>
            </header>


            <section className="container mx-auto px-6 max-w-5xl py-12">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold">Cơ hội nghề nghiệp</h2>


                    {/* Khi jobs rỗng */}
                    {jobs.length === 0 ? (
                        <div className="mt-8 text-center py-12 flex flex-col justify-center items-center">
                            <img src={No_Job} className="w-40"/>
                            <h3 className="mt-6 text-xl font-semibold">Hiện tại chúng tôi không tuyển dụng</h3>
                            <p className="mt-2 text-gray-600">Cảm ơn bạn đã quan tâm đến NoliShop. Nếu bạn muốn, hãy gửi hồ sơ tự nguyện về email <strong>hello@noli.example</strong> — chúng tôi sẽ lưu lại và liên hệ khi có vị trí phù hợp.</p>
                            <div className="mt-6 flex justify-center">
                                <a href="mailto:hello@noli.example" className="inline-block bg-sky-500 text-white rounded-lg px-6 py-2 font-semibold shadow">Gửi hồ sơ ngay</a>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {jobs.map((job, idx) => (
                                <div key={idx} className="border rounded-lg p-4">
                                    <h4 className="font-semibold">{job.title}</h4>
                                    <p className="mt-1 text-sm text-gray-600">{job.location} • {job.type}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default RecruitmentPage