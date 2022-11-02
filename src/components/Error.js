import { BiError } from "react-icons/bi";

const Error = ({ message }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className="error">
            <BiError />
            {message}
        </div>
    );
};

export default Error;
