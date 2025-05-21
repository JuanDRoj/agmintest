import "../styles/MapStyles.css";

const DocsInfo = ({}) => {
  const docLink = "https://www.passdropit.com/TqjbPrYS"; // Also visible in code

  return (
    <div id="docs">
      <h3>Documentation</h3>
      <a href={docLink} target="_blank" rel="noopener noreferrer">
        Open Documentation
      </a>
    </div>
  );
};

export default DocsInfo;
