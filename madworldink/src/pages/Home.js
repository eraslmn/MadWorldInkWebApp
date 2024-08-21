import React from 'react';
import '../css/styles.css'; // Import global styles if necessary
import Header from '../homecomponents/Header';
import ShoppingList from '../homecomponents/ShoppingList';
import HomeContent from '../homecomponents/HomeContent';
import Collection from '../homecomponents/Collection';
import Latest from '../homecomponents/Latest';
import HomeDecor from '../homecomponents/HomeDecor';
import Footer from '../homecomponents/Footer';
import { CartProvider } from '../homecomponents/CartContext';

const Home = () => {
    return (
        <CartProvider>
            <Header />
            <ShoppingList />
            <main className="main">
                <HomeContent />
                <h2 className="section__title" id="collections" style={{ paddingTop: '6rem', color:'black'}}><span className="light">SHOP ONLINE</span></h2>
                <Collection />
                <Latest />
                <hr size="15" width="100%" color="black" />
                <HomeDecor />
            </main>
            <Footer />
        </CartProvider>
    );
}

export default Home;
