const Footer = ({ openCoverage }) => {
    return (
        <footer>
            <button className="show-coverage-map">contact</button>
            <span className="show-coverage-map">&emsp;|&emsp;</span>
            <button className="show-coverage-map">additional options</button>
            <span className="show-coverage-map">&emsp;|&emsp;</span>
            <button className="show-coverage-map" onClick={openCoverage}>
                coverage map
            </button>
        </footer>
    );
};

export default Footer;
