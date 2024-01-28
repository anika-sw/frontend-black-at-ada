import Navbar from './Navbar';
import Footer from './Footer';

const LayoutWithNav = ({ children }) => {
	return (
		<main>
			<Navbar />
			{children}
			<Footer />
		</main>
	);
};

export default LayoutWithNav;
