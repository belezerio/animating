import React from 'react';

const CityTicker = () => {
    const col1 = ["LONDON", "NEW YORK", "SINGAPORE", "SYDNEY", "AMSTERDAM"];
    const col2 = ["TOKYO", "BERLIN", "SHANGHAI", "LOS ANGELES", "MUMBAI"];
    const col3 = ["CHICAGO", "PARIS", "MELBOURNE", "MILAN", "SAO PAULO"];

    return (
        <section className="ticker-section">
            <div className="ticker-bg" style={{ backgroundImage: "url('/assets/ticker_bg.png')" }}></div>
            <div className="ticker-overlay"></div>
            <div className="ticker-container">
                {/* Column 1: Scrolls Up */}
                <div className="ticker-col col-up">
                    <div className="ticker-track">
                        {col1.map((city, idx) => <div key={idx} className="ticker-item">{city}</div>)}
                        {col1.map((city, idx) => <div key={`dup-${idx}`} className="ticker-item">{city}</div>)}
                    </div>
                </div>

                {/* Column 2: Scrolls Down */}
                <div className="ticker-col col-down">
                    <div className="ticker-track">
                        {col2.map((city, idx) => <div key={idx} className="ticker-item">{city}</div>)}
                        {col2.map((city, idx) => <div key={`dup-${idx}`} className="ticker-item">{city}</div>)}
                    </div>
                </div>

                {/* Column 3: Scrolls Up */}
                <div className="ticker-col col-up">
                    <div className="ticker-track">
                        {col3.map((city, idx) => <div key={idx} className="ticker-item">{city}</div>)}
                        {col3.map((city, idx) => <div key={`dup-${idx}`} className="ticker-item">{city}</div>)}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CityTicker;
