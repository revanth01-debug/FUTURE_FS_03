import { useState } from "react"
import { SkeletonButton } from "../styling/skelton";


function Categories ({props, callBack}) {
    const data = props;
    const [selectedCategory, setSelectedCategory] = useState("All");
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        callBack(category);
    };

    return (
        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible w-full md:min-w-[240px] p-2 sm:p-4 gap-2 sm:gap-3 shadow-md border border-slate-200 bg-white rounded-2xl">
            <p className="hidden md:block font-semibold text-lg text-slate-700 mb-1">Categories</p>
            <button
                className={selectedCategory==="All" ? "bg-green-500 text-white px-3 py-2 rounded-lg whitespace-nowrap transition" : "px-3 py-2 whitespace-nowrap rounded-lg text-slate-600 hover:bg-slate-100 transition"}
                onClick={() => handleCategoryClick("All")}
            >
                All
            </button>
            {data.length > 0 ? data.map((each) => (
                <button
                    onClick={() => handleCategoryClick(each.name)}
                    className={selectedCategory===each.name ? "bg-green-500 text-white px-3 py-2 rounded-lg whitespace-nowrap transition" : "px-3 py-2 whitespace-nowrap rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"}
                    key={each.name}
                >
                    {each.name}
                </button>
            )) : (
                Array.from({ length: 8 }).map((_, i) => <SkeletonButton key={i} />)
            )}
        </div>
    )
}

export default Categories
