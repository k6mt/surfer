const Loader: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <div className="loader" style={{ width: size, height: size }} />
);

export default Loader;
