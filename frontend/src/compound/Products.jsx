import { useCart } from "../contexts/CartContext";
function Products({ pros }) {
    const { cartItems, addItem, removeItem } = useCart();

    return (
        <section>
            <h1 className="font-semibold text-lg sm:text-xl mb-4 text-slate-800">{pros.name}</h1>
            <div className="grid grid-cols-1 min-[500px]:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
                {pros.products.map(each => {
                    const count = cartItems[each.id]?.count || 0;
                    return (
                        <div
                            key={each.id}
                            className="flex flex-col w-full rounded-2xl p-3 sm:p-4 bg-white shadow-sm border border-slate-200 hover:shadow-md transition"
                        >
                            <img
                                className="h-32 sm:h-40 w-full object-cover rounded-xl mb-3"
                                alt={each.name}
                                src={each.image}
                            />
                            <div className="flex flex-row justify-between items-center gap-2">
                            <div className="mb-2 text-slate-700">
                                <p className="flex justify-between text-xs sm:text-sm">
                                    
            
                                    <span className="break-words">{each.name.slice(0,30)}</span>
                                </p>
                                <p className="flex justify-between text-xs sm:text-sm text-slate-500">
                                
                                    <span>{each.weight}</span>
                                </p>
                                <p className="flex justify-between text-sm font-semibold text-green-600">
                                    <span>{each.price}</span>
                                </p>
                            </div>
                            <div>
                            {count > 0 ? (
                                <div className="text-green-600 text-xs sm:text-sm border py-1 mt-auto rounded-lg border-green-500 flex items-center justify-around min-w-20">
                                    <button onClick={() => removeItem(each)} className="text-md px-2 hover:cursor-pointer">-</button>
                                    <p>{count}</p>
                                    <button onClick={() => addItem(each)} className="text-md px-2 hover:cursor-pointer">+</button>
                                </div>
                            ) : (
                                <button onClick={() => addItem(each)} className="px-4 mx-auto py-2 border border-green-500 text-green-600 hover:cursor-pointer font-semibold rounded-lg hover:bg-green-500 hover:text-white transition duration-300">
                                    Add
                                </button>
                            )}
                            </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Products;