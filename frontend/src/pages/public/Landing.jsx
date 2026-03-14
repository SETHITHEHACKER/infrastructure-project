import "../../styles/landing.css";

function Landing() {
  return (
    <main className="main-content">
      <div className="hero">
        <h1>My City My Responsibility</h1>
        <p className="hero-desc">
          Upload request of infrastructure damage, get it validated and monitor repair status.
        </p>
      </div>

      <div className="cards">
        <div className="card">
          <span className="icon">📝</span>
          <h3>Submit Damage</h3>
          <p>Take a photo of infrastructure damage</p>
        </div>

        <div className="card">
          <span className="icon">✅</span>
          <h3>Get Validated</h3>
          <p>Sanitization officers repair damage</p>
        </div>

        <div className="card">
          <span className="icon">📊</span>
          <h3>The City Clean</h3>
          <p>Contribute to Making the City Clean</p>
        </div>
      </div>
    </main>
  );
}

export default Landing;
