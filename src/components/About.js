const About = () => {
    // style={{ fontWeight: 600 }}
    return (
        <article>
            <h2>What are WBGT and UTCI?</h2>
            <p>
                Wet Bulb Globe Temperature (WBGT) and Universal Thermal Climate
                Index (UTCI) are{" "}
                <span className="bold">thermal stress indexes</span> - numbers
                that describe the risk of thermal stress. They can also be used
                as measurements of apparent temperature, helping you predict how
                you will <em>feel</em>.
            </p>
            <h2>Why use WBGT and UTCI?</h2>
            <p>
                Both consider the effects of temperature, sunlight, wind, and
                humidity, among other environmental factors, resulting in
                numbers that are more meaningful than single measurements like
                temperature and simple indexes like heat index (which only
                considers temperature and humidity).
            </p>
            <h2>Which is better?</h2>
            <p>
                While both are meaningful, UTCI appears to be better than WBGT:
            </p>
            <p>
                UTCI was developed in 2004 through collaboration between 45
                scientists from 23 countries in an effort to improve upon the
                limitations of older thermal indexes, including WBGT. It is a
                meaningful predictor of both heat stress and cold stress.
            </p>
            <p>
                WGBT was developed by the US military in the 1950s in order to
                avoid heat-related illnesses at training camps. It's continued
                use is the result of its long history and inclusion in many
                regulations concerning heat stress.
            </p>
            <h2>Why are WBGT and UTCI forecasts hard to find?</h2>
            <p>
                The meteorological measurements required for calculating WBGT
                and UTCI are not easily available and often require expensive
                equipment. However, there are algorithms that closely
                approximate WBGT and UTCI using standard outputs from global
                weather forecasting models. These algorithms are how Weather for
                Humans determines forecasts.
            </p>
            <h2>Limitations</h2>
            <p>
                Every person's body is different, and neither WBGT, UTCI, nor
                any other weather-derived thermal index can account for human
                factors such as activity level and clothing insulation. Instead,
                they are modeled based on average human characteristics.
            </p>
            <p>
                Additionally, forecasts are applicable to a general area and
                cannot account for your immediate environment, such as whether
                you are standing in the shade or the sun.
            </p>
            <p>
                To overcome these limitations, consider how your human factors
                may alter the forecast and how your local environment may differ
                from the averaged forecast inputs (sun, wind, temperature, and
                humidity).
            </p>
        </article>
    );
};

export default About;
