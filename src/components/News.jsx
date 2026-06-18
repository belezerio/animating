import React from 'react';

const News = () => {
    const articles = [
        {
            date: "14.06.2026",
            title: "How we disrupted the global luxury market at this year's design forum.",
            excerpt: "Our creative directors shared insights on creating brand desire by challenging traditional aesthetic values and adopting bolder narratives.",
            link: "#"
        },
        {
            date: "28.05.2026",
            title: "Redefining Toblerone: A vibrant, geometric transformation of a classic.",
            excerpt: "A deep dive into our design strategy behind the geometric branding, packaging, and custom typography that modernized a legendary sweet brand.",
            link: "#"
        },
        {
            date: "10.05.2026",
            title: "Bulletproof secures double gold at the International Branding Awards.",
            excerpt: "We are honored to receive top accolades for our branding work on Tecate and the high-end luxury packaging for Ice Chalet.",
            link: "#"
        }
    ];

    return (
        <section id="news" className="news-section reveal-section">
            <div className="news-container">
                <div className="news-header">
                    <h2 className="section-title">ALWAYS MAKING<br />HEADLINES</h2>
                    <a href="#" className="cta-link">VIEW ALL NEWS <span class="arrow">&rarr;</span></a>
                </div>
                
                <div className="news-grid">
                    {articles.map((article, idx) => (
                        <div key={idx} className="news-item">
                            <span className="news-date">{article.date}</span>
                            <h3 className="news-title">{article.title}</h3>
                            <p className="news-excerpt">{article.excerpt}</p>
                            <a href={article.link} className="news-link">READ ARTICLE <span className="arrow">&rarr;</span></a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default News;
