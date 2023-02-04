import useBinaryState from "hooks/useBinaryState";
import { AnimatePresence, motion } from "framer-motion";
import ColorBar from "./ColorBar";
import { MdClear } from "react-icons/md";

const Footer = ({ openCoverage }) => {
    const [contact, toggleContact] = useBinaryState();

    return (
        <footer>
            <AnimatePresence>
                {contact && (
                    <motion.div
                        className="contact-info"
                        initial={{ top: 0 }}
                        animate={{ top: -45 }}
                        exit={{
                            top: 0,
                            transition: { type: "tween", duration: 0.2 },
                        }}
                    >
                        jordan@weatherforhumans.com
                        <button
                            className="close-contact-info"
                            onClick={toggleContact}
                        >
                            <MdClear />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            <ColorBar className="footer-color-bar" />
            <div className="footer-links-container">
                <button className="footer-link" onClick={toggleContact}>
                    contact
                </button>
                <span>&emsp;|&emsp;</span>
                <button className="footer-link">additional options</button>
                <span>&emsp;|&emsp;</span>
                <button className="footer-link" onClick={openCoverage}>
                    coverage map
                </button>
            </div>
        </footer>
    );
};

export default Footer;
