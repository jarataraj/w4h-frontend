const Footer = ({ openCoverage }) => {
    return (
        <footer>
            <button className="show-coverage-map">contact</button>
            <span>&emsp;|&emsp;</span>
            <button className="show-coverage-map">additional options</button>
            <span>&emsp;|&emsp;</span>
            <button className="show-coverage-map" onClick={openCoverage}>
                coverage map
            </button>
        </footer>
    );
};

export default Footer;
