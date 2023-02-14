import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Layout.css";


const LayoutWithNav = ({children}) => {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />    
    </main>
  )
};  

export default LayoutWithNav;