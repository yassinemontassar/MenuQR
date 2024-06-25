
const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <div className="animate-bounce rounded-full border-8 border-orange-600 border-opacity-40 h-40 w-40 flex items-center justify-center ">
      <span className="text-xl font-bold text-orange-600">MenuRapide</span>
    </div>
    <p className="text-xl font-bold text-orange-600">Loading...</p>
  </div>
  );
}
 
export default Loading;