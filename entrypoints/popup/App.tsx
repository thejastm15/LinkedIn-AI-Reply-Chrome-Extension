import "./App.css";
import "./globals.css";

function App() {
  return (
    <>
      <div className="p-6 w-[15rem]">
        <div className="pt-4 pb-2">
          <h1 className="text-xl text-center font-bold">Welcome to LinkedIn Message input</h1>
        </div>
        <div className="p-2">
          <p className="text-base text-center ">I will help you to write professional replies</p>
          <div className="mt-4 flex justify-center items-center">
            <a href="https://www.linkedin.com/login"  target="self" className="bg-green-600 text-white font-bold rounded-full p-3 hover:bg-green-300">Click here</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
