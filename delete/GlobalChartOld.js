import { useState, useEffect, useRef } from "react";
import { BsCaretRight, BsCaretLeft } from "react-icons/bs";
import { IoExpand, IoClose, IoExpandSharp } from "react-icons/io5";

import Modal from "./StaticModal";

import { motion, AnimatePresence } from "framer-motion";

import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
} from "body-scroll-lock";

import map from "../assets/images/MillerCropped.png";

const GlobalChart = () => {
    const [day, setDay] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    const globalImg = useRef();
    const modalImg = useRef();

    const charts = useEffect(() => {
        console.log(
            "TODO - fetch knowledge of latest charts, build list of needed charts"
        );
        //TODO
    }, []);

    const fullscreenTransition = {
        duration: 0.5,
        type: "spring",
        bounce: 0,
    };

    const openFullscreen = () => {
        disableBodyScroll(modalImg, {
            reserveScrollBarGap: true,
        });
        let boundingClient = globalImg.current.getBoundingClientRect();
        let viewportWidth = window.document.body.clientWidth;
        let viewportHeight = window.document.body.clientHeight;
        let screenAspect = viewportWidth / viewportHeight;
        let imgAspect = boundingClient.width / boundingClient.height;
        let from = {
            top: `${boundingClient.y + window.scrollY}px`,
            left: `${boundingClient.x + window.scrollX}px`,
            width: `${boundingClient.width}px`,
        };
        let to, width, height;
        if (screenAspect > imgAspect) {
            width = viewportHeight * screenAspect;
            to = {
                top: `${window.scrollY}px`,
                left: `${window.scrollX + viewportWidth / 2 - width / 2}px`,
                width: `${width}px`,
            };
        } else {
            height = viewportWidth / imgAspect;
            to = {
                top: `${window.scrollY + viewportHeight / 2 - height / 2}px`,
                left: "0px",
                width: `${viewportWidth}px`,
            };
        }
        console.log({ from, to });
        setFullscreen({ from, to });
    };

    const closeFullscreen = () => {
        enableBodyScroll(modalImg);
        setFullscreen(false);
    };

    // Clear any scroll locks on unmount
    // useEffect(() => {
    //     return () => clearAllBodyScrollLocks();
    // }, []);

    let today = useRef(new Date());
    today.current.setUTCHours(0);
    today.current.setUTCMinutes(0);
    today.current.setUTCMilliseconds(0);

    return (
        <>
            <div className="global-chart_container">
                <div className="global-chart_inset"></div>
                <motion.img
                    onDoubleClick={openFullscreen}
                    ref={globalImg}
                    className="global-chart_image"
                    src={map}
                    alt="global temperatures"
                    style={{ opacity: fullscreen ? 0 : 1 }}
                />
                <div className="global-chart_controls-container">
                    <div className="global-chart_time-controls">
                        <button>
                            <BsCaretLeft />
                        </button>
                        <h4>Today, August 1</h4>
                        <button>
                            <BsCaretRight />
                        </button>
                    </div>
                    <button
                        className="global-chart_fullscreen-button"
                        onClick={fullscreen ? closeFullscreen : openFullscreen}
                    >
                        <IoExpand />
                    </button>
                </div>
            </div>
            <Modal openCondition={fullscreen} exit={closeFullscreen}>
                {(modal) => (
                    <motion.img
                        ref={modalImg}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={modal.exit}
                        className="global-chart_image"
                        src={map}
                        alt="global temperatures"
                        style={{ position: "absolute" }}
                        initial={fullscreen.from}
                        animate={fullscreen.to}
                        exit={fullscreen.from}
                        transition={modal.transition}
                    />
                )}
            </Modal>
            {/* <AnimatePresence>
                {fullscreen && (
                    <motion.div
                        className="modal-background"
                        key={"modal-background"}
                        initial={{
                            backdropFilter: "blur(0px) brightness(1)",
                        }}
                        animate={{
                            backdropFilter: "blur(4px) brightness(.3)",
                        }}
                        exit={{
                            backdropFilter: "blur(0px) brightness(1)",
                        }}
                        transition={fullscreenTransition}
                        style={{
                            height: window.document.body.scrollHeight,
                        }}
                        onClick={leaveFullscreen}
                    >
                        <motion.img
                            ref={modalRef}
                            onClick={(e) => e.stopPropagation()}
                            onDoubleClick={leaveFullscreen}
                            className="global-chart_image"
                            src={map}
                            alt="global temperatures"
                            style={{ position: "absolute" }}
                            initial={fullscreen.from}
                            animate={fullscreen.to}
                            exit={fullscreen.from}
                            transition={fullscreenTransition}
                        />
                    </motion.div>
                )}
            </AnimatePresence> */}
        </>
    );
};

export default GlobalChart;
