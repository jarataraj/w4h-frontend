const About = () => {
    // style={{ fontWeight: 600 }}
    return (
        <article className="about-article">
            <div className="about-row">
                <div className="about-section">
                    <h2 className="about-section-header">
                        What are UTCI and WBGT?
                    </h2>
                    <p className="about-paragraph">
                        UTCI and WBGT are two of the best available measurements
                        of{" "}
                        <span className="extra-bold">apparent temperature</span>{" "}
                        - how hot or cold you will <em>feel</em> given the
                        temperature, sunlight, wind, and humidity of your
                        surroundings. They were created for use as{" "}
                        <span className="extra-bold">
                            thermal stress indexes
                        </span>{" "}
                        - numbers that describe the risk of experiencing heat or
                        cold stress in an environment.
                    </p>
                </div>
                <div className="about-section">
                    <h2 className="about-section-header">
                        Why use UTCI and WBGT?
                    </h2>
                    <p className="about-paragraph">
                        Both consider the effects of temperature, sunlight,
                        wind, and humidity, among other environmental factors,
                        resulting in numbers that are more meaningful than
                        single measurements like temperature and simple indexes
                        like heat index (which only considers temperature and
                        humidity).
                    </p>
                </div>
            </div>
            <div className="about-row">
                <div className="about-section">
                    <h2 className="about-section-header">Which is better?</h2>
                    <p className="about-paragraph">
                        While both are meaningful, UTCI appears to be better
                        than WBGT:
                    </p>
                    <p className="about-paragraph">
                        UTCI was developed in 2004 through collaboration between
                        45 scientists from 23 countries in an effort to improve
                        upon the limitations of older thermal indexes, including
                        WBGT. It is a meaningful predictor of both heat stress
                        and cold stress.
                    </p>
                    <p className="about-paragraph">
                        WGBT was developed by the US military in the 1950s in
                        order to avoid heat-related illnesses at training camps.
                        It's continued use is the result of its long history and
                        inclusion in many regulations concerning heat stress.
                    </p>
                </div>
                <div className="about-section">
                    <h2 className="about-section-header">
                        Why are UTCI and WBGT forecasts hard to find?
                    </h2>
                    <p className="about-paragraph">
                        The meteorological measurements required for calculating
                        UTCI and WBGT are not easily available and often require
                        expensive equipment. However, there are algorithms that
                        closely approximate UTCI and WBGT using standard outputs
                        from global weather forecasting models. These algorithms
                        are how Weather for Humans determines forecasts.
                    </p>
                </div>
            </div>
            <div className="about-row">
                <div className="about-section">
                    <h2 className="about-section-header">Limitations</h2>
                    <p className="about-paragraph">
                        Every person's body is different, and neither UTCI,
                        WBGT, nor any other weather-derived thermal index can
                        account for human factors such as activity level and
                        clothing insulation. Instead, they are modeled based on
                        average human characteristics.
                    </p>
                    <p className="about-paragraph">
                        Additionally, forecasts are applicable to a general area
                        and cannot account for your immediate environment, such
                        as whether you are standing in the shade or the sun.
                    </p>
                    <p className="about-paragraph">
                        To overcome these limitations, consider how your human
                        factors may alter the forecast and how your local
                        environment may differ from the averaged forecast inputs
                        (sun, wind, temperature, and humidity).
                    </p>
                </div>
            </div>
        </article>
    );
};

export default About;
