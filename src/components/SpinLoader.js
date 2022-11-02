const SpinLoader = ({ className }) => {
    return (
        <span className={className ? "loader " + className : "loader"}></span>
    );
};

export default SpinLoader;
