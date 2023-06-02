import "./Animation.css";

const AnimationComponent = () => {
  return (
    <div style={{ position: "absolute", bottom: "0" }}>
      <span className="bouncing-dots"></span>
      <span className="bouncing-dots"></span>
      <span className="bouncing-dots"></span>
    </div>
  );
};

export default AnimationComponent;
