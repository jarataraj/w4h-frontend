import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ children, openCondition, exit, animate }) => {
    const transition = {
        duration: 0.5,
        type: "spring",
        bounce: 0,
    };

    return (
        <AnimatePresence>
            {openCondition && (
                <motion.div
                    className="modal-background"
                    key={"modal-background"}
                    initial={{
                        backdropFilter: "blur(0px) brightness(1)",
                    }}
                    animate={
                        animate || {
                            backdropFilter: "blur(4px) brightness(.3)",
                        }
                    }
                    exit={{
                        backdropFilter: "blur(0px) brightness(1)",
                    }}
                    transition={transition}
                    onClick={exit}
                >
                    {children({ exit, transition })}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
